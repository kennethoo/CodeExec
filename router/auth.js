import express from "express";
const router = express.Router();
import parser from "ua-parser-js";
import moment from "moment";
import User from "../models/sighup.js";
import bcrypt from "bcryptjs";
import Session from "../models/session.js";
import { UserProfile } from "../application/userProfile.js";
import userApiKeysApi from "../application/userApiKeysApi.js";

router.get("/api/v1/logout", (req, res) => {
  if (req.session.user) {
    req.session.destroy();
    res.send(JSON.stringify("Login"));
  } else {
    res.send(JSON.stringify("You are not Login"));
  }
});

router.post("/api/v1/change-password", (req, res) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        bcrypt.compare(
          req.body.oldPassword,
          user.password,
          function (err, same) {
            if (same) {
              bcrypt.hash(req.body.newPassword, 10, (error, hash) => {
                User.findOneAndUpdate(
                  { username: req.body.username },
                  { password: hash }
                ).then((result) => {
                  res.send(JSON.stringify("succeeded"));
                });
              });
            } else {
              res.send(JSON.stringify("Your password is incorect"));
            }
          }
        );
      } else {
        res.send(JSON.stringify("This username do not exist"));
      }
    })
    .catch((error) => {});
});

router.post("/api/v1/update-password", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      bcrypt.hash(req.body.newPassword, 10, (error, hash) => {
        User.findOneAndUpdate(
          { email: req.body.email },
          { password: hash }
        ).then((result) => {
          res.send({ succeeded: true });
        });
      });
    } else {
      res.send(JSON.stringify("User does not exit"));
    }
  });
});

router.post("/api/login", async (req, res) => {
  const ua = parser(req.headers["user-agent"]);
  const device = req.body.device?.length ? req.body.device : ua.os.name;
  if (req.body.isGoogleAccount) {
    const user = await User.findOne({ email: req.body.email });
    if (user && user.isGoogleAccount) {
      req.session.user = {
        userId: user._id.toString(),
        region: req.body.region,
        city: req.body.city,
        time: moment().utc().format(),
        device,
      };
      res.send({
        succeeded: true,
        user,
      });
    } else {
      res.send({
        succeeded: false,
        errorMessage: "Sorry 😅 Invalid email or password",
      });
    }
    return;
  }
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        bcrypt.compare(req.body.password, user.password, function (err, same) {
          if (same) {
            req.session.user = {
              userId: user._id.toString(),
              region: req.body.region,
              city: req.body.city,
              time: moment().utc().format(),
              device,
            };
            res.send({
              succeeded: true,
              user,
            });
          } else {
            res.send({
              succeeded: false,
              errorMessage: "Sorry 😅 Invalid email or password",
            });
          }
        });
      } else {
        res.send({
          succeeded: false,
          errorMessage: "Sorry 😅 Invalid email or password",
        });
      }
    })
    .catch((error) => {});
});

router.get("/api/check-login", (req, res) => {
  if (req.session?.user) {
    UserProfile.findOne({ userId: req.session.user?.userId })
      .then((user) => {
        if (user) {
          res.send({ user, isLogIn: true });
        } else {
          res.send({ user, isLogIn: false });
        }
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  } else {
    res.send({ isLogIn: false });
  }
});

router.post("/api/register", (req, res) => {
  const ua = parser(req.headers["user-agent"]);
  const { email, username } = req.body;
  if (!email || !username) {
    res.send({
      succeeded: false,
      errorMessage: "something is missing , please use the correct flow",
    });
    return;
  }
  User.findOne({ email: req.body.email })
    .then(async (result) => {
      if (result == null) {
        User.findOne({ username: req.body.username }).then((result) => {
          if (result == null) {
            User.create(req.body).then(async (result) => {
              req.session.user = {
                userId: result._id.toString(),
                region: req.body.timeZone,
                city: "",
                time: moment().utc().format(),
                device: ua.os.name,
              };

              //await userApiKeysApi.createKey(result.id);
              UserProfile.create({
                userId: result.id,
                username: result.username,
                fullName: result.fullName,
                profile: "",
                blocked: false,
                email: result.email,
                canActivate: false,
                private: false,
                isAdmin: false,
                timeZone: req.body.timeZone,
              }).then((result) => {
                res.send({
                  succeeded: true,
                  result,
                });
              });
            });
          } else {
            res.send({
              succeeded: false,
              errorMessage: "username already exist",
            });
          }
        });
      } else {
        res.send({
          succeeded: false,
          errorMessage: "Email already exist",
        });
      }
    })

    .catch((error) => {});
});

router.get("/api/sessions", (req, res) => {
  if (req.session.user) {
    Session.find({ "session.user.userId": req.session.user?.userId }).then(
      (result) => {
        res.send(result);
      }
    );
  } else {
    res.send({ succeeded: false });
  }
});

router.post("/api/remove/session", (req, res) => {
  if (req.session.user) {
    Session.deleteOne({ _id: req.body.id })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        return;
      });
  } else {
    res.send({ succeeded: false });
  }
});

router.post("/google/login", (req, res) => {
  if (req.session.user) req.session.destroy();
  User.findOne({ email: req.body.email }).then((result) => {
    if (result) {
      req.session.user = {
        userId: result._id.toString(),
        email: result.email,
      };
      res.send({ succes: true });
    } else {
      User.create({
        username: req.body.name,
        profileUrl: req.body.picture,
        email: req.body.email,
        googleId: req.body.credential,
        connectedAccounts: [],
        musicsyncspace: false,
      }).then((result) => {
        req.session.user = {
          userId: result._id.toString(),
          email: result.email,
        };
        res.send({ succes: true });
      });
    }
  });
});
export default router;

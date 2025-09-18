import message from "../funnyerrorMessage/notLogin.js";

const checkSession = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.status(401).send(message);
  }
  next();
};
export default checkSession;

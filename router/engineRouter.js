import express from "express";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
import apiGateWay from "../apiGateWay.js";

router.post("/api/v1/execute", async function (req, res) {
  const data = await apiGateWay.executeCode(req.body);
  res.send(data);
});

//expensveApi
router.post("/api/v2/execute", async function (req, res) {
  const data = await apiGateWay.executeCodev2(req.body);
  res.send(data);
});

export default router;

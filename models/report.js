import mongoose from "mongoose";
const Schema = mongoose.Schema;

let reports = new Schema({
  item: String,
  kind: String,
  detail: String,
});

const Reports = mongoose.model("reportcontent", reports);
module.exports = Reports;

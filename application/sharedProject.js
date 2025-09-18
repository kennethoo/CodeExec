import mongoose from "mongoose";
import moment from "moment";
const Schema = mongoose.Schema;

const sharedProject = new Schema({
  originalProjectId: String,
  creatorId: String,
  title: String,
  description: String,
  language: String,
  code: String,
  projectFiles: [],
});

/** */

const Project = mongoose.model("sharedProject", sharedProject);

class SharedProjectApi {
  constructor() {
    this.CREATE_NEW_PROJECT = "create_new_project";
    this.UPDATE_PROJECT = "update_project";
    this.DELETE_PROJECT = "delete_project";
  }
  // this is to created a space

  create = async (payload) => {
    const result = await Project.create({
      ...payload,
      lastModified: moment.utc().format(),
    });
    return result;
  };
  update = async (payload) => {
    const { _id } = payload;
    const result = await Project.findOneAndUpdate(
      { _id },
      { ...payload, lastModified: moment.utc().format() }
    );
    return result;
  };

  delete = async (payload) => {
    const { _id } = payload;
    const result = await Project.deleteOne({ _id });
    return result;
  };

  get = async (query) => {
    const { limit, skip, filter } = query;
    const projects = await Project.find(filter)
      .sort({ _id: -1 })
      .limit(limit)
      .skip(skip);
    return { succeeded: true, projects };
  };

  handleAction = (actionPayload) => {
    const { action, payload } = actionPayload;
    if (action == this.CREATE_NEW_PROJECT) {
      return this.create(payload);
    } else if (action == this.UPDATE_PROJECT) {
      return this.update(payload);
    } else if (action == this.DELETE_PROJECT) {
      return this.delete(payload);
    }
    return { succeeded: false, errorMessage: "not valid actiin" };
  };
}

const sharedProjectApi = new SharedProjectApi();
export default sharedProjectApi;

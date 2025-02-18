import mongoose, { Schema, Document, Model } from "mongoose";

// Define types only where necessary

// User Schema
const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

// Tags Schema
const TagsSchema = new Schema({
  title: { type: String, required: true, unique: true },
  UserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

// Content Schema
const contentTypes = [
  "image",
  "video",
  "audio",
  "pdf",
  "text",
  "other",
  "string",
];

const ContentSchema = new Schema({
  link: { type: String, required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tags" }],
  UserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const LinksSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  UserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

// Link Schema
const LinkSchema = new Schema({
  hash: { type: String, required: true },
  UserId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

// Export models with minimal typing
export const UserModel = mongoose.model("User", UserSchema);
export const TagsModel = mongoose.model("Tags", TagsSchema);
export const ContentModel = mongoose.model("Content", ContentSchema);
export const LinksModel = mongoose.model("notes", LinksSchema);
export const LinkModel = mongoose.model("Link", LinkSchema);

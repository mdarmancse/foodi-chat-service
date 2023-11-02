import { Schema, SchemaTypes, model } from "mongoose";
import { v4 } from "uuid";

const schema = new Schema(
  {
    _id: {
      type: SchemaTypes.UUID,
      default: v4,
    },
    fileUrl: {
      type: String,
      default: "",
    },
    userId: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "chat_uploads",
    timestamps: true,
    versionKey: false,
    id: false,
    toJSON: {
      getters: true,
    },
    toObject: {
      getters: true,
    },
  },
);

export const Upload = model("Upload", schema);

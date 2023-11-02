import { Schema, SchemaTypes, model } from "mongoose";
import { v4 } from "uuid";

const message = new Schema(
  {
    content: {
      type: String,
      default: "",
    },
    fileUrls: {
      type: [String],
      default: [],
    },
    timestamp: {
      type: Date,
    },
    senderId: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
    id: false,
    versionKey: false,
    timestamps: false,
  },
);

const schema = new Schema(
  {
    _id: {
      type: SchemaTypes.UUID,
      default: v4,
    },
    ticketId: {
      type: String,
      default: "",
    },
    participantIds: {
      type: [Number],
      default: [],
    },
    messages: {
      type: [message],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "chat_rooms",
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

export const ChatRoom = model("ChatRoom", schema);

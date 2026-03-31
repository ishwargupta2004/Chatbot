import mongoose from "mongoose";

const detailSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true, // ek user ke multiple businesses allowed
    },

    supportName: {
      type: String,
      required: true,
      trim: true,
    },

    supportEmail: {
      type: String,
      required: true,
      unique: true, // globally unique — do alag users ek hi email use nahi kar sakte
      lowercase: true,
      trim: true,
    },

    supportDetails: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Detail = mongoose.models.Detail || mongoose.model("Detail", detailSchema);

export default Detail;
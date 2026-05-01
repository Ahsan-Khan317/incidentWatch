import mongoose from "mongoose";

const postmortemSchema = new mongoose.Schema(
  {
    incidentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Incident",
      required: true,
      unique: true,
    },

    summary: {
      type: String,
      required: true,
      trim: true,
    },

    rootCause: {
      type: String,
      required: true,
      trim: true,
    },

    resolution: {
      type: String,
      required: true,
      trim: true,
    },

    prevention: {
      type: String,
      required: true,
      trim: true,
    },

    aiGenerated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Postmortem = mongoose.model("Postmortem", postmortemSchema);

export default Postmortem;

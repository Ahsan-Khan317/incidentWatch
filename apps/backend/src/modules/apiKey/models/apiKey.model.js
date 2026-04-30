import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, "API key is required"],
      unique: true,
      trim: true,
    },
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Organization ID is required"],
    },
    name: {
      type: String,
      trim: true,
      default: "Default API Key",
    },
  },
  { timestamps: true },
);

const ApiKey = mongoose.model("ApiKey", apiKeySchema);
export default ApiKey;

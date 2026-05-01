import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "developer", "tester", "viewer"],
      default: "viewer",
    },
    inviteToken: {
      type: String,
      required: true,
      unique: true,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  },
  { timestamps: true },
);

const Invite = mongoose.model("Invite", inviteSchema);
export default Invite;

import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    oncall: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expertise: {
      type: [String],
      default: [],
    },
    tier: {
      type: Number,
      default: 1,
    },
    avatarColor: {
      type: String,
      default: "bg-blue-500/10 text-blue-500",
    },
  },
  { timestamps: true },
);

// Prevent duplicate membership
memberSchema.index({ userId: 1, organizationId: 1 }, { unique: true });

const Member = mongoose.model("Member", memberSchema);
export default Member;

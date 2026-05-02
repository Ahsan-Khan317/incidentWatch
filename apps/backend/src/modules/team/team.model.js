import mongoose, { Schema } from "mongoose";

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    description: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      default: "#3b82f6", // Default blue
    },
  },
  {
    timestamps: true,
  },
);

// Unique team name within an organization
teamSchema.index({ organizationId: 1, name: 1 }, { unique: true });

const Team = mongoose.model("Team", teamSchema);

export default Team;

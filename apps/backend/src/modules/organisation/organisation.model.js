import bcrypt from "bcrypt";
import mongoose from "mongoose";
const organizationSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    apiKeys: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ApiKey",
      },
    ],
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
);

organizationSchema.pre("save", async function () {
  // 🔐 Hash password
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

organizationSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Organization = mongoose.model("Organization", organizationSchema);
export default Organization;

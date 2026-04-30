import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
const organizationSchema = new mongoose.Schema({
  org_name: {
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
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
  },
  apiKey: {
    type: String,
    unique: true,
  },
  isverify: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

organizationSchema.pre("save", async function () {
  // 🔐 Hash password
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  // 🔑 Generate API key only once
  if (!this.apiKey) {
    this.apiKey = crypto.randomBytes(32).toString("hex");
  }
});

organizationSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Organization = mongoose.model("Organization", organizationSchema);
export default Organization;

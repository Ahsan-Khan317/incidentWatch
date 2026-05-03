import mongoose from "mongoose";
import Invite from "../apps/backend/src/modules/invite/invite.model.js";
import dotenv from "dotenv";

dotenv.config({ path: "./apps/backend/.env" });

async function checkInvites() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const invites = await Invite.find({});
    console.log(`Found ${invites.length} invites:`);
    invites.forEach((inv) => {
      console.log(
        `- Email: ${inv.email}, Token: ${inv.inviteToken}, Accepted: ${inv.isAccepted}`,
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkInvites();

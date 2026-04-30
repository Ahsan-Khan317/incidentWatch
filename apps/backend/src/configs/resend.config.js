import { Resend } from "resend";
import { ENV } from "./env.config.js";

export const resend = new Resend(ENV.RESEND_API_KEY);

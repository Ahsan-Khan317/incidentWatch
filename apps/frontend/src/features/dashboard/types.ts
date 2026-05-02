export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  expertise: string[];
  status: "on-duty" | "off-duty" | "away";
  avatarColor: string;
  tier?: number;
  userId?: string;
}

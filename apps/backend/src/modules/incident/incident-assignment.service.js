import Member from "@/modules/member/member.model.js";
import { logger } from "@/utils/logger.js";

const toId = (value) => {
  if (!value) return null;
  if (value._id) return String(value._id);
  return String(value);
};

const uniqueIds = (values = []) => {
  return [...new Set(values.map(toId).filter(Boolean))];
};

const normalizeTerms = (values = []) => {
  return values
    .flatMap((value) => String(value || "").split(/[^a-zA-Z0-9_-]+/))
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
};

const buildSearchText = ({ title, description, tags, serviceName, context }) => {
  return [
    title,
    description,
    serviceName,
    ...(Array.isArray(tags) ? tags : []),
    context ? JSON.stringify(context) : "",
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
};

const pickExpertiseMatches = async ({ orgId, title, description, tags, serviceName, context }) => {
  const searchText = buildSearchText({ title, description, tags, serviceName, context });
  const tagTerms = normalizeTerms(tags);

  const members = await Member.find({
    organizationId: orgId,
    isActive: true,
    userId: { $exists: true, $ne: null },
  })
    .populate("userId", "name email")
    .sort({ oncall: -1, tier: 1, updatedAt: -1 })
    .limit(50);

  const scoredMembers = members
    .map((member) => {
      const expertise = normalizeTerms(member.expertise);
      const expertiseScore = expertise.reduce((score, skill) => {
        if (tagTerms.includes(skill)) return score + 3;
        if (searchText.includes(skill)) return score + 1;
        return score;
      }, 0);

      return {
        member,
        score: expertiseScore + (member.oncall ? 0.5 : 0),
        expertiseScore,
      };
    })
    .filter(({ expertiseScore }) => expertiseScore > 0)
    .sort((a, b) => b.score - a.score || Number(a.member.tier || 1) - Number(b.member.tier || 1));

  if (scoredMembers.length > 0) {
    return {
      ids: uniqueIds(scoredMembers.slice(0, 3).map(({ member }) => member.userId?._id)),
      reason: "matched engineer expertise",
    };
  }

  const oncallMembers = members.filter((member) => member.oncall).slice(0, 3);
  if (oncallMembers.length > 0) {
    return {
      ids: uniqueIds(oncallMembers.map((member) => member.userId?._id)),
      reason: "no expertise match; selected on-call engineers",
    };
  }

  return { ids: [], reason: null };
};

export const resolveIncidentAssignment = async ({
  orgId,
  service,
  title,
  description,
  tags = [],
  context = {},
}) => {
  const assignedMembers = [];
  const assignedTeams = [];
  const timeline = [];

  const autoAssignEnabled = service?.autoAssignEnabled ?? true;
  if (!autoAssignEnabled) {
    return { assignedMembers, assignedTeams, timeline };
  }

  assignedMembers.push(...uniqueIds(service?.members || []));
  assignedTeams.push(...uniqueIds(service?.teams || []));

  const incidentTags = Array.isArray(tags) ? tags.join(" ") : "";
  for (const rule of service?.assignmentRules || []) {
    try {
      const regex = new RegExp(rule.tagsRegex || ".*", "i");
      if (regex.test(incidentTags)) {
        assignedMembers.push(...uniqueIds(rule.members || []));
        assignedTeams.push(...uniqueIds(rule.teams || []));
      }
    } catch {
      logger.warn("[IncidentAssignment] Invalid assignment rule regex", {
        serviceId: service?._id,
        tagsRegex: rule.tagsRegex,
      });
    }
  }

  let finalMembers = uniqueIds(assignedMembers);
  let finalTeams = uniqueIds(assignedTeams);

  if (finalMembers.length === 0 && finalTeams.length === 0) {
    const expertiseMatch = await pickExpertiseMatches({
      orgId,
      title,
      description,
      tags,
      serviceName: service?.name,
      context,
    });

    if (expertiseMatch.ids.length > 0) {
      finalMembers = expertiseMatch.ids;
      timeline.push({
        action: `Auto-assigned to ${finalMembers.length} engineer(s): ${expertiseMatch.reason}`,
        time: new Date(),
      });
    }
  }

  if (finalMembers.length === 0 && finalTeams.length === 0) {
    const admins = await Member.find({
      organizationId: orgId,
      role: "admin",
      isActive: true,
      userId: { $exists: true, $ne: null },
    })
      .populate("userId", "name email")
      .limit(5);
    finalMembers = uniqueIds(admins.map((admin) => admin.userId?._id));

    if (finalMembers.length > 0) {
      timeline.push({
        action: `Fallback: No engineers matched. Assigned to ${finalMembers.length} organization admin(s).`,
        time: new Date(),
      });
    }
  } else if (timeline.length === 0) {
    timeline.push({
      action: `Auto-assigned to ${finalMembers.length} member(s) and ${finalTeams.length} team(s) based on service rules`,
      time: new Date(),
    });
  }

  return {
    assignedMembers: finalMembers,
    assignedTeams: finalTeams,
    timeline,
  };
};

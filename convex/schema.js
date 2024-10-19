
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    alerts: defineTable({
        last_seen: v.string(),
        suspect_description: v.string(), // "Male, approx. 6ft, wearing black jacket"
        weapon: v.object({
            detail: v.string(),
            name: v.string(),
        }),
        suspectImage: v.optional(v.string()),
        videoUrl: v.optional(v.string()), // Optional because it might be added later
        isNotified: v.boolean(), // Track if alert was shown to user
    }),
});
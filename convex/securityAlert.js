
import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

export const insertAlert = mutation({
    args: {
        suspect_description: v.string(),
        weapon: v.object({
            name: v.string(),
            detail: v.string()
        }),
        isNotified: v.boolean(),
        last_seen: v.string(),
        suspectImage: v.string()
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("alerts", {
            ...args,
        });
    }
});

// Action that processes the image and creates an alert
export const createSecurityAlert = action({
    args: {
        imageID: v.string(),
        last_seen: v.string(),
        groqResult: v.optional(v.any())
    },
    handler: async (ctx, args) => {
        try {
            const processedOutput = args.groqResult;

            const alertId = await ctx.runMutation(api.securityAlert.insertAlert, {
                suspect_description: processedOutput.person.description,
                weapon: {
                    name: processedOutput.weapon.name,
                    detail: processedOutput.weapon.details
                },
                isNotified: false,
                suspectImage: args.imageID,
                last_seen: args.last_seen
            });

            return {
                alertId,
            };

        } catch (error) {
            console.error("Error in createSecurityAlert:", error);
            throw new Error(`Failed to create security alert: ${error.message}`);
        }
    },
});

export const getUnnotifiedAlerts = query({
    handler: async (ctx) => {
        const alerts = await ctx.db
            .query("alerts")
            .filter((q) => q.eq(q.field("isNotified"), false))
            .order("desc")
            .take(1);

        if (alerts.length > 0) {
            const alert = alerts[0];
            const suspectImageUrl = await ctx.storage.getUrl(alert.suspectImage);

            return {
                ...alert,
                suspectImage: suspectImageUrl, // Add the URL to the alert object
            };
        }

        return null; // Return null if no alerts are found
    },
});

// Mutation to mark an alert as notified
export const markAlertAsNotified = mutation({
    args: { id: v.id("alerts") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { isNotified: true });
    },
});

// Query to get all recent alerts
export const getRecentAlerts = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("alerts")
            .order("desc")
            .collect();
    },
});


export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});
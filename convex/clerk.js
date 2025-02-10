"use node";
import { v } from "convex/values";
import { Webhook } from "svix";
import { internalAction } from "./_generated/server";

// secret在settings下：https://dashboard.convex.dev/t/yinleicoder/pixel-perfect/amicable-chameleon-487/settings/environment-variables
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ``;
// Clerk WebHook
export const fulfill = internalAction({
  args: { headers: v.any(), payload: v.string() },
  handler: async (ctx, args) => {
    const wh = new Webhook(webhookSecret);
    const payload = wh.verify(args.payload, args.headers);
    return payload;
  },
});
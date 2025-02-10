import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createFile = mutation({
  args: {
    name: v.string(),
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    console.log(identity.tokenIdentifier)
    if (!identity) {
      throw new ConvexError("you must be logged into upload a file");
    }
    await ctx.db.insert("files", {
      name: args.name,
      orgId: args.orgId
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string()
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    return ctx.db.query("files").withIndex("by_orgId", q => q.eq("orgId", args.orgId)).collect();
  },
});

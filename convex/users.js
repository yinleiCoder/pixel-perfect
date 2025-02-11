import { ConvexError, v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { roleTypes } from "./schema";

export async function getUser(ctx, tokenIdentifier) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
      q.eq("tokenIdentifier", tokenIdentifier)
    )
    .first();
  if (!user) {
    throw new ConvexError("Convex中不存在该用户");
  }
  return user;
}

// create user
export const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    image: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      name: args.name,
      image: args.image,
      orgIds: [],
    });
  },
});

// update user
export const updateUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    name: v.string(),
    image: v.string(),
  },
  async handler(ctx, args) {
    const user = await getUser(ctx, tokenIdentifier);
    await ctx.db.patch(user._id, {
      name: args.name,
      image: args.image,
    });
  },
});

// add user belong to org
export const addOrgIdToUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    orgId: v.string(),
    role: roleTypes,
  },
  async handler(ctx, args) {
    const user = await getUser(ctx, args.tokenIdentifier);

    await ctx.db.patch(user._id, {
      orgIds: [...user.orgIds, { orgId: args.orgId, role: args.role }],
    });
  },
});

// update org when user change role
export const updateRoleInOrgForUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    orgId: v.string(),
    role: roleTypes,
  },
  async handler(ctx, args) {
    const user = await getUser(ctx, args.tokenIdentifier);
    const org = user.orgIds.find((org) => org.orgId === args.orgId);
    org.role = args.role;
    await ctx.db.patch(user._id, {
      orgIds: user.orgIds,
    });
  },
});

// get user profile
export const getUserProfile = query({
  args: {
    userId: v.id("users"),
  },
  async handler(ctx, args) {
    const user = await ctx.db.get(args.userId);
    return {
      name: user?.name,
      image: user?.image,
    };
  },
});

// get myself information
export const getMe = query({
  args: {},
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await getUser(ctx, identity.tokenIdentifier);
    if (!user) {
      return null;
    }
    return user;
  },
});

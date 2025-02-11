import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUser } from "./users";
import { fileTypes } from "./schema";

// https://docs.convex.dev/file-storage/upload-files#uploading-files-via-upload-urls
export const generateUploadUrl = mutation(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("必须登录");
  }
  return await ctx.storage.generateUploadUrl();
});

async function hasAccessToOrg(ctx, tokenIdentifier, orgId) {
  const user = await getUser(ctx, tokenIdentifier);
  return user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);
}

// 1. create file
export const createFile = mutation({
  args: {
    name: v.string(),
    type: fileTypes,
    fileId: v.id("_storage"),
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("必须登录");
    }
    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId
    );
    if (!hasAccess) {
      throw new ConvexError("您没有被该组织授权");
    }

    await ctx.db.insert("files", {
      name: args.name,
      type: args.type,
      orgId: args.orgId,
      fileId: args.fileId,
    });
  },
});

// 2. read files
export const getFiles = query({
  args: {
    orgId: v.string(),
    query: v.optional(v.string()),
    favorites: v.optional(v.boolean()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId
    );
    if (!hasAccess) {
      return [];
    }

    let user = null;
    let favorites = null;
    if (args.favorites) {
      user = await getUser(ctx, identity.tokenIdentifier);
      favorites = await ctx.db
        .query("favorites")
        .withIndex("by_userId_orgId_fileId", (q) =>
          q.eq("userId", user._id).eq("orgId", args.orgId)
        )
        .collect();
    }

    const files = await ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();
    // https://docs.convex.dev/file-storage/serve-files
    return Promise.all(
      files
        .filter((file) => {
          if (args.query) {
            return file.name.toLowerCase().includes(args.query.toLowerCase());
          }
          if (args.favorites && favorites) {
            return favorites.some((favorite) => favorite.fileId === file._id);
          }
          return true;
        })
        .map(async (file) => ({
          ...file,
          // file.fileId is an `Id<"_storage">`
          ...{ url: await ctx.storage.getUrl(file.fileId) },
        }))
    );
  },
});

// 3. delete file
export const deleteFile = mutation({
  args: {
    fileId: v.id("files"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("删除文件前，必须登录");
    }

    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new ConvexError("Convex中没有该文件的记录");
    }

    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      file.orgId
    );
    if (!hasAccess) {
      throw new ConvexError("没有删除该文件的权限");
    }
    await ctx.db.delete(args.fileId);
  },
});

// 4. toggle favorite
export const toggleFavorite = mutation({
  args: {
    fileId: v.id("files"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("收藏文件需要登录");
    }

    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new ConvexError("Convex中没有该文件的记录");
    }

    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      file.orgId
    );
    if (!hasAccess) {
      throw new ConvexError("没有收藏该文件的权限");
    }

    const user = await getUser(ctx, identity.tokenIdentifier);
    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_userId_orgId_fileId", (q) =>
        q.eq("userId", user._id).eq("orgId", file.orgId).eq("fileId", file._id)
      )
      .first();
    if (!favorite) {
      await ctx.db.insert("favorites", {
        fileId: file._id,
        userId: user._id,
        orgId: file.orgId,
      });
    } else {
      await ctx.db.delete(favorite._id);
    }
  },
});

// 5. query favorite
export const getAllFavorites = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const hasAccess = await hasAccessToOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId
    );
    if (!hasAccess) {
      throw new ConvexError("没有获取已收藏数据的权限");
    }

    const user = await getUser(ctx, identity.tokenIdentifier);
    return await ctx.db
      .query("favorites")
      .withIndex("by_userId_orgId_fileId", (q) =>
        q.eq("userId", user._id).eq("orgId", args.orgId)
      )
      .collect();
  },
});

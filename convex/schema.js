import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const fileTypes = v.union(
  v.literal("image"),
  v.literal("audio"),
  v.literal("video"),
  v.literal("pdf"),
  v.literal("zip"),
  v.literal("other")
);
export const roleTypes = v.union(v.literal("admin"), v.literal("member"));

// Define Table Schema
export default defineSchema({
  files: defineTable({
    name: v.string(),
    type: fileTypes,
    orgId: v.string(),
    userId: v.id("users"),
    fileId: v.id("_storage"),
  }).index("by_orgId", ["orgId"]),
  favorites: defineTable({
    fileId: v.id("files"),
    orgId: v.string(),
    userId: v.id("users"),
  }).index("by_userId_orgId_fileId", ["userId", "orgId", "fileId"]),
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    orgIds: v.array(
      v.object({
        orgId: v.string(),
        role: roleTypes,
      })
    ),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),
});

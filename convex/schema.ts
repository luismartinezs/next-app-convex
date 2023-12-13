import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    task: v.string(),
    // user: v.id("users"),
  }),
});
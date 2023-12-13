import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const add = mutation({
  args: {
    task: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to mutation");
    }

    await ctx.db.insert("tasks", {
      task: args.task,
      userId: args.userId,
    });
  }
});

export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to mutation");
    }
    // TODO check that the user owns the task

    await ctx.db.delete(args.id);
  }
});

export const list = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const tasks = await ctx.db.query("tasks")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId))
      .collect();

    return tasks
  },
});
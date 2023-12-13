import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const add = mutation({
  args: { task: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated call to mutation");
    }
    // // Note: If you don't want to define an index right away, you can use
    // // ctx.db.query("users")
    // //  .filter(q => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
    // //  .unique();
    // const user = await ctx.db
    //   .query("users")
    //   .withIndex("by_token", (q) =>
    //     q.eq("tokenIdentifier", identity.tokenIdentifier)
    //   )
    //   .unique();
    // if (!user) {
    //   throw new Error("Unauthenticated call to mutation");
    // }

    await ctx.db.insert("tasks", {
      task: args.task,
      // user: user._id
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
    // // Note: If you don't want to define an index right away, you can use
    // // ctx.db.query("users")
    // //  .filter(q => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
    // //  .unique();
    // const user = await ctx.db
    //   .query("users")
    //   .withIndex("by_token", (q) =>
    //     q.eq("tokenIdentifier", identity.tokenIdentifier)
    //   )
    //   .unique();
    // if (!user) {
    //   throw new Error("Unauthenticated call to mutation");
    // }

    await ctx.db.delete(args.id);
  }
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").collect();
    return tasks
    // return Promise.all(
    //   messages.map(async (message) => {
    //     // For each message in this channel, fetch the `User` who wrote it and
    //     // insert their name into the `author` field.
    //     const user = await ctx.db.get(message.user);
    //     return {
    //       author: user!.name,
    //       ...message,
    //     };
    //   })
    // );
  },
});
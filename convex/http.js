import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

// Http Action: https://docs.convex.dev/functions/http-actions
http.route({
  path: "/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payloadString = await request.text();
    const headerPayload = request.headers;
    try {
      const result = await ctx.runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          "svix-id": headerPayload.get("svix-id"),
          "svix-timestamp": headerPayload.get("svix-timestamp"),
          "svix-signature": headerPayload.get("svix-signature"),
        },
      });
      // clerk webhook
      switch (result.type) {
        case "user.created":
          await ctx.runMutation(internal.users.createUser, {
            tokenIdentifier: `https://hip-feline-1.clerk.accounts.dev|${result.data.id}`,
          });
          break;
        case "organizationMembership.created":
          await ctx.runMutation(internal.users.addOrgIdToUser, {
            tokenIdentifier: `https://hip-feline-1.clerk.accounts.dev|${result.data.public_user_data.user_id}`,
            orgId: result.data.organization.id,
            role: result.data.role === "org:admin" ? "admin" : "member",
          });
          break;
        case "organizationMembership.updated":
          await ctx.runMutation(internal.users.updateRoleInOrgForUser, {
            tokenIdentifier: `https://hip-feline-1.clerk.accounts.dev|${result.data.public_user_data.user_id}`,
            orgId: result.data.organization.id,
            role: result.data.role === "org:admin" ? "admin" : "member",
          });
          break;
      }
      return new Response(null, {
        status: 200,
      });
    } catch (err) {
      return new Response("Webhook Error", {
        status: 400,
      });
    }
  }),
});
export default http;

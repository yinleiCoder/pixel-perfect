export default {
  providers: [
    {
      // 该环境变量在convex控制台查看
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};

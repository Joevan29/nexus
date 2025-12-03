import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/inventory/:path*",
    "/inbound/:path*",
    "/fleet/:path*",
    "/drivers/:path*",
    "/settings/:path*",
  ],
};
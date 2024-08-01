import { type NextRequest, NextResponse } from "next/server";
import { authenticatedUser } from "./lib/auth/amplify-server-utils";
import { getCurrentUser } from "aws-amplify/auth";

const protectedRoutes = ["/dashboard"];
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const isAuthenticated = await authenticatedUser({ request, response });


  // currentSession = await getCurrentUser();
  // if (isAuthenticated) {
  //   return response;
  // }
  // console.log(await getCurrentUser());

  // if (!isAuthenticated && protectedRoutes.includes(request.nextUrl.pathname)) {
  //   return NextResponse.redirect(new URL('login', request.url))
  // }

  return response;
}

export const config = {
  /*
   * Match all request paths except for the ones starting with
   */
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$).*)"
  ],
};

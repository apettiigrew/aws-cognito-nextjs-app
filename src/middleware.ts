import { type NextRequest, NextResponse } from "next/server";
import { authenticatedUser } from "./lib/auth/amplify-server-utils";
import { authenticateAccountRouteRequest } from "./lib/middleware/mw-auth";


const protectedRoutes = ["/dashboard"];
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const path = request.nextUrl.pathname;
  const home = "/";
  console.log(`Path = ${path}`)

  if (path === home) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  const isAuthenticated = await authenticatedUser({ request, response });
  if (protectedRoutes.includes(path)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    return response;
  }
  
  // Normal user authentication
  // Federated user authentication
  // const authResponse = await authenticateAccountRouteRequest(request);
  // if (authResponse !== null)
  //   return authResponse;


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

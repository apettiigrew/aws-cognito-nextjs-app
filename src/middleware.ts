import { type NextRequest, NextResponse } from "next/server";
import { authenticatedUser } from "./lib/auth/amplify-server-config";
import { authenticateAccountRouteRequest } from "./lib/middleware/mw-auth";


const protectedRoutes = ["/dashboard"];
const unProtectedRoutes = ["/login", "/signup", "/fogot-password/submit", "/fogot-password/confirm", "/confirm-signup"];
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const path = request.nextUrl.pathname;
  const home = "/";
  console.log(`Path = ${path}`)

  // Check if hte user is authenticated with username + password
  const cognitoAuthTest = await authenticatedUser({ request, response });
  const isCogntioAuthenticated = cognitoAuthTest !== null;
  // Check if the user is federated
  const federatedAuthTest = await authenticateAccountRouteRequest(request);
  const isFederatedAuthenticated = federatedAuthTest === null;
  const isAuthenticated = isCogntioAuthenticated || isFederatedAuthenticated;

  if ((path === home || unProtectedRoutes.includes(path)) && isAuthenticated) {
    console.log("Redirecting to dashboard view user is authenticated");
    console.log(`isCogntioAuthenticated = ${isCogntioAuthenticated}`);
    console.log(`isFederatedAuthenticated = ${isFederatedAuthenticated}`);
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  // // Check if it's an third party authorize callback
  // if (path === "/third-party-authorize") {
  //   const searchParams = request.nextUrl.searchParams;
  //   if (searchParams.has("code") && searchParams.has("state")) {
  //     // E.g. http://localhost:3002/third-party-authorize?code=<string>&state=<string>
  //     return response;
  //   } else if (searchParams.has("error")) {
  //     // E.g. http://localhost:3002/third-party-authorize?error_description=<description of error>&state=<string>&error=invalid_request
  //     return response;
  //   }
  // }

  if (protectedRoutes.includes(path)) {
    if (isAuthenticated == false) {
      console.log("Redirecting to Login user is not authenticated");
      console.log(`isCogntioAuthenticated = ${isCogntioAuthenticated}`);
      console.log(`isFederatedAuthenticated = ${isFederatedAuthenticated}`);
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }

  if (path === home) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

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

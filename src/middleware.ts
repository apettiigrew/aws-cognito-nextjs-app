import { type NextRequest, NextResponse } from "next/server";
import { authenticatedUser } from "./lib/auth/amplify-server-utils";
import { authenticateAccountRouteRequest } from "./lib/middleware/mw-auth";
import { getSessionStorageValue } from "./lib/utils/storage-utils";
import { IdentifyProviderSessionKey } from "./lib/auth/amplify-cognito-config";

const protectedRoutes = ["/dashboard"];
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const isAuthenticated = await authenticatedUser({ request, response });
  const authResponse = await authenticateAccountRouteRequest(request);
  const session = getSessionStorageValue(IdentifyProviderSessionKey);
  

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

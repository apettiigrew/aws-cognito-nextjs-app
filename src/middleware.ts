import { type NextRequest, NextResponse } from "next/server";
import { authenticatedUser } from "./lib/auth/amplify-server-utils";


export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const path = request.nextUrl.pathname;

  const user = await authenticatedUser({ request, response });

  // If user is not authenticate move them to the login page

  if (path === "/" && (user === undefined || user === null)) {
    console.log("User is not authenticated");
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  } else {
    const isOnDashboard = request.nextUrl.pathname.startsWith("/dashboard");
    const isOnAdminArea =
      request.nextUrl.pathname.startsWith("/dashboard/admins");

    if (isOnDashboard) {
      if (!user)
        return NextResponse.redirect(new URL("/login", request.nextUrl));
      if (isOnAdminArea && !user.isAdmin)
        return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
      return response;
    } else if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
    }
  }


}

export const config = {
  /*
   * Match all request paths except for the ones starting with
   */
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

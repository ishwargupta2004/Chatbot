import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// ─── Protected Routes ─────────────────────────────────────────────
// Yeh routes sirf logged-in users ke liye hain
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/embed(.*)",
]);

// ─── Webhook Routes ───────────────────────────────────────────────
// Clerk webhooks ko auth check se bypass karna padta hai
const isWebhookRoute = createRouteMatcher([
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Webhook hai toh seedha pass karo — koi auth check nahi
  if (isWebhookRoute(req)) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  // User logged in nahi hai aur protected route pe ja raha hai
  // toh sign-in page pe redirect karo
  if (!userId && isProtectedRoute(req)) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }

  return NextResponse.next();
});

// ─── Matcher ──────────────────────────────────────────────────────
// Static files (images, css, fonts) ko middleware se exclude karo
// Sirf actual pages aur API routes pe middleware chalega
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

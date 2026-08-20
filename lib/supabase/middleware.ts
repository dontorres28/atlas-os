import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase session on every request so cookies stay live.
 * Called from `middleware.ts` at the project root.
 *
 * Also handles the auth gate: any request outside `/login` and `/auth/*`
 * that lacks a session is redirected to `/login`.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies) {
          cookies.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Auth gate paused — we're using magic-link magic + Supabase, but the
  // deliverability flow needs more work. Keep the session refresh alive so
  // the plumbing is ready to enable, but let every path through for now.
  await supabase.auth.getUser();
  return response;
}

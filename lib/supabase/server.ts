import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Supabase client for Server Components, Route Handlers, and Server Actions.
 * Reads and writes the session cookie through Next's `cookies()` store so
 * the session survives navigation and refresh.
 *
 * The write operations are wrapped in try/catch because Server Components
 * are read-only for cookies — only Route Handlers and Server Actions can
 * mutate them. That's fine: the middleware refreshes the session cookie
 * on every request.
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookies) {
          try {
            cookies.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Component context — cookies are read-only. The
            // middleware handles refresh on the next request.
          }
        },
      },
    },
  );
}

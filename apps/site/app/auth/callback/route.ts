import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/overview';

  // Provider-level errors (e.g. user cancelled, misconfigured OAuth app) arrive
  // as ?error=...&error_description=... — bounce them through to the login page
  // so the user sees what actually went wrong.
  const providerError = searchParams.get('error');
  const providerErrorDescription = searchParams.get('error_description');
  if (providerError) {
    const q = new URLSearchParams();
    q.set('error', providerError);
    if (providerErrorDescription) q.set('error_description', providerErrorDescription);
    return NextResponse.redirect(`${origin}/login?${q.toString()}`);
  }

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    const q = new URLSearchParams({
      error: 'exchange_failed',
      error_description: error.message,
    });
    return NextResponse.redirect(`${origin}/login?${q.toString()}`);
  }

  return NextResponse.redirect(`${origin}/login?error=no_code&error_description=Missing+OAuth+code+in+callback`);
}

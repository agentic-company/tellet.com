import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/onboarding";

  if (code) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user already has a company
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: memberships } = await supabase
          .from("company_members")
          .select("company_id, companies(slug)")
          .eq("user_id", user.id)
          .limit(1);

        const membership = memberships?.[0];
        if (membership?.companies) {
          const company = membership.companies as unknown as { slug: string };
          return NextResponse.redirect(`${origin}/${company.slug}/dashboard`);
        }
      }

      // No company yet — go to onboarding
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth error — redirect to login
  return NextResponse.redirect(`${origin}/login`);
}

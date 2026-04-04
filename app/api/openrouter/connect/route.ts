import { createServerSupabase } from "@/lib/supabase/server";
import { generatePKCE, getAuthURL } from "@/lib/openrouter/pkce";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { company_id } = await request.json();

  if (!company_id) {
    return Response.json({ error: "company_id required" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { verifier, challenge } = generatePKCE();

  // Store verifier + company_id in a cookie for the callback
  const cookieStore = await cookies();
  cookieStore.set("or_verifier", verifier, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600, // 10 minutes
    path: "/",
  });
  cookieStore.set("or_company_id", company_id, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  const origin = request.headers.get("origin") || "https://tellet.com";
  const callbackUrl = `${origin}/api/openrouter/callback`;
  const authUrl = getAuthURL(callbackUrl, challenge);

  return Response.json({ url: authUrl });
}

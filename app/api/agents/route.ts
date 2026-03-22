import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const { data: agents, error } = await supabase
    .from("agents")
    .select("id, name, role, status")
    .order("created_at");

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(agents);
}

import { executeDueTasks } from "@/lib/scheduling";

export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await executeDueTasks();

  return Response.json({
    ok: true,
    executed: result.executed,
    results: result.results,
    timestamp: new Date().toISOString(),
  });
}

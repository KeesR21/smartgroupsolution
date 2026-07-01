import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/cms";
import { requireAdminSession } from "@/lib/api-auth";

export async function GET() {
  const { error } = await requireAdminSession();
  if (error) return error;

  const stats = await getDashboardStats();
  return NextResponse.json(stats);
}

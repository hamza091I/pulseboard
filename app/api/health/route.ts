import { apiOk } from "@/lib/api";

export function GET() {
  return apiOk({ status: "ok", service: "pulseboard" });
}

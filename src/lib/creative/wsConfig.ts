/** WebSocket 基地址，例如 wss://api.example.com/ws/creative-jobs */
export function getCreativeJobsWsUrl(): string | null {
  const v = process.env.NEXT_PUBLIC_CREATIVE_JOBS_WS;
  return v && v.length > 0 ? v : null;
}

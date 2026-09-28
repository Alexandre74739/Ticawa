import type { H3Event } from "h3";

async function bump(key: string, windowSeconds: number) {
  const resetAt = new Date(Date.now() + windowSeconds * 1000);
  const [row] = await useDb()<{ count: number }[]>`
    insert into rate_limits (key, count, reset_at)
    values (${key}, 1, ${resetAt})
    on conflict (key) do update set
      count = case when rate_limits.reset_at < now() then 1 else rate_limits.count + 1 end,
      reset_at = case when rate_limits.reset_at < now() then excluded.reset_at else rate_limits.reset_at end
    returning count
  `;

  if (Math.random() < 0.01)
    await useDb()`delete from rate_limits where reset_at < now()`;

  return row!.count;
}

export async function consumeQuota(
  key: string,
  max: number,
  windowSeconds: number,
) {
  return (await bump(key, windowSeconds)) <= max;
}

export async function rateLimit(key: string, max: number, windowSeconds: number) {
  if (!(await consumeQuota(key, max, windowSeconds)))
    throw createError({
      statusCode: 429,
      message: "Trop de tentatives. Réessayez dans quelques minutes.",
    });
}

function lastHop(header: string | undefined) {
  return header?.split(",").pop()?.trim() || undefined;
}

export function clientIp(event: H3Event) {
  const proxied = import.meta.dev
    ? undefined
    : lastHop(getRequestHeader(event, "x-vercel-forwarded-for")) ??
      lastHop(getRequestHeader(event, "x-forwarded-for"));

  return proxied ?? getRequestIP(event) ?? "inconnue";
}

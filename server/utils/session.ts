import type { H3Event } from "h3";

export function startSession(event: H3Event, user: UserRow) {
  return replaceUserSession(event, {
    user: toSessionUser(user),
    secure: { sessionVersion: user.session_version },
  });
}

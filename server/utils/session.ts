import type { H3Event } from "h3";

export function startSession(event: H3Event, user: UserRow) {
  return replaceUserSession(event, {
    user: toSessionUser(user),
    secure: { sessionVersion: user.session_version, issuedAt: Date.now() },
  });
}

export function endSession(event: H3Event) {
  return replaceUserSession(event, { user: undefined, secure: undefined });
}

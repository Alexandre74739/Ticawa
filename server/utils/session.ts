import type { H3Event } from "h3";

export function startSession(event: H3Event, user: UserRow) {
  return replaceUserSession(event, {
    user: toSessionUser(user),
    secure: { sessionVersion: user.session_version, issuedAt: Date.now() },
  });
}

// À préférer à clearUserSession pour révoquer : h3 relit le cookie entrant au
// getUserSession suivant et ressusciterait la session dans la même requête.
// Une session sans utilisateur, elle, reste en place jusqu'à la réponse.
export function endSession(event: H3Event) {
  return replaceUserSession(event, { user: undefined, secure: undefined });
}

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const id = assertTicketId(getRouterParam(event, "id"));

  if (!(await deleteTicket(user.id, id)))
    throw createError({ statusCode: 404, message: "Ticket introuvable." });
  return { ok: true };
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const id = assertTicketId(getRouterParam(event, "id"));

  const ticket = await findTicket(user.id, id);
  if (!ticket)
    throw createError({ statusCode: 404, message: "Ticket introuvable." });
  return ticket;
});

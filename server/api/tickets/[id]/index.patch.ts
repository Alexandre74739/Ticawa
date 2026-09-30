export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const id = assertTicketId(getRouterParam(event, "id"));
  await rateLimit(`tickets:update:${user.id}`, 60, 60);

  const fields = withInferredCoverage(readTicketFields(await readBody(event)));
  if (!(await updateTicket(user.id, id, fields)))
    throw createError({ statusCode: 404, message: "Ticket introuvable." });

  return findTicket(user.id, id);
});

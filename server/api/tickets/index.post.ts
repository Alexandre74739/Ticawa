export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  await rateLimit(`tickets:create:${user.id}`, 60, 60 * 60);

  const parts = (await readMultipartFormData(event)) ?? [];
  const file = parts.find((part) => part.name === "file");
  const data = parts.find((part) => part.name === "data");
  if (!file || !data)
    throw createError({ statusCode: 400, message: "Ticket incomplet." });

  assertTicketFileSize(file.data);
  const type = detectTicketFile(file.data);

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(data.data.toString("utf8"));
  } catch {
    throw createError({ statusCode: 400, message: "Ticket illisible." });
  }

  const id = await createTicket(user.id, {
    source: type === "application/pdf" ? "pdf" : "photo",
    fields: withInferredCoverage(readTicketFields(payload.fields)),
    rawText: readRawText(payload.rawText),
    file: { type, data: file.data },
  });

  setResponseStatus(event, 201);
  return { id };
});

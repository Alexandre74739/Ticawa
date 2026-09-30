const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const id = assertTicketId(getRouterParam(event, "id"));

  const file = await findTicketFile(user.id, id);
  if (!file)
    throw createError({ statusCode: 404, message: "Fichier introuvable." });

  const name = `ticket-${file.createdAt.toISOString().slice(0, 10)}.${EXTENSIONS[file.mimeType] ?? "bin"}`;
  const disposition = getQuery(event).download ? "attachment" : "inline";

  setResponseHeaders(event, {
    "content-type": file.mimeType,
    "content-disposition": `${disposition}; filename="${name}"`,
    "cache-control": "private, max-age=86400",
  });
  return file.content;
});

export type ScanStep = "idle" | "prepare" | "read" | "save";

const FILE_MAX = 4 * 1024 * 1024;

const isPdf = (file: File) =>
  file.type === "application/pdf" || /\.pdf$/i.test(file.name);

const message = (e: unknown) =>
  (e as { data?: { message?: string } }).data?.message ??
  (e instanceof ScanError ? e.message : null) ??
  "Tico n'a pas pu enregistrer ce ticket. Vérifiez votre connexion et réessayez.";

export function useScan() {
  const step = ref<ScanStep>("idle");
  const progress = ref(0);
  const error = ref("");

  const onProgress = (value: number) => (progress.value = value);

  async function readText(read: () => Promise<string>) {
    try {
      return await read();
    } catch {
      return "";
    }
  }

  async function extract(file: File) {
    if (isPdf(file)) {
      if (file.size > FILE_MAX)
        throw new ScanError("Ce PDF dépasse 4 Mo : envoyez une version allégée.");
      step.value = "read";
      const { text, scan } = await readPdf(file);
      const raw = text ?? (await readText(() => readImageText(scan!, onProgress)));
      return { raw, upload: file as Blob, name: file.name };
    }
    step.value = "prepare";
    const { canvas, jpeg } = await prepareImage(file);
    step.value = "read";
    const raw = await readText(() => readImageText(canvas, onProgress));
    return { raw, upload: jpeg, name: "ticket.jpg" };
  }

  async function scan(file: File) {
    error.value = "";
    progress.value = 0;
    try {
      const { raw, upload, name } = await extract(file);
      step.value = "save";
      const body = new FormData();
      body.append("file", upload, name);
      body.append("data", JSON.stringify({ fields: parseReceipt(raw), rawText: raw }));
      const { id } = await $fetch<{ id: string }>("/api/tickets", { method: "POST", body });
      await navigateTo(`/dashboard/tickets/${id}?nouveau=1`);
    } catch (e) {
      error.value = message(e);
      step.value = "idle";
    }
  }

  return { step: readonly(step), progress: readonly(progress), error, scan };
}

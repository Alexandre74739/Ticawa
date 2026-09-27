export function useAction<T>(run: () => Promise<T>) {
  const pending = ref(false);
  const error = ref("");
  const done = ref(false);

  async function execute() {
    pending.value = true;
    error.value = "";
    done.value = false;
    try {
      const result = await run();
      done.value = true;
      return result;
    } catch (e) {
      error.value =
        (e as { data?: { message?: string } }).data?.message ??
        "Une erreur est survenue. Réessayez.";
    } finally {
      pending.value = false;
    }
  }

  return { pending, error, done, execute };
}

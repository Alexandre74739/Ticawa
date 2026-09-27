export function useAuthForm(endpoint: string) {
  const route = useRoute();
  const { fetch: refreshSession } = useUserSession();
  const pending = ref(false);
  const error = ref(
    route.query.erreur === "google"
      ? "La connexion avec Google n'a pas abouti. Réessayez."
      : "",
  );

  async function submit(body: Record<string, unknown>) {
    pending.value = true;
    error.value = "";
    try {
      await $fetch(endpoint, { method: "POST", body });
      await refreshSession();
      const redirect = route.query.redirect;
      await navigateTo(isSafeRedirect(redirect) ? redirect : "/dashboard");
    } catch (e) {
      error.value =
        (e as { data?: { message?: string } }).data?.message ??
        "Une erreur est survenue. Réessayez.";
    } finally {
      pending.value = false;
    }
  }

  return { pending, error, submit };
}

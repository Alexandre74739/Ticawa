export function useDashboardMode() {
  const { user } = useUserSession();
  const { isDesktop } = useDevice();
  const mounted = ref(false);
  onMounted(() => (mounted.value = true));

  return computed<"full" | "limited">(() =>
    mounted.value && isDesktop.value && user.value?.role !== "admin"
      ? "limited"
      : "full",
  );
}

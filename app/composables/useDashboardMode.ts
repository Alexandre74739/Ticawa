export function useDashboardMode() {
  const { isStandalone } = useDevice();
  const mounted = ref(false);
  onMounted(() => (mounted.value = true));

  return computed<"scan" | "read">(() =>
    mounted.value && isStandalone.value ? "scan" : "read",
  );
}

const CELLS = 42;

export function useMonthGrid() {
  const now = new Date();
  const month = ref(new Date(now.getFullYear(), now.getMonth(), 1));

  const title = computed(() =>
    month.value.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }),
  );

  const cells = computed(() => {
    const [year, index] = [month.value.getFullYear(), month.value.getMonth()];
    const offset = (month.value.getDay() + 6) % 7;
    const last = new Date(year, index + 1, 0).getDate();
    return Array.from({ length: CELLS }, (_, i) => {
      const day = i - offset + 1;
      return day < 1 || day > last ? null : isoDate(new Date(year, index, day));
    });
  });

  function shift(step: number) {
    const { value } = month;
    month.value = new Date(value.getFullYear(), value.getMonth() + step, 1);
  }

  return { title, cells, shift };
}

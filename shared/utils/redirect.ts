export function isSafeRedirect(path: unknown): path is string {
  return (
    typeof path === "string" &&
    path.length <= 512 &&
    /^\/(?![/\\])/.test(path) &&
    !/[\s\\]/.test(path)
  );
}

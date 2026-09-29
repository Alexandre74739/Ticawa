export default defineNuxtRouteMiddleware(() => {
  if (useUserSession().user.value?.role !== "admin") return navigateTo("/dashboard");
});

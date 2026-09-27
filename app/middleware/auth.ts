export default defineNuxtRouteMiddleware((to) => {
  if (!useUserSession().loggedIn.value)
    return navigateTo({ path: "/connexion", query: { redirect: to.fullPath } });
});

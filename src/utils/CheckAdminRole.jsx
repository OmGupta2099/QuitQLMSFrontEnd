export const checkAdminRole = (role, requiredRole) => {
  if (role === "superAdmin") return true; // Super admin has access to everything
  return role === requiredRole;
};

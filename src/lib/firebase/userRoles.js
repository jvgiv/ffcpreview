export const USER_ROLES = {
  ADMIN: "admin",
  CLIENT: "client",
};

export const DEFAULT_USER_ROLE = USER_ROLES.CLIENT;

const VALID_USER_ROLES = new Set(Object.values(USER_ROLES));

function normalizeRoleValue(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
}

export function isRecognizedUserRole(value) {
  return VALID_USER_ROLES.has(normalizeRoleValue(value));
}

export function normalizeUserRole(value) {
  const normalizedValue = normalizeRoleValue(value);

  if (VALID_USER_ROLES.has(normalizedValue)) {
    return normalizedValue;
  }

  return DEFAULT_USER_ROLE;
}

export function isAllowedUserRole(role, allowedRoles = []) {
  if (!Array.isArray(allowedRoles) || !allowedRoles.length) {
    return true;
  }

  const normalizedRole = normalizeUserRole(role);

  return allowedRoles.some((allowedRole) => normalizeUserRole(allowedRole) === normalizedRole);
}

export function formatUserRole(role) {
  const normalizedRole = normalizeUserRole(role);

  return normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1);
}

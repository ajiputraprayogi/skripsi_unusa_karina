export function hasPermission(userPermissions: string[], permission: string) {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  return userPermissions.includes(permission);
}

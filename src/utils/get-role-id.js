export function getRoleID(roles, name) {
    const role = roles.find((role) => role.name === name);
    return role.role_id;
}

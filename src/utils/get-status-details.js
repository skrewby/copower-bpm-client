export function getStatusDetails(statusOptions, name) {
    const details = statusOptions.find((status) => status.name === name);
    return details;
}

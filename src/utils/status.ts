export enum Status {
    normal = "normal",
    processing = "processing",
    success = "success",
    warning = "warning",
    danger = "danger",
}

export enum Type {
    normal = "normal",
    info = "info",
    success = "success",
    warning = "warning",
    error = "error",
}

export function map(value: Status | Type): Status | Type {
    switch (value) {
        case Status.processing:
            return Type.info;
        case Type.info:
            return Status.processing;

        case Status.danger:
            return Type.error;
        case Type.error:
            return Status.danger;

        default:
            return value;
    }
}

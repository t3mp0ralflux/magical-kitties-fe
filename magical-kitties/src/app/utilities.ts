export function CopyObject(original: any) {
    return JSON.parse(JSON.stringify(original));
}

export function trackByFn(index: any, name: string) {
    return `${name}-${index}`;
}
export function CopyObject(original: any) {
    return JSON.parse(JSON.stringify(original));
}

export function trackByFn(index: number, item: any) {
    return item.id;
}
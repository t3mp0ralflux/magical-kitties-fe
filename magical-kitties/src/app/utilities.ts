export function CopyObject(original: any) {
    return JSON.parse(JSON.stringify(original));
}
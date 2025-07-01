export class PagedResponse<T> {
    items: T[] = [];
    page!: number;
    pageSize!: number;
    total!: number;
    hasNextPage!: boolean;
}
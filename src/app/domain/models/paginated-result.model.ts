export interface PaginatedResult<T> {
    page: number;
    pageSize: number;
    totalRecords: number;
    data: T[];
}

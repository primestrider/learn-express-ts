export type PaginationResult = {
  current_page: number;
  total_page: number;
  limit: number;
};

export type ListResult<T> = {
  data: Array<T>;
  paging: PaginationResult;
};

export type ApiResponse<T> = {
  data: T;
  count?: number;
  next?: string | null;
  previous?: string | null;
};

export type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
};

export type ApiPaginatedResponse<T> = ApiResponse<Paginated<T>>;

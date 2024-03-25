export interface CarParam {
  id: number;
  name: string;
  color: string;
}
export interface WinnerParam extends CarParam {
  wins: number;
  time: number;
}

export interface Drive {
  velocity: number;
  distance: number;
}

export interface Engine {
  success: boolean;
}

export interface WinnerData {
  id: number;
  wins: number;
  time: number;
}

export interface PaginationData {
  limit: number;
  amountItems: number;
  currentPage: number;
}

export interface GetWinnersParam {
  page: number;
  limit: number;
  sort?: SortWinners;
  order?: SortOrder;
}

export enum SortWinners {
  id = 'id',
  wins = 'wins',
  time = 'time',
}

export enum SortOrder {
  asc = 'ASC',
  desc = 'DESC',
}

export enum StatusDrive {
  started = 'started',
  stopped = 'stopped',
  drive = 'drive',
}

export enum Request {
  get = 'GET',
  post = 'POST',
  del = 'DELETE',
  patch = 'PATCH',
  put = 'PUT',
}

export enum ErrorCode {
  notFound = '404',
  badRequest = '400',
  tooManyRequests = '429',
  internalServerError = '500',
}

export enum DefaultPagination {
  limitCars = 7,
  limitWinners = 10,
  currentPage = 1,
  amountItems = 0,
}

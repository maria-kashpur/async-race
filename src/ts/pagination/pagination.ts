import { PaginationData } from '../types/types';

export default class Pagination {
  limit: number;

  currentPage: number;

  amountItems: number;

  constructor(data: PaginationData) {
    this.limit = data.limit;
    this.amountItems = data.amountItems;
    this.currentPage = data.currentPage;
  }

  isOpenFirstPage(): boolean {
    return this.currentPage === 1;
  }

  isOpenLastPage(): boolean {
    return this.currentPage === Number(this.amountPages());
  }

  amountPages(): number {
    if (this.amountItems % this.limit === 0) {
      return (this.amountItems - (this.amountItems % this.limit)) / this.limit;
    }
    return (
      (this.amountItems - (this.amountItems % this.limit)) / this.limit + 1
    );
  }

  next(): void {
    if (!this.isOpenLastPage()) this.currentPage += 1;
  }

  prev(): void {
    if (!this.isOpenFirstPage()) this.currentPage -= 1;
  }

  changeAmountItems(value: string | null | number): void {
    const amount = Number.isNaN(value) ? 1 : Number(value);
    this.amountItems = amount;
    if (this.currentPage > this.amountPages()) {
      this.currentPage = 1;
    }
  }
}

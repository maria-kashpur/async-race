import Loader from '../../loader/loader';
import Pagination from '../../pagination/pagination';
import {
  GetWinnersParam, SortOrder, SortWinners, WinnerParam,
} from '../../types/types';
import Winner from './winner';
import defaultWinnersPagination from './winnersData';

export default class Winners {
  box: HTMLElement;

  tbody: HTMLElement;

  pagination: Pagination;

  winnersAmountBox: HTMLElement;

  titleWins: HTMLElement;

  titleTime: HTMLElement;

  currentPageBox: HTMLElement;

  prevBtn: HTMLElement;

  nextBtn: HTMLElement;

  isFilter: boolean;

  sort: NonNullable<SortWinners>;

  order: SortOrder;

  constructor() {
    this.box = document.querySelector('.winners') as HTMLElement;
    this.box.innerHTML = `<h2>Winners</h2>
    <div class="show">
      <div class="show__num"><span>Winners:</span><span id="winners_amount"></span></div>
      <div class="show__btns_pagination"><button class="btn btn-pagination unactive" id="winners_prev">←</button><span class="pagination-num" id="winners_page"></span><button class="btn btn-pagination" id="winners_next">→</button></div>
    </div>
    <table class="winners__table">
      <thead>
        <tr>
          <th>№</th>
          <th>car</th>
          <th>name</th>
          <th id="winners_title__wins">wins</th>
          <th id="winners_title__time">best time, s</th>
        </tr>
      </thead>
      <tbody id="winners__items"></tbody>
    </table>`;
    this.tbody = this.box.querySelector('tbody#winners__items') as HTMLElement;
    this.titleWins = document.getElementById(
      'winners_title__wins',
    ) as HTMLElement;
    this.titleTime = document.getElementById(
      'winners_title__time',
    ) as HTMLElement;
    this.winnersAmountBox = document.getElementById(
      'winners_amount',
    ) as HTMLElement;
    this.pagination = new Pagination(defaultWinnersPagination);
    this.currentPageBox = document.getElementById(
      'winners_page',
    ) as HTMLElement;
    this.nextBtn = document.getElementById('winners_next') as HTMLElement;
    this.prevBtn = document.getElementById('winners_prev') as HTMLElement;
    this.isFilter = false;
    this.sort = SortWinners.id;
    this.order = SortOrder.asc;
    this.paintWinners(this.createParams());
  }

  inite() {
    this.titleWins.addEventListener('click', () => {
      this.isFilter = true;
      this.removeFilter(this.titleTime);
      if (this.sort !== SortWinners.wins) this.addFilter(this.titleWins, SortWinners.wins);
      this.addOrder(this.titleWins);
      this.paintWinners(this.createParams());
    });

    this.titleTime.addEventListener('click', () => {
      this.isFilter = true;
      this.removeFilter(this.titleWins);
      if (this.sort !== 'time') this.addFilter(this.titleTime, SortWinners.time);
      this.addOrder(this.titleTime);
      this.paintWinners(this.createParams());
    });

    this.nextBtn.addEventListener('click', async () => {
      this.pagination.next();
      await this.paintWinners(this.createParams());
      this.checkBtn();
    });

    this.prevBtn.addEventListener('click', async () => {
      this.pagination.prev();
      await this.paintWinners(this.createParams());
      this.checkBtn();
    });
  }

  static async getDataPage(data: GetWinnersParam) {
    const winners = await Loader.getWinnersPagination(data);
    const cars = await Loader.getCars();
    const amountWinners = winners.winnersAmount;
    const result = winners.winners.reduce((acc: WinnerParam[], winner) => {
      cars.forEach((car) => {
        if (car.id === winner.id) {
          const { id, color, name } = car;
          const { time, wins } = winner;
          const obj: WinnerParam = {
            id,
            color,
            name,
            time,
            wins,
          };
          acc.push(obj);
        }
      });
      return acc;
    }, []);
    return { winners: result, amountWinners };
  }

  async paintWinners(params: GetWinnersParam) {
    this.tbody.innerHTML = '';
    const data = await Winners.getDataPage(params);
    data.winners.forEach((item, index) => {
      const num = (index + 1) * this.pagination.currentPage;
      const winner = new Winner(item, num);
      this.tbody.append(winner.box);
    });
    const beforeUpdatePageAmount = this.pagination.currentPage;
    this.pagination.changeAmountItems(data.amountWinners);
    if (beforeUpdatePageAmount > this.pagination.currentPage) {
      this.paintWinners(this.createParams());
    }
    this.winnersAmountBox.textContent = `${this.pagination.amountItems}`;
    this.currentPageBox.textContent = `${this.pagination.currentPage}`;
    this.checkBtn();
  }

  createParams() {
    if (this.isFilter) {
      return {
        page: this.pagination.currentPage,
        limit: this.pagination.limit,
        sort: this.sort,
        order: this.order,
      };
    }
    return {
      page: this.pagination.currentPage,
      limit: this.pagination.limit,
    };
  }

  checkBtn() {
    if (this.pagination.isOpenFirstPage()) {
      this.prevBtn.classList.add('btn-block');
    } else if (this.prevBtn.classList.contains('btn-block')) {
      this.prevBtn.classList.remove('btn-block');
    }
    if (this.pagination.isOpenLastPage()) {
      this.nextBtn.classList.add('btn-block');
    } else if (this.nextBtn.classList.contains('btn-block')) {
      this.nextBtn.classList.remove('btn-block');
    }
  }

  removeFilter(btn: HTMLElement) {
    if (btn.classList.contains('filter')) btn.classList.remove('filter');
    if (btn.classList.contains(SortOrder.asc)) btn.classList.remove(SortOrder.asc);
    this.sort = SortWinners.id;
  }

  addFilter(btn: HTMLElement, sort: NonNullable<GetWinnersParam['sort']>) {
    btn.classList.add('filter');
    this.sort = sort;
    btn.classList.toggle(SortOrder.asc);
  }

  addOrder(btn: HTMLElement) {
    if (!btn.classList.contains(SortOrder.asc)) {
      this.order = SortOrder.desc;
    } else {
      this.order = SortOrder.asc;
    }
  }

  static async addWinner(id: number, time: number) {
    try {
      const winner = await Loader.getWinner(id);
      const newData = {
        id,
        wins: winner.wins + 1,
        time: Math.min(time, winner.time),
      };
      await Loader.updateWinner(newData);
    } catch {
      await Loader.createWinner({
        id,
        time,
        wins: 1,
      });
    }
  }
}

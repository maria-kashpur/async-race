import generateCarParam from '../../../generators/generateCarParam';
import Loader from '../../../loader/loader';
import Pagination from '../../../pagination/pagination';
import {
  CarParam, Drive, ErrorCode, StatusDrive,
} from '../../../types/types';
import Winners from '../../winners/winners';
import Car from '../car/car';
import defaultCarsPagination from './carsData';

class Cars {
  paginationBox: HTMLElement;

  nextBtn: HTMLElement;

  prevBtn: HTMLElement;

  static currentPage: number;

  carsBox: HTMLElement;

  pagination: Pagination;

  paginationShowBoxes: { amountItems: HTMLElement; currentPage: HTMLElement };

  createNameInput: HTMLInputElement;

  createColorInput: HTMLInputElement;

  createBtn: HTMLElement;

  generateBtn: HTMLElement;

  optionsBox: HTMLInputElement;

  raceBtn: HTMLInputElement;

  receResetBtn: HTMLInputElement;

  statusRaceBox: HTMLElement;

  carsView: Car[];

  constructor() {
    this.optionsBox = document.querySelector('.options') as HTMLInputElement;
    this.optionsBox.innerHTML = `
    <div class="options__create create">
      <div class="race_status"></div>
      <div class="create__data">
        <input type="text" class="options__text" id="car_name_create_btn">
        <input type="color" value="#ff0000" class="options__color" id="car_color_create_btn">
      </div>
      <button class="btn btn-options" id="create__btn">create</button>
    </div>
    <div class="options__race">
      <button class="btn btn-options" id="race__btn">race</button>
      <button class="btn btn-options" id="reset__btn">reset</button>
      <button class="btn btn-options" id="generate_car__btn">generate car</button>
    </div>`;
    this.createNameInput = document.getElementById(
      'car_name_create_btn',
    ) as HTMLInputElement;
    this.createColorInput = document.getElementById(
      'car_color_create_btn',
    ) as HTMLInputElement;
    this.createBtn = document.getElementById('create__btn') as HTMLElement;
    this.generateBtn = document.getElementById(
      'generate_car__btn',
    ) as HTMLElement;

    this.raceBtn = document.getElementById('race__btn') as HTMLInputElement;
    this.receResetBtn = document.getElementById(
      'reset__btn',
    ) as HTMLInputElement;
    this.statusRaceBox = document.querySelector('.race_status') as HTMLElement;
    this.paginationBox = ((): HTMLElement => {
      const pagination = document.querySelector('.show');
      if (!pagination || !(pagination instanceof HTMLElement)) throw Error('.cars is not found');
      return pagination;
    })();
    this.paginationBox.innerHTML = `
    <div class="show__num">
      <span>Cars:</span>
      <span id="cars_num"></span>
      </div>
    <div class="show__btns_pagination">
      <button class="btn btn-pagination" id="cars_prev">←</button>
      <span class="pagination-num" id="cars_page"></span>
      <button class="btn btn-pagination" id="cars_next">→</button>
    </div>
    `;
    this.paginationShowBoxes = {
      amountItems: document.getElementById('cars_num') as HTMLElement,
      currentPage: document.getElementById('cars_page') as HTMLElement,
    };
    this.prevBtn = this.paginationBox.querySelector(
      '#cars_prev',
    ) as HTMLElement;
    this.nextBtn = this.paginationBox.querySelector(
      '#cars_next',
    ) as HTMLElement;

    this.pagination = new Pagination(defaultCarsPagination);

    this.carsBox = ((): HTMLElement => {
      const cars = document.querySelector('.cars');
      if (!cars || !(cars instanceof HTMLElement)) throw Error('.cars is not found');
      return cars;
    })();

    this.paintCars(this.pagination.currentPage);

    this.carsView = [];
  }

  inite() {
    [this.nextBtn, this.prevBtn].forEach((el) => {
      el.addEventListener('click', (e) => this.switchPage(e));
    });
    this.createBtn.addEventListener('click', async () => {
      await this.createCar();
      this.paintCars(this.pagination.currentPage);
    });
    this.generateBtn.addEventListener('click', () => this.geterateCars());
    this.raceBtn.addEventListener('click', () => this.race());
  }

  updatePaginationBox() {
    this.paginationShowBoxes.amountItems.textContent = `${this.pagination.amountItems}`;
    this.paginationShowBoxes.currentPage.textContent = `${this.pagination.currentPage}`;
    this.checkBtn();
  }

  switchPage(e: Event) {
    if (e.target === this.nextBtn) this.pagination.next();
    if (e.target === this.prevBtn) this.pagination.prev();
    this.paintCars(this.pagination.currentPage);
    this.updatePaginationBox();
  }

  checkBtn() {
    if (this.pagination.isOpenFirstPage()) {
      this.prevBtn.classList.add('btn-block');
    } else if (this.prevBtn.classList.contains('btn-block')) this.prevBtn.classList.remove('btn-block');
    if (this.pagination.isOpenLastPage()) {
      this.nextBtn.classList.add('btn-block');
    } else if (this.nextBtn.classList.contains('btn-block')) this.nextBtn.classList.remove('btn-block');
  }

  async createCar(): Promise<void> {
    const car = this.createNameInput.value === ''
      ? generateCarParam()
      : {
        name: this.createNameInput.value,
        color: this.createColorInput.value,
      };
    await Loader.createCar(car);
  }

  async geterateCars() {
    const amountGenerateCars = 100;
    const res = new Array(amountGenerateCars).fill(this.createCar.bind(this));
    Promise.all(res.map((el) => el()));
    this.paintCars(this.pagination.currentPage);
  }

  async paintCars(page: number): Promise<void> {
    this.carsBox.innerHTML = '';
    const res = await Loader.getCarsPagination(page, this.pagination.limit);
    const { cars, carsAmount } = res;
    this.carsView = [];
    cars.forEach((el: CarParam) => {
      const car = new Car(el);
      this.carsView.push(car);
      this.carsBox.append(car.box);
      car.remove(async (id: number) => {
        await Loader.deleteCar(id);
        await Loader.deleteWinner(id);
        await this.paintCars(this.pagination.currentPage);
      });
      car.update(async (params: Omit<CarParam, 'id'>, id: number) => {
        if (params.name.length < 1) return;
        if (params.color.length < 6) return;
        await Loader.updateCar(params, id);
        await this.paintCars(this.pagination.currentPage);
      });
      car.drive(Cars.driveCar);
    });
    this.pagination.changeAmountItems(carsAmount);
    this.updatePaginationBox();
  }

  static async driveCar(car: Car) {
    [car.startBtn, car.editBtn, car.removeBtn].forEach((btn: HTMLElement) => btn.classList.add('btn-block'));
    car.stopBtn.classList.remove('btn-block');
    const { move } = await Cars.startEngine(car);
    car.stopBtn.addEventListener('click', () => {
      Cars.stopCar(car, move);
      [car.startBtn, car.editBtn, car.removeBtn].forEach((btn) => btn.classList.remove('btn-block'));
      car.stopBtn.classList.add('btn-block');
    });
    await Cars.driveEngine(car, move);
  }

  async race() {
    [this.carsBox, this.statusRaceBox].forEach((el) => el.classList.add('racing'));
    [this.raceBtn, this.generateBtn, this.nextBtn, this.prevBtn].forEach((el) => el.classList.add('btn-block'));
    this.statusRaceBox.textContent = 'racing...';
    const winner = await Promise.any(
      this.carsView.map(async (car) => {
        const { duration, move } = await Cars.startEngine(car);
        this.receResetBtn.addEventListener('click', async () => {
          [this.carsBox, this.statusRaceBox].forEach((el) => el.classList.remove('racing'));
          await Cars.stopCar(car, move);
          [this.raceBtn, this.generateBtn, this.nextBtn, this.prevBtn].forEach(
            (el) => el.classList.remove('btn-block'),
          );
        });
        const success = await Cars.driveEngine(car, move);
        if (success) {
          return { car, duration };
        }
        return Promise.reject();
      }),
    );
    const time = +(winner.duration / 1000).toFixed(2);
    if (winner) this.statusRaceBox.textContent = `winner: ${winner.car.name}, time: ${time} sec`;
    await Winners.addWinner(winner.car.id, time);
  }

  static async stopCar(car: Car, move: Animation) {
    move.pause();
    await Loader.drive(car.id, StatusDrive.stopped);
    move.cancel();
  }

  static async startEngine(car: Car) {
    const { velocity, distance } = (await Loader.drive(
      car.id,
      StatusDrive.started,
    )) as Drive;
    const duration: number = Math.round(distance / velocity);
    const move = car.createDriveAmination(duration);
    return { duration, move };
  }

  static async driveEngine(car: Car, move: Animation) {
    try {
      const success = await Loader.drive(car.id, StatusDrive.drive);
      return success;
    } catch (error) {
      if ((error as Error).message === ErrorCode.internalServerError) {
        move.pause();
        await Loader.drive(car.id, StatusDrive.stopped);
      }
    }
    return null;
  }
}

export default Cars;

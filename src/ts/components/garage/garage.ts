import Cars from './cars/cars';

export default class Garage {
  cars: Cars;

  box: HTMLElement;

  constructor() {
    const box = document.querySelector('.garage');
    if (!(box instanceof HTMLElement) || !box) throw Error('.garage is not found');
    box.innerHTML = `
    <h2>Garage</h2>
    <div class="options"></div>
    <div class="show"></div>
    <ul class="cars unactive"></ul>`;
    this.box = box;
    this.cars = new Cars();
    this.cars.inite();
  }
}

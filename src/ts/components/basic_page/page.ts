import Garage from '../garage/garage';
import Winners from '../winners/winners';
import Footer from './footer/footer';
import Header from './header/header';

export default class Page {
  garageBtn: HTMLElement;

  winnersBtn: HTMLElement;

  garage: Garage;

  winners: Winners;

  constructor() {
    Header.create();
    Page.createMain();
    Footer.create();
    this.garageBtn = document.getElementById('garage') as HTMLElement;
    this.winnersBtn = document.getElementById('winners') as HTMLElement;
    this.garage = new Garage();
    this.winners = new Winners();
    this.winners.inite();
  }

  public inite(): void {
    this.garageBtn.addEventListener('click', () => {
      this.garageBtn.classList.add('btn-block');
      this.winnersBtn.classList.remove('btn-block');
      this.garage.box.classList.remove('hidden');
      if (!this.winners.box.classList.contains('hidden')) this.winners.box.classList.add('hidden');
    });
    this.winnersBtn.addEventListener('click', () => {
      this.winnersBtn.classList.add('btn-block');
      this.garageBtn.classList.remove('btn-block');
      this.winners.box.classList.remove('hidden');
      if (!this.garage.box.classList.contains('hidden')) this.garage.box.classList.add('hidden');
      this.winners.paintWinners(this.winners.createParams());
    });
  }

  public static createMain(): void {
    const main = document.createElement('main');
    main.classList.add('conteiner');
    main.innerHTML = `
    <section class="garage"></section>
    <section class="winners hidden"></section>
    `;
    document.body.append(main);
  }
}

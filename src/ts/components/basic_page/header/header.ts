import garageImageSrc from "./../../../../../public/images/car-repair-3661755.svg";
import winnensImageSrc from "./../../../../../public/images/6843056_achievement_award_competition_reward_success_icon.svg";

export default class Header {
  public static create(): void {
    const header = document.createElement('header');
    header.innerHTML = `
    <div class="conteiner">
      <div class="header">
        <div class="header__icon">
          <img src="./images/checker-flags-297188.svg" alt="flags" width="100px">
          <h1>Async race</h1>
        </div>
        <nav>
          <ul class="nav__box">
            <li><button class="btn btn-main btn-block" id="garage"><span>Garage</span><img src="${garageImageSrc}" alt="garage" height="30px"></button></li>
            <li><button class="btn btn-main" id="winners"><span>Winners</span><img src="${winnensImageSrc}" alt="winner" height="30px"></button></li>
          </ul>
        </nav>
      </div>
    </div>`;
    document.body.prepend(header);
  }
}

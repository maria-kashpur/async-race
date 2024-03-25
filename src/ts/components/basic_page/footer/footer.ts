import githubImageSrc from "../../../../../public/images/211904_social_github_icon.svg";

import RsschoolImageSrc from "../../../../../public/images/rs_school_js.svg";

export default class Footer {
  public static create(): void {
    const footer = document.createElement('footer');
    footer.innerHTML = `
    <ul class="footer __conteiner">
      <li class="footer__items">
        <a class="footer__item github" href="https://github.com/maria-kashpur" target="_blank">
          <img class="github-ico" src="${githubImageSrc}" alt="github" height="30" />
          <span class="github-name">@maria-kashpur, 2023</span>
        </a>
      </li>
      <li class="footer__items">
        <a class="footer__item rsschool" href="https://rollingscopes.com/" target="_blank">
          <img class="github-ico" src="${RsschoolImageSrc}" alt="RS School logo" height="30" />
        </a>
      </li>
    </ul>`;
    document.body.append(footer);
  }
}

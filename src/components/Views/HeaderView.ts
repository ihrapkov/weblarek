import { Component } from "../base/Component";

export class HeaderView extends Component<any> {
  protected _counter: HTMLElement;
  protected _basket: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._counter = container.querySelector(
      ".header__basket-counter",
    ) as HTMLElement;
    this._basket = container.querySelector(".header__basket") as HTMLElement;
  }

  /**
   * Сеттер для обновления счётчика товаров в корзине
   */
  set counter(value: number) {
    this._counter.textContent = String(value);
  }

  /**
   * Сеттер для обработки клика по иконке корзины
   */
  set onBasketClick(callback: () => void) {
    this._basket.addEventListener("click", callback);
  }
}

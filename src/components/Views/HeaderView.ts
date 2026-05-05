import { Component } from "../base/Component";

export class HeaderView extends Component<unknown> {
  protected _counter: HTMLElement;
  protected _basket: HTMLElement;

  constructor(
    container: HTMLElement,
    protected handlers: { onBasketClick: () => void },
  ) {
    super(container);
    this._counter = container.querySelector(
      ".header__basket-counter",
    ) as HTMLElement;
    this._basket = container.querySelector(".header__basket") as HTMLElement;
    this._basket.addEventListener("click", () => this.handlers.onBasketClick());
  }

  set counter(value: number) {
    this._counter.textContent = String(value);
  }
}

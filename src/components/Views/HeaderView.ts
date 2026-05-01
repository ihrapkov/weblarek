import { Component } from "../base/Component";
import type { IEvents } from "../base/Events";

export class HeaderView extends Component<unknown> {
  protected _counter: HTMLElement;
  protected _basket: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this._counter = container.querySelector(
      ".header__basket-counter",
    ) as HTMLElement;
    this._basket = container.querySelector(".header__basket") as HTMLElement;
    this._basket.addEventListener("click", () =>
      this.events.emit("header:basket-click"),
    );
  }

  set counter(value: number) {
    this._counter.textContent = String(value);
  }
}

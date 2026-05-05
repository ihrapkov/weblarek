import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface BasketViewData {
  items: HTMLElement[];
  total: number;
  canCheckout: boolean;
}

export class BasketView extends Component<BasketViewData> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _checkoutBtn: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected handlers: { onCheckout: () => void },
  ) {
    super(container);
    this._list = ensureElement<HTMLElement>(".basket__list", this.container);
    this._total = ensureElement<HTMLElement>(".basket__price", this.container);
    this._checkoutBtn = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );
    this._checkoutBtn.addEventListener("click", () =>
      this.handlers.onCheckout(),
    );
  }

  set items(value: HTMLElement[]) {
    this._list.replaceChildren(...value);
  }
  set total(value: number) {
    this._total.textContent = `${value} синапсов`;
  }
  set canCheckout(value: boolean) {
    this._checkoutBtn.disabled = !value;
  }
}

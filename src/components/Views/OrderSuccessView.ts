import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface OrderSuccessViewData {
  total: number;
}

export class OrderSuccessView extends Component<OrderSuccessViewData> {
  protected _total: HTMLElement;
  protected _closeBtn: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected handlers: { onClose: () => void },
  ) {
    super(container);
    this._total = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );
    this._closeBtn = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );
    this._closeBtn.addEventListener("click", () => this.handlers.onClose());
  }

  set total(value: number) {
    this._total.textContent = `Списано ${value} синапсов`;
  }
}

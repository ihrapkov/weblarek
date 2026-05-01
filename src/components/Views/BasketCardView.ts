import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import type { IEvents } from "../base/Events";

export interface BasketCardViewData {
  id: string;
  index: number;
  title: string;
  price: number;
}

export class BasketCardView extends Card<BasketCardViewData> {
  protected _index: HTMLElement;
  protected _deleteBtn: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this._index = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this._deleteBtn = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );
    this._deleteBtn.addEventListener("click", () =>
      this.events.emit("basket-card:delete", { id: this._id }),
    );
  }

  set index(value: number) {
    this._index.textContent = String(value);
  }

  protected formatPrice(value: number | null): string {
    return `${value} синапсов`;
  }
}

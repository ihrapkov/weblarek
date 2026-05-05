import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";

export interface BasketCardViewData {
  id: string;
  title: string;
  price: number;
}

export class BasketCardView extends Card<BasketCardViewData> {
  protected _deleteBtn: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected handlers: { onDelete: () => void },
  ) {
    super(container);
    this._deleteBtn = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );
    this._deleteBtn.addEventListener("click", () => this.handlers.onDelete());
  }

  protected formatPrice(value: number | null): string {
    return `${value} синапсов`;
  }
}

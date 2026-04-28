import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface BasketCardViewData {
  index: number;
  title: string;
  price: number;
  id: string;
}

export class BasketCardView extends Component<BasketCardViewData> {
  protected _index: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _deleteBtn: HTMLButtonElement;
  protected _id: string = "";

  constructor(container: HTMLElement) {
    super(container);
    this._index = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this._title = ensureElement<HTMLElement>(
      ".card__title",
      this.container,
    );
    this._price = ensureElement<HTMLElement>(
      ".card__price",
      this.container,
    );
    this._deleteBtn = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );
  }

  set index(value: number) {
    this._index.textContent = String(value);
  }
  set title(value: string) {
    this._title.textContent = value;
  }
  set price(value: number) {
    this._price.textContent = `${value} синапсов`;
  }
  set id(value: string) {
    this._id = value;
    this.container.dataset.id = value;
  }
  set onDelete(callback: () => void) {
    this._deleteBtn.addEventListener("click", callback);
  }

  override render(data?: Partial<BasketCardViewData>): HTMLElement {
    super.render(data);
    return this.container;
  }
}

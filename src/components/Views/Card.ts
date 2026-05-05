import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface CardData {
  id?: string;
  title: string;
  price: number | null;
}

export class Card<T extends CardData> extends Component<T> {
  protected _title: HTMLElement;
  protected _price: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this._title = ensureElement<HTMLElement>(".card__title", this.container);
    this._price = ensureElement<HTMLElement>(".card__price", this.container);
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set price(value: number | null) {
    this._price.textContent = this.formatPrice(value);
  }

  protected formatPrice(value: number | null): string {
    return value === null ? "Бесценно" : `${value} синапсов`;
  }
}

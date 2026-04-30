import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import type { Product } from "../../types";
import { CDN_URL, categoryMap } from "../../utils/constants";

export interface CatalogCardViewData extends Product {}

export class CatalogCardView extends Component<CatalogCardViewData> {
  protected _title: HTMLElement;
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;
  protected _price: HTMLElement;
  protected _id: string = "";

  constructor(container: HTMLElement) {
    super(container);
    this._title = ensureElement<HTMLElement>(".card__title", this.container);
    this._category = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this._image = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this._price = ensureElement<HTMLElement>(".card__price", this.container);
  }

  set id(value: string) {
    this._id = value;
    this.container.dataset.id = value;
  }
  set title(value: string) {
    this._title.textContent = value;
  }
  set category(value: string) {
    this._category.textContent = value;
    const categoryModifier =
      categoryMap[value as keyof typeof categoryMap] || "card__category_other";
    this._category.className = `card__category ${categoryModifier}`;
  }
  set image(value: string) {
    const resolvedSrc = value.startsWith("http")
      ? value
      : `${CDN_URL}/${value}`;
    this.setImage(this._image, resolvedSrc, value);
  }
  set price(value: number | null) {
    this._price.textContent = value ? `${value} синапсов` : "Бесценно";
  }

  // Вешаем событие на весь контейнер
  set onSelect(callback: () => void) {
    this.container.addEventListener("click", callback);
  }

  override render(data?: Partial<CatalogCardViewData>): HTMLElement {
    super.render(data); // Object.assign вызовет все сеттеры автоматически
    return this.container;
  }
}

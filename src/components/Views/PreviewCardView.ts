import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import type { Product } from "../../types";
import { CDN_URL } from "../../utils/constants";

export interface PreviewCardViewData extends Product {}

export class PreviewCardView extends Component<PreviewCardViewData> {
  protected _title: HTMLElement;
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;
  protected _text: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

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
    this._text = ensureElement<HTMLElement>(".card__text", this.container);
    this._price = ensureElement<HTMLElement>(".card__price", this.container);
    this._button = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );
  }

  set title(value: string) {
    this._title.textContent = value;
  }

  set category(value: string) {
    this._category.textContent = value;
    // Динамическое изменение класса категории (стандартная логика проекта)
    const categoryClasses: Record<string, string> = {
      "софт-скил": "soft",
      другое: "other",
      дополнительное: "additional",
      кнопка: "button",
      "хард-скил": "hard",
    };
    this._category.className = `card__category card__category_${categoryClasses[value] || "other"}`;
  }

  set image(value: string) {
    const resolvedSrc = value.startsWith("http")
      ? value
      : `${CDN_URL}/${value}`;
    this.setImage(this._image, resolvedSrc, value);
  }

  set description(value: string) {
    this._text.textContent = value;
  }

  set price(value: number | null) {
    this._price.textContent = value ? `${value} синапсов` : "Бесценно";
    this._button.disabled = value === null;
  }

  set inCart(value: boolean) {
    this._button.textContent = value ? "Удалить из корзины" : "В корзину";
  }

  set onAddToCart(callback: () => void) {
    this._button.onclick = callback;
  }

  set onRemoveFromCart(callback: () => void) {
    this._button.onclick = callback;
  }

  override render(data?: Partial<PreviewCardViewData>): HTMLElement {
    super.render(data); // Вызывает сеттеры через Object.assign
    return this.container;
  }
}

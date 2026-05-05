import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import type { Product } from "../../types";
import { CDN_URL, categoryMap } from "../../utils/constants";

export interface PreviewCardViewData extends Product {
  inCart?: boolean;
}

export class PreviewCardView extends Card<PreviewCardViewData> {
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;
  protected _text: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected handlers: {
      onAction: () => void;
    },
  ) {
    super(container);
    this._category = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this._image = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this._text = ensureElement<HTMLElement>(".card__text", this.container);
    this._button = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );
    this._button.addEventListener("click", () => {
      this.handlers.onAction();
    });
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

  set description(value: string) {
    this._text.textContent = value;
  }

  set price(value: number | null) {
    super.price = value;
    this._button.disabled = value === null;
  }

  set inCart(value: boolean) {
    this._button.textContent = value ? "Удалить из корзины" : "В корзину";
  }
}

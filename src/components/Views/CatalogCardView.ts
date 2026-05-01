import { Card } from "./Card";
import { ensureElement } from "../../utils/utils";
import type { Product } from "../../types";
import { CDN_URL, categoryMap } from "../../utils/constants";
import type { IEvents } from "../base/Events";

export interface CatalogCardViewData extends Product {}

export class CatalogCardView extends Card<CatalogCardViewData> {
  protected _category: HTMLElement;
  protected _image: HTMLImageElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
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
    this.container.addEventListener("click", () =>
      this.events.emit("card:select", { id: this._id }),
    );
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
}

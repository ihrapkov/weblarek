import { Component } from "../base/Component";
import { CDN_URL, categoryMap } from "../../utils/constants";

export interface CardViewData {
  id: string;
  title: string;
  category: string;
  image: string;
  price: number | null;
  description?: string;
}

export abstract class CardView<
  T extends CardViewData = CardViewData,
> extends Component<T> {
  protected readonly titleElement: HTMLElement | null;
  protected readonly categoryElement: HTMLElement | null;
  protected readonly imageElement: HTMLImageElement | null;
  protected readonly priceElement: HTMLElement | null;

  protected constructor(container: HTMLElement) {
    super(container);

    this.titleElement =
      this.container.querySelector<HTMLElement>(".card__title");
    this.categoryElement =
      this.container.querySelector<HTMLElement>(".card__category");
    this.imageElement =
      this.container.querySelector<HTMLImageElement>(".card__image");
    this.priceElement =
      this.container.querySelector<HTMLElement>(".card__price");
  }

  public override render(data?: Partial<T>): HTMLElement {
    if (typeof data?.id === "string") {
      this.container.dataset.id = data.id;
    }

    if (typeof data?.title === "string" && this.titleElement) {
      this.titleElement.textContent = data.title;
    }

    if (typeof data?.category === "string") {
      this.renderCategory(data.category);
    }

    if (typeof data?.image === "string" && this.imageElement) {
      this.setImage(
        this.imageElement,
        this.resolveImageUrl(data.image),
        data.title,
      );
    }

    if ("price" in (data ?? {}) && this.priceElement) {
      this.priceElement.textContent = this.formatPrice(data?.price ?? null);
    }

    return this.container;
  }

  private renderCategory(category: string): void {
    if (!this.categoryElement) {
      return;
    }

    this.categoryElement.textContent = category;
    Object.values(categoryMap).forEach((className) => {
      this.categoryElement?.classList.remove(className);
    });

    const categoryClass = categoryMap[category as keyof typeof categoryMap];
    if (categoryClass) {
      this.categoryElement.classList.add(categoryClass);
    }
  }

  private formatPrice(price: number | null): string {
    return price === null ? "Бесценно" : `${price} синапсов`;
  }

  private resolveImageUrl(image: string): string {
    if (/^https?:\/\//i.test(image)) {
      return image;
    }
    const normalizedImage = image.startsWith("/") ? image.slice(1) : image;
    return `${CDN_URL}/${normalizedImage}`;
  }
}

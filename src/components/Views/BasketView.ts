import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface BasketViewData {
  items: HTMLElement[];
  total: number;
  canCheckout: boolean;
}

export class BasketView extends Component<BasketViewData> {
  private readonly basketElement: HTMLElement;
  private readonly listElement: HTMLElement;
  private readonly priceElement: HTMLElement;
  private readonly checkoutButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private readonly onCheckout?: () => void,
  ) {
    super(container);

    this.basketElement = this.container.matches(".basket")
      ? this.container
      : ensureElement<HTMLElement>(".basket", this.container);
    this.listElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.basketElement,
    );
    this.priceElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.basketElement,
    );
    this.checkoutButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.basketElement,
    );

    this.checkoutButton.addEventListener("click", (event: MouseEvent) => {
      event.preventDefault();
      this.onCheckout?.();
    });
  }

  public override render(data?: Partial<BasketViewData>): HTMLElement {
    if (Array.isArray(data?.items)) {
      this.listElement.replaceChildren(...data.items);
    }

    if (typeof data?.total === "number") {
      this.priceElement.textContent = `${data.total} синапсов`;
    }

    if (typeof data?.canCheckout === "boolean") {
      this.checkoutButton.disabled = !data.canCheckout;
    }

    return this.container;
  }
}

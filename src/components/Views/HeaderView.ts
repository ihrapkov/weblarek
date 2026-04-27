import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface HeaderViewData {
  basketCount: number;
}

export class HeaderView extends Component<HeaderViewData> {
  private readonly headerBasketButton: HTMLButtonElement;
  private readonly basketCountElement: HTMLElement;

  constructor(
    container: HTMLElement,
    private readonly onBasketClick?: () => void,
  ) {
    super(container);

    this.headerBasketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container,
    );
    this.basketCountElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container,
    );

    this.headerBasketButton.addEventListener("click", (event: Event) => {
      event.preventDefault();
      this.onBasketClick?.();
    });
  }

  override render(data?: Partial<HeaderViewData>): HTMLElement {
    if (typeof data?.basketCount === "number") {
      this.basketCountElement.textContent = String(data.basketCount);
    }

    return this.container;
  }
}

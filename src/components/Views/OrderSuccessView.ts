import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface OrderSuccessViewData {
  total: number;
}

export class OrderSuccessView extends Component<OrderSuccessViewData> {
  private readonly descriptionElement: HTMLElement;
  private readonly closeButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private readonly onClose?: () => void,
  ) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );

    this.closeButton.addEventListener("click", (event: MouseEvent) => {
      event.preventDefault();
      this.onClose?.();
    });
  }

  public override render(data?: Partial<OrderSuccessViewData>): HTMLElement {
    if (typeof data?.total === "number") {
      this.descriptionElement.textContent = `Списано ${data.total} синапсов`;
    }

    return this.container;
  }
}

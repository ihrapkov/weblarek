import { CardView, type CardViewData } from "./CardView";
import { ensureElement } from "../../utils/utils";

export interface BasketCardViewData extends CardViewData {
  index: number;
}

export class BasketCardView extends CardView<BasketCardViewData> {
  private readonly indexElement: HTMLElement;
  private readonly deleteButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private readonly onDeleteClick?: (id: string) => void,
  ) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );

    this.deleteButton.addEventListener("click", (event: MouseEvent) => {
      event.preventDefault();
      const id = this.container.dataset.id;
      if (!id) {
        return;
      }
      this.onDeleteClick?.(id);
    });
  }

  public override render(data?: Partial<BasketCardViewData>): HTMLElement {
    super.render(data);

    if (typeof data?.index === "number") {
      this.indexElement.textContent = String(data.index);
    }

    return this.container;
  }
}

import { CardView, type CardViewData } from "./CardView";

export interface CatalogCardViewData extends CardViewData {}

export class CatalogCardView extends CardView<CatalogCardViewData> {
  constructor(
    container: HTMLElement,
    private readonly onCardClick?: (id: string) => void,
  ) {
    super(container);

    this.container.addEventListener("click", (event: MouseEvent) => {
      event.preventDefault();
      const id = this.container.dataset.id;
      if (!id) {
        return;
      }
      this.onCardClick?.(id);
    });
  }
}

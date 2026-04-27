import { CardView, type CardViewData } from "./CardView";
import { ensureElement } from "../../utils/utils";

export interface PreviewCardViewData extends CardViewData {
  description: string;
  buttonText: string;
  buttonDisabled: boolean;
}

export class PreviewCardView extends CardView<PreviewCardViewData> {
  private readonly descriptionElement: HTMLElement;
  private readonly actionButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private readonly onActionClick?: (id: string) => void,
  ) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );
    this.actionButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    this.actionButton.addEventListener("click", (event: MouseEvent) => {
      event.preventDefault();
      const id = this.container.dataset.id;
      if (!id) {
        return;
      }
      this.onActionClick?.(id);
    });
  }

  public override render(data?: Partial<PreviewCardViewData>): HTMLElement {
    super.render(data);

    if (typeof data?.description === "string") {
      this.descriptionElement.textContent = data.description;
    }

    if (typeof data?.buttonText === "string") {
      this.actionButton.textContent = data.buttonText;
    }

    if (typeof data?.buttonDisabled === "boolean") {
      this.actionButton.disabled = data.buttonDisabled;
    }

    return this.container;
  }
}

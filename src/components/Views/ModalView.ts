import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface ModalViewData {
  content: HTMLElement;
  isOpen: boolean;
}

export type ModalCloseReason = "button" | "overlay" | "escape";
export type ModalCloseHandler = (reason: ModalCloseReason) => void;

export class ModalView extends Component<ModalViewData> {
  private readonly modalElement: HTMLElement;
  private readonly closeButton: HTMLButtonElement;
  private readonly contentElement: HTMLElement;

  constructor(
    container: HTMLElement,
    private readonly onCloseRequest?: ModalCloseHandler,
  ) {
    super(container);

    this.modalElement = this.container.matches(".modal")
      ? this.container
      : ensureElement<HTMLElement>(".modal", this.container);
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.modalElement,
    );
    this.contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      this.modalElement,
    );

    this.closeButton.addEventListener("click", (event: MouseEvent) => {
      event.preventDefault();
      this.onCloseRequest?.("button");
    });

    this.modalElement.addEventListener("click", (event: MouseEvent) => {
      if (event.target === this.modalElement) {
        this.onCloseRequest?.("overlay");
      }
    });

    document.addEventListener("keydown", (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        this.modalElement.classList.contains("modal_active")
      ) {
        this.onCloseRequest?.("escape");
      }
    });
  }

  public open(content?: HTMLElement): void {
    if (content) {
      this.setContent(content);
    }
    this.setOpenState(true);
  }

  public close(): void {
    this.setOpenState(false);
  }

  public override render(data?: Partial<ModalViewData>): HTMLElement {
    if (data?.content instanceof HTMLElement) {
      this.setContent(data.content);
    }

    if (typeof data?.isOpen === "boolean") {
      this.setOpenState(data.isOpen);
    }

    return this.container;
  }

  private setContent(content: HTMLElement): void {
    this.contentElement.replaceChildren(content);
  }

  private setOpenState(isOpen: boolean): void {
    this.modalElement.classList.toggle("modal_active", isOpen);
  }
}

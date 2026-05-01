import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import type { IEvents } from "../base/Events";

export class ModalView extends Component<unknown> {
  protected _content: HTMLElement;
  protected _closeBtn: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this._content = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );
    this._closeBtn = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );

    this._closeBtn.addEventListener("click", () => this.close());
    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) this.close();
    });
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open(component: Component<unknown>) {
    this.content = component.render();
    this.container.classList.add("modal_active");
    this.events.emit("modal:open");
  }

  close() {
    this.container.classList.remove("modal_active");
    this.events.emit("modal:close");
  }

  override render(): HTMLElement {
    return this.container;
  }
}

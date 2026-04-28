import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class ModalView extends Component<any> {
  protected _content: HTMLElement;
  protected _closeBtn: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    // Контент модальных окон вставляется именно сюда
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

  open(component: Component<any>) {
    this.content = component.render();
    this.container.classList.add("modal_active");
    document.body.classList.add("modal_open");
  }

  close() {
    this.container.classList.remove("modal_active");
    document.body.classList.remove("modal_open");
  }

  override render(): HTMLElement {
    return this.container;
  }
}

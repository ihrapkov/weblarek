import { Component } from "../base/Component";

export class PageView extends Component<unknown> {
  constructor(container: HTMLElement) {
    super(container);
  }

  lock() {
    this.container.classList.add("modal_open");
  }

  unlock() {
    this.container.classList.remove("modal_open");
  }
}
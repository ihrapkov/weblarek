import { Component } from "../base/Component";

export interface GalleryViewData {
  items: HTMLElement[];
}

export class GalleryView extends Component<GalleryViewData> {
  constructor(container: HTMLElement) {
    super(container);
  }

  /**
   * Сеттер для полной замены содержимого галереи
   */
  set items(items: HTMLElement[]) {
    // this.container гарантированно существует после вызова super()
    this.container.replaceChildren(...items);
  }
}

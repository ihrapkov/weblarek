import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface GalleryViewData {
  catalog: HTMLElement[];
}

export class GalleryView extends Component<GalleryViewData> {
  private readonly catalogElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    // Если в конструктор передан сам .gallery, используем его.
    // Иначе ищем .gallery внутри переданного контейнера.
    this.catalogElement = this.container.matches(".gallery")
      ? this.container
      : ensureElement<HTMLElement>(".gallery", this.container);
  }

  public render(data?: Partial<GalleryViewData>): HTMLElement {
    if (Array.isArray(data?.catalog)) {
      this.renderCatalog(data.catalog);
    }

    return this.container;
  }

  private renderCatalog(items: HTMLElement[]): void {
    this.catalogElement.replaceChildren(...items);
  }
}

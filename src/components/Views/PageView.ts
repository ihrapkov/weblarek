import { Component } from "../base/Component";

export interface PageViewState {
  isLocked: boolean;
}

/**
 * Пример реализованного View-класса.
 * Отвечает за визуальное состояние корневого контейнера страницы.
 */
export class PageView extends Component<PageViewState> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set isLocked(value: boolean) {
    this.toggleScroll(value);
  }

  public lock(): void {
    this.toggleScroll(true);
  }

  public unlock(): void {
    this.toggleScroll(false);
  }

  public render(data?: Partial<PageViewState>): HTMLElement {
    if (typeof data?.isLocked === "boolean") {
      this.toggleScroll(data.isLocked);
    }
    return this.container;
  }

  private toggleScroll(isLocked: boolean): void {
    this.container.style.overflow = isLocked ? "hidden" : "";
  }
}

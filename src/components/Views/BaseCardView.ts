import { Component } from '../base/Component';
import { categoryMap } from '../../utils/constants';

interface CardViewProps {
  title: string;
  price: number | null;
  category: string;
  image: string;
}

export abstract class BaseCardView extends Component<CardViewProps> {
  protected titleEl: HTMLElement;
  protected priceEl: HTMLElement;
  protected categoryEl: HTMLElement;
  protected imageEl: HTMLImageElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleEl = this.container.querySelector('.card__title') as HTMLElement;
    this.priceEl = this.container.querySelector('.card__price') as HTMLElement;
    this.categoryEl = this.container.querySelector('.card__category') as HTMLElement;
    this.imageEl = this.container.querySelector('.card__image') as HTMLImageElement;
  }

  set title(value: string) {
    this.titleEl.textContent = value;
  }

  set price(value: number | null) {
    this.priceEl.textContent = value === null ? 'бесценно' : `${value} синапсов`;
  }

  set category(value: string) {
    this.categoryEl.textContent = value;
    const categoryModifier = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
    this.categoryEl.className = `card__category ${categoryModifier}`;
  }

  set image(value: string) {
    this.setImage(this.imageEl, value);
  }
}

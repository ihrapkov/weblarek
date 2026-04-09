import type { Product } from '../../types';

export class Cart {
  private items: Product[] = [];

  /** Получение массива товаров в корзине */
  public getItems(): Product[] {
    return [...this.items];
  }

  /** Добавление товара в корзину */
  public addItem(product: Product): void {
    this.items.push(product);
  }

  /** Удаление товара из корзины */
  public removeItem(product: Product): void {
    const index = this.items.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  /** Очистка корзины */
  public clear(): void {
    this.items = [];
  }

  /** Получение стоимости всех товаров в корзине */
  public getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  /** Получение количества товаров в корзине */
  public getItemCount(): number {
    return this.items.length;
  }

  /** Проверка наличия товара в корзине по ID */
  public hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}

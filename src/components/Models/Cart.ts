import type { Product, CartAddEvent, CartRemoveEvent, CartClearEvent } from '../../types';
import { EventEmitter } from '../base/Events';

export class Cart extends EventEmitter {
  private items: Product[] = [];

  /** Получение массива товаров в корзине */
  public getItems(): Product[] {
    return [...this.items];
  }

  /** Добавление товара в корзину */
  public addItem(product: Product): void {
    this.items.push(product);
    this.emit<CartAddEvent>('cart:add', { product });
  }

  /** Удаление товара из корзины */
  public removeItem(product: Product): void {
    const index = this.items.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      this.items.splice(index, 1);
      this.emit<CartRemoveEvent>('cart:remove', { product });
    }
  }

  /** Очистка корзины */
  public clear(): void {
    const items = [...this.items];
    this.items = [];
    this.emit<CartClearEvent>('cart:clear', { items });
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

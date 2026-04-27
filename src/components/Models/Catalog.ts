import type { Product, CatalogUpdateEvent, CatalogSelectedChangeEvent } from '../../types';
import { EventEmitter } from '../base/Events';

export class Catalog extends EventEmitter {
  private products: Product[] = [];
  private selectedProduct: Product | null = null;

  /** Сохранение массива товаров */
  public setProducts(products: Product[]): void {
    this.products = [...products];
    this.emit<CatalogUpdateEvent>('catalog:update', { products });
  }

  /** Получение массива товаров */
  public getProducts(): Product[] {
    return [...this.products];
  }

  /** Получение одного товара по ID */
  public getProductById(id: string): Product | undefined {
    return this.products.find((product) => product.id === id);
  }

  /** Сохранение товара для подробного отображения */
  public setSelectedProduct(product: Product | null): void {
    this.selectedProduct = product;
    this.emit<CatalogSelectedChangeEvent>('catalog:selected-change', { product });
  }

  /** Получение товара для подробного отображения */
  public getSelectedProduct(): Product | null {
    return this.selectedProduct;
  }
}

import type {
  IApi,
  Product,
  ProductListResponse,
  Order,
  OrderResult,
} from "../../types";

export class LarekApi {
  private _api: IApi;

  constructor(api: IApi) {
    this._api = api;
  }

  /** Получение списка всех товаров */
  getProducts(): Promise<ProductListResponse> {
    return this._api.get<ProductListResponse>("/product");
  }

  /** Получение одного товара по ID */
  getProductById(id: string): Promise<Product> {
    return this._api.get<Product>(`/product/${id}`);
  }

  /** Отправка заказа на сервер */
  postOrder(order: Order): Promise<OrderResult> {
    return this._api.post<OrderResult>("/order", order);
  }
}

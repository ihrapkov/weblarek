export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface Product {
  id: string;
  title: string;
  image: string;
  category: string;
  price: number | null;
  description: string;
}

export interface Customer {
  payment: "card" | "cash" | "";
  address: string;
  email: string;
  phone: string;
}

export interface CustomerValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof Customer, string>>;
}

/** Ответ сервера со списком товаров */
export interface ProductListResponse {
  total: number;
  items: Product[];
}

/** Данные для отправки заказа на сервер */
export interface Order extends Customer {
  total: number;
  items: string[];
}

/** Результат создания заказа на сервере */
export interface OrderResult {
  id: string;
  total: number;
}

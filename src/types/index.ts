export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export type TPayment = "card" | "cash" | "";

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
  payment: TPayment;
  address: string;
  email: string;
  phone: string;
}

export type CustomerErrors = Partial<Record<keyof Customer, string>>;

export interface CustomerValidationResult {
  isValid: boolean;
  errors: CustomerErrors;
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

// События Catalog
export interface CatalogUpdateEvent {
  products: Product[];
}

export interface CatalogSelectedChangeEvent {
  product: Product | null;
}

// События Cart
export interface CartAddEvent {
  product: Product;
}

export interface CartRemoveEvent {
  product: Product;
}

export interface CartClearEvent {
  items: Product[];
}

// События CustomerData
export interface CustomerUpdateEvent {
  data: Customer;
}

export interface CustomerClearEvent {
  data: Customer;
}

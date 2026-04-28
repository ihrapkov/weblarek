# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

#### Типы данных

Все типы объявлены в файле `src/types/index.ts`.

**`ApiPostMethods`** — тип, описывающий доступные HTTP-методы для POST-запросов:

```typescript
export type ApiPostMethods = "POST" | "PUT" | "DELETE";
```

**`IApi`** — интерфейс для класса отправки HTTP-запросов. Используется для инверсии зависимостей:

```typescript
export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}
```

**`Product`** — интерфейс товара:

```typescript
export interface Product {
  id: string;
  title: string;
  image: string;
  category: string;
  price: number | null;
  description: string;
}
```

**`Customer`** — интерфейс данных покупателя:

```typescript
export interface Customer {
  payment: "card" | "cash" | "";
  address: string;
  email: string;
  phone: string;
}
```

**`CustomerValidationResult`** — результат валидации данных покупателя:

```typescript
export interface CustomerValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof Customer, string>>;
}
```

**`ProductListResponse`** — ответ сервера со списком товаров:

```typescript
export interface ProductListResponse {
  total: number;
  items: Product[];
}
```

**`Order`** — данные для отправки заказа на сервер. Расширяет `Customer` полями `total` и `items`:

```typescript
export interface Order extends Customer {
  total: number;
  items: string[];
}
```

**`OrderResult`** — результат создания заказа на сервере:

```typescript
export interface OrderResult {
  id: string;
  total: number;
}
```

#### Модели данных

##### Catalog

Класс для хранения и управления каталогом товаров.

```typescript
export class Catalog {
  private products: Product[] = [];
  private selectedProduct: Product | null = null;

  /** Сохранение массива товаров */
  public setProducts(products: Product[]): void {
    this.products = [...products];
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
  }

  /** Получение товара для подробного отображения */
  public getSelectedProduct(): Product | null {
    return this.selectedProduct;
  }
}
```

Поля класса:
`products: Product[]` — массив всех товаров каталога.
`selectedProduct: Product | null` — текущий выбранный товар для подробного отображения.

Методы класса:
`setProducts(products: Product[]): void` — сохраняет массив товаров, создавая копию переданного массива.
`getProducts(): Product[]` — возвращает копию массива всех товаров.
`getProductById(id: string): Product | undefined` — возвращает товар с указанным ID или `undefined`, если товар не найден.
`setSelectedProduct(product: Product | null): void` — сохраняет товар для подробного отображения или сбрасывает выбор при передаче `null`.
`getSelectedProduct(): Product | null` — возвращает текущий выбранный товар или `null`.

##### Cart

Класс для хранения и управления корзиной покупок.

```typescript
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
```

Поля класса:
`items: Product[]` — массив товаров, добавленных в корзину.

Методы класса:
`getItems(): Product[]` — возвращает копию массива товаров в корзине.
`addItem(product: Product): void` — добавляет товар в корзину.
`removeItem(product: Product): void` — удаляет товар из корзины по совпадению ID.
`clear(): void` — очищает корзину.
`getTotalPrice(): number` — возвращает суммарную стоимость всех товаров в корзине (товары с `null` ценой считаются как 0).
`getItemCount(): number` — возвращает количество товаров в корзине.
`hasItem(id: string): boolean` — проверяет наличие товара с указанным ID в корзине.

##### CustomerData

Класс для хранения и валидации данных покупателя.

```typescript
export class CustomerData {
  private data: Customer = {
    payment: "",
    address: "",
    email: "",
    phone: "",
  };

  /** Сохранение данных в модели */
  public update(fields: Partial<Customer>): void {
    this.data = { ...this.data, ...fields };
  }

  /** Получение всех данных покупателя */
  public getData(): Customer {
    return { ...this.data };
  }

  /** Очистка данных покупателя */
  public clear(): void {
    this.data = { payment: "", address: "", email: "", phone: "" };
  }

  /** Валидация данных */
  public validate(): CustomerValidationResult {
    const errors: Partial<Record<keyof Customer, string>> = {};

    if (!this.data.payment) {
      errors.payment = "Необходимо выбрать способ оплаты";
    }
    if (!this.data.address.trim()) {
      errors.address = "Адрес не может быть пустым";
    }
    if (!this.data.email.trim()) {
      errors.email = "Email не может быть пустым";
    }
    if (!this.data.phone.trim()) {
      errors.phone = "Телефон не может быть пустым";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
```

Поля класса:
`data: Customer` — объект с данными покупателя (способ оплаты, адрес, email, телефон).

Методы класса:
`update(fields: Partial<Customer>): void` — обновляет переданные поля данных покупателя, не перезаписывая остальные.
`getData(): Customer` — возвращает копию объекта с данными покупателя.
`clear(): void` — сбрасывает все данные покупателя к пустым значениям.
`validate(): CustomerValidationResult` — проверяет все поля на заполненность и возвращает объект `{ isValid: boolean, errors: Partial<Record<keyof Customer, string>> }`.

#### Слой коммуникации

Класс для взаимодействия с сервером API. Использует композицию — принимает в конструктор объект, реализующий интерфейс `IApi`, и делегирует ему выполнение HTTP-запросов.

```typescript
export class LarekApi {
  private _api: IApi;

  /**
   * @param api — объект, реализующий интерфейс IApi
   */
  constructor(api: IApi) {
    this._api = api;
  }

  /** Получение списка всех товаров */
  getProducts(): Promise<Product[]> {
    return this._api
      .get<ProductListResponse>("/product")
      .then((data) => data.items);
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
```

Поля класса:
`_api: IApi` — объект, реализующий интерфейс `IApi`, через который выполняются запросы.

Методы класса:
`getProducts(): Promise<Product[]>` — выполняет GET-запрос к ендпоинту `/product`, получает объект с массивом товаров и возвращает сам массив.
`getProductById(id: string): Promise<Product>` — выполняет GET-запрос к ендпоинту `/product/{id}` и возвращает объект одного товара.
`postOrder(order: Order): Promise<OrderResult>` — выполняет POST-запрос к ендпоинту `/order`, передавая данные заказа, и возвращает результат создания заказа.

## Презентер

Презентер — это слой, который содержит основную логику приложения и отвечает за связь между моделью данных и представлением. В данном приложении презентер реализован в файле `main.ts`.

Презентер обрабатывает события, генерируемые моделями данных и представлениями, и выполняет соответствующие действия:

- Подписывается на события моделей данных (изменение каталога, корзины, данных покупателя)
- Обрабатывает события представлений (выбор товара, добавление в корзину, оформление заказа)
- Обновляет состояние приложения в ответ на пользовательские действия
- Координирует отображение данных через представления

Важные принципы реализации презентера:

- Презентер не генерирует события, он только обрабатывает их
- Представление перерисовывается только при изменении данных в модели или при открытии модального окна
- Код презентера состоит из обработчиков событий

## События приложения

В приложении используется событийно-ориентированная архитектура для связи между компонентами. Все события генерируются через брокер событий `EventEmitter`.

### События представлений

**`modal:open`** - генерируется при открытии модального окна
- Параметры: `content: HTMLElement` - содержимое модального окна
- Источник: `ModalView`

**`modal:close`** - генерируется при закрытии модального окна
- Параметры: `reason: "button" | "overlay" | "escape"` - причина закрытия
- Источник: `ModalView`

**`card:select`** - генерируется при выборе товара в каталоге
- Параметры: `id: string` - идентификатор выбранного товара
- Источник: `CatalogCardView`

**`basket:add`** - генерируется при добавлении товара в корзину
- Параметры: `id: string` - идентификатор товара
- Источник: `PreviewCardView`

**`basket:remove`** - генерируется при удалении товара из корзины
- Параметры: `id: string` - идентификатор товара
- Источник: `BasketCardView`

**`order:submit`** - генерируется при оформлении заказа
- Параметры: отсутствуют
- Источник: `BasketView`

**`payment:change`** - генерируется при изменении способа оплаты
- Параметры: `payment: "card" | "cash"` - выбранный способ оплаты
- Источник: `OrderFormView`

**`form:input`** - генерируется при вводе данных в формы
- Параметры: `name: string, value: string` - имя поля и его значение
- Источник: `FormView`

**`contacts:submit`** - генерируется при отправке контактной формы
- Параметры: отсутствуют
- Источник: `ContactsFormView`

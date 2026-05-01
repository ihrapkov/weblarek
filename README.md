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
export type CustomerErrors = Partial<Record<keyof Customer, string>>;

export interface CustomerValidationResult {
  isValid: boolean;
  errors: CustomerErrors;
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
    const errors: CustomerErrors = {};

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
`validate(): CustomerValidationResult` — проверяет все поля на заполненность и возвращает объект `{ isValid: boolean, errors: CustomerErrors }`.

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
```

Поля класса:
`_api: IApi` — объект, реализующий интерфейс `IApi`, через который выполняются запросы.

Методы класса:
`getProducts(): Promise<ProductListResponse>` — выполняет GET-запрос к ендпоинту `/product` и возвращает полный ответ сервера с массивом товаров.
`getProductById(id: string): Promise<Product>` — выполняет GET-запрос к ендпоинту `/product/{id}` и возвращает объект одного товара.
`postOrder(order: Order): Promise<OrderResult>` — выполняет POST-запрос к ендпоинту `/order`, передавая данные заказа, и возвращает результат создания заказа.

## Слой представления

View-слой **генерирует события через IEvents**. Используется паттерн **Event-Driven**: Презентер передаёт экземпляр `EventEmitter` в конструктор View, и View эмитит именованные события при взаимодействии пользователя. Это обеспечивает полное разделение ответственности и переиспользуемость компонентов.

**Базовые классы:**

- `Card<T>` — базовый класс для карточек товаров с общими полями `id`, `title`, `price`
- `Form<T>` — базовый класс для форм с общими полями `errors`, `valid` и логикой отправки

| Класс              | Назначение                  | Ключевые свойства / события                                                                                         |
| :----------------- | :-------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Базовые**        |                             |                                                                                                                     |
| `Card<T>`          | Карточка товара (наследник) | `id`, `title`, `price`, `formatPrice()`                                                                             |
| `Form<T>`          | Форма (наследник)           | `errors`, `valid`                                                                                                   |
| **Карточки**       |                             |                                                                                                                     |
| `CatalogCardView`  | Карточка в каталоге         | `id`, `title`, `category`, `image`, `price` → `card:select`                                                         |
| `PreviewCardView`  | Детальный просмотр          | `title`, `category`, `image`, `description`, `price`, `inCart` → `preview:add-to-cart` / `preview:remove-from-cart` |
| `BasketCardView`   | Позиция в корзине           | `index`, `title`, `price`, `id` → `basket-card:delete`                                                              |
| **Формы**          |                             |                                                                                                                     |
| `OrderFormView`    | Шаг 1: Оплата + Адрес       | `payment`, `address`, `errors`, `valid` → `order:payment-change`, `order:address-input`, `order:submit`             |
| `ContactsFormView` | Шаг 2: Email + Телефон      | `email`, `phone`, `errors`, `valid` → `contacts:email-input`, `contacts:phone-input`, `contacts:submit`             |
| **Прочие**         |                             |                                                                                                                     |
| `BasketView`       | Контейнер корзины           | `items`, `total`, `canCheckout` → `basket:checkout`                                                                 |
| `OrderSuccessView` | Экран успеха                | `total` → `success:reset`                                                                                           |
| `ModalView`        | Модальное окно + оверлей    | `content`, методы `open(component)`, `close()` → `modal:open`, `modal:close`                                        |
| `HeaderView`       | Шапка + счётчик             | `counter` → `header:basket-click`                                                                                   |

---

## 🎛 Презентер (`src/main.ts`)

Файл выступает **Composition Root** и центральным маршрутизатором. Содержит всю бизнес-логику приложения и связывает модели с представлениями через единую шину событий (`EventEmitter`).

### 🔹 Маршрутизация пользовательских действий

| Действие                  | Событие от View            | Обработчик в презентере                      | Результат                                           |
| :------------------------ | :------------------------- | :------------------------------------------- | :-------------------------------------------------- |
| Клик по корзине           | `header:basket-click`      | `events.on("header:basket-click", ...)`      | `updateBasketUI()` → `modal.open(basketView)`       |
| Клик "Оформить"           | `basket:checkout`          | `events.on("basket:checkout", ...)`          | открытие `orderForm` (данные не сбрасываются)       |
| Выбор оплаты              | `order:payment-change`     | `events.on("order:payment-change", ...)`     | `customerData.update({ payment })`                  |
| Ввод адреса               | `order:address-input`      | `events.on("order:address-input", ...)`      | `customerData.update({ address })`                  |
| Submit формы адреса       | `order:submit`             | `events.on("order:submit", ...)`             | открытие `contactsForm`                             |
| Ввод email                | `contacts:email-input`     | `events.on("contacts:email-input", ...)`     | `customerData.update({ email })`                    |
| Ввод телефона             | `contacts:phone-input`     | `events.on("contacts:phone-input", ...)`     | `customerData.update({ phone })`                    |
| Submit формы контактов    | `contacts:submit`          | `events.on("contacts:submit", ...)`          | `LarekApi.postOrder()` → при успехе очистка моделей |
| Клик "Удалить" в корзине  | `basket-card:delete`       | `events.on("basket-card:delete", ...)`       | `cart.removeItem(product)`                          |
| Клик "В корзину"          | `preview:add-to-cart`      | `events.on("preview:add-to-cart", ...)`      | `cart.addItem(product)`                             |
| Клик "Удалить из корзины" | `preview:remove-from-cart` | `events.on("preview:remove-from-cart", ...)` | `cart.removeItem(product)`                          |
| Клик по карточке товара   | `card:select`              | `events.on("card:select", ...)`              | `catalog.setSelectedProduct(product)`               |
| Клик "Закрыть" успеха     | `success:reset`            | `events.on("success:reset", ...)`            | `modal.close()` (без очистки данных)                |

### 🔹 Подписка на события моделей

| Событие                                   | Действие Презентера                                                                        |
| :---------------------------------------- | :----------------------------------------------------------------------------------------- |
| `catalog:update`                          | Генерирует массив `CatalogCardView`, рендерит `galleryView`                                |
| `catalog:selected-change`                 | Рендерит `PreviewCardView`, проверяет наличие в корзине, открывает модалку                 |
| `cart:add` / `cart:remove` / `cart:clear` | Обновляет счётчик, вызывает `updateBasketUI()`, синхронизирует состояние `PreviewCardView` |
| `customer:update`                         | Синхронизирует данные в `orderForm` и `contactsForm`, обновляет `valid`                    |
| `customer:clear`                          | Сбрасывает значения в формах на пустые, блокирует кнопку отправки                          |

---

## 📡 Система событий

В приложении используется **единая событийная модель**:

- **Модели** генерируют события через `EventEmitter` (наследуются от `EventEmitter`).
- **Представления** также используют `EventEmitter`, передаваемый в конструктор. Все взаимодействия с презентером происходят через именованные события.

Это обеспечивает:

- **Прозрачный поток данных**: View → событие → Presenter → Model → событие модели → View
- **Отсутствие циклических зависимостей**: View не знают о моделях, Presenter является единственным связующим звеном
- **Переиспользуемость компонентов**: View могут использоваться в любом контексте при наличии `EventEmitter`

### 🔹 События моделей

События генерируются в моделях, наследующих `EventEmitter`. Презентер подписывается на эти события для синхронизации UI.

#### Каталог товаров (`Catalog`)

| Событие                   | Payload                        | Описание                                         | Источник                      |
| :------------------------ | :----------------------------- | :----------------------------------------------- | :---------------------------- |
| `catalog:update`          | `{ products: Product[] }`      | Загружен/обновлён список товаров в каталоге      | `setProducts(products)`       |
| `catalog:selected-change` | `{ product: Product \| null }` | Изменён выбранный товар для детального просмотра | `setSelectedProduct(product)` |

**Пример подписки:**

```typescript
catalog.on<CatalogUpdateEvent>("catalog:update", ({ products }) => {
  // Обновить галерею товаров
  const cards = products.map(
    (p) => new CatalogCardView(template.cloneNode(true)),
  );
  galleryView.items = cards.map((c) => c.render());
});
```

#### Корзина покупок (`Cart`)

| Событие       | Payload                | Описание                  | Источник              |
| :------------ | :--------------------- | :------------------------ | :-------------------- |
| `cart:add`    | `{ product: Product }` | Товар добавлен в корзину  | `addItem(product)`    |
| `cart:remove` | `{ product: Product }` | Товар удалён из корзины   | `removeItem(product)` |
| `cart:clear`  | `{ items: Product[] }` | Корзина полностью очищена | `clear()`             |

**Пример подписки:**

```typescript
cart.on<CartAddEvent>("cart:add", ({ product }) => {
  // Обновить счётчик в шапке
  headerView.counter = cart.getItemCount();
  // Обновить карточку товара в превью
  previewView.inCart = true;
});
```

#### Данные покупателя (`CustomerData`)

| Событие           | Payload              | Описание                                            | Источник         |
| :---------------- | :------------------- | :-------------------------------------------------- | :--------------- |
| `customer:update` | `{ data: Customer }` | Обновлены данные покупателя (оплата/адрес/контакты) | `update(fields)` |
| `customer:clear`  | `{ data: Customer }` | Данные покупателя сброшены к пустым значениям       | `clear()`        |

**Пример подписки:**

```typescript
customerData.on<CustomerUpdateEvent>("customer:update", ({ data }) => {
  // Синхронизировать данные с формами
  orderFormView.payment = data.payment;
  orderFormView.address = data.address;
});
```

### 🔹 События представлений

Представления **генерируют события** через `EventEmitter`, переданный в конструктор. События имеют именованный формат `namespace:event-name`.

| Представление      | Событие                                            | Payload                         | Когда генерируется                    |
| :----------------- | :------------------------------------------------- | :------------------------------ | :------------------------------------ |
| `HeaderView`       | `header:basket-click`                              | -                               | Клик по иконке корзины в шапке        |
| `CatalogCardView`  | `card:select`                                      | `{ id: string }`                | Клик по карточке товара               |
| `PreviewCardView`  | `preview:add-to-cart` / `preview:remove-from-cart` | `{ id: string }`                | Клик кнопки "В корзину" / "Удалить"   |
| `BasketCardView`   | `basket-card:delete`                               | `{ id: string }`                | Клик "Удалить" у товара в корзине     |
| `BasketView`       | `basket:checkout`                                  | -                               | Клик "Оформить заказ"                 |
| `OrderFormView`    | `order:payment-change`                             | `{ payment: "card" \| "cash" }` | Выбор способа оплаты                  |
| `OrderFormView`    | `order:address-input`                              | `{ address: string }`           | Ввод адреса                           |
| `OrderFormView`    | `order:submit`                                     | -                               | Отправка формы адреса                 |
| `ContactsFormView` | `contacts:email-input`                             | `{ email: string }`             | Ввод email                            |
| `ContactsFormView` | `contacts:phone-input`                             | `{ phone: string }`             | Ввод телефона                         |
| `ContactsFormView` | `contacts:submit`                                  | -                               | Отправка формы контактов              |
| `OrderSuccessView` | `success:reset`                                    | -                               | Клик "Закрыть" после успешного заказа |
| `ModalView`        | `modal:open` / `modal:close`                       | -                               | Открытие / закрытие модального окна   |

### 🔹 Поток событий при оформлении заказа

```mermaid
graph TD
    A[Клик по корзине] --> B[header:basket-click событие]
    B --> C[Presenter обработчик]
    C --> D[updateBasketUI]
    D --> E[modal.open basketView]
    E --> F[Клик Оформить]
    F --> G[basket:checkout событие]
    G --> H[Presenter обработчик]
    H --> I[modal.open orderForm]
    I --> J[Ввод оплаты/адреса]
    J --> K[order:payment-change / order:address-input]
    K --> L[customerData.update]
    L --> M[customer:update событие]
    M --> N[Обновление форм через render]
    N --> O[Кнопка Далее]
    O --> P[order:submit событие]
    P --> Q[Presenter обработчик]
    Q --> R[modal.open contactsForm]
    R --> S[Ввод контактов]
    S --> T[contacts:email-input / contacts:phone-input]
    T --> U[customerData.update]
    U --> V[Кнопка Заказать]
    V --> W[contacts:submit событие]
    W --> X[Presenter: LarekApi.postOrder]
    X --> Y{Ответ сервера}
    Y -->|Успех| Z[successView.render + modal.open]
    Y -->|Ошибка| AA[contactsForm.render errors]
    Z --> AB[Клик Закрыть]
    AB --> AC[success:reset событие]
    AC --> AD[modal.close]
    AD --> AE[cart.clear + customerData.clear]
    AE --> AF[cart:clear + customer:clear события]
    AF --> AG[Обновление UI через подписки]
```

---

## 🎛 Презентер (`src/main.ts`)

Презентер — это **Composition Root** приложения. Содержит всю бизнес-логику и отвечает за связь моделей и представлений. Код презентера размещён в основном скрипте `main.ts` без выноса в отдельный класс.

### 🔹 Принципы работы

1. **Не генерирует события** — только обрабатывает события от моделей и представлений.
2. **Callback Injection** — передаёт обработчики в представления через сеттеры `on*`.
3. **Централизованная логика** — вся навигация и взаимодействие сосредоточены в одном месте.

### 🔹 Обработчики событий моделей

| Событие модели            | Обработчик                                   | Действия презентера                                                                                                                                                                                                                                     |
| :------------------------ | :------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `catalog:update`          | `catalog.on('catalog:update', ...)`          | 1. Получает массив товаров через `catalog.getProducts()`<br>2. Создаёт `CatalogCardView` для каждого товара<br>3. Навешивает `onSelect = () => catalog.setSelectedProduct(product)`<br>4. Рендерит галерею через `galleryView.render({ items: [...] })` |
| `catalog:selected-change` | `catalog.on('catalog:selected-change', ...)` | 1. Рендерит `previewCard` с данными товара<br>2. Проверяет наличие в корзине через `cart.hasItem()`<br>3. Навешивает `onAddToCart` или `onRemoveFromCart`<br>4. Открывает модалку с превью через `modal.open(previewCard)`                              |
| `cart:add`                | `cart.on('cart:add', ...)`                   | 1. Обновляет счётчик в шапке `header.counter`<br>2. Перерисовывает корзину `updateBasketUI()`<br>3. Если товар открыт в превью — обновляет состояние кнопки                                                                                             |
| `cart:remove`             | `cart.on('cart:remove', ...)`                | 1. Обновляет счётчик в шапке<br>2. Перерисовывает корзину<br>3. Если товар открыт в превью — меняет кнопку на "В корзину"                                                                                                                               |
| `cart:clear`              | `cart.on('cart:clear', ...)`                 | 1. Сбрасывает счётчик в 0<br>2. Перерисовывает корзину<br>3. Сбрасывает состояние кнопки в превью                                                                                                                                                       |
| `customer:update`         | `customerData.on('customer:update', ...)`    | Синхронизирует данные в формах `orderForm` и `contactsForm`                                                                                                                                                                                             |

### 🔹 Обработчики событий представлений

| Представление      | Событие                    | Действия презентера                                                                                                                                                      |
| :----------------- | :------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `HeaderView`       | `header:basket-click`      | 1. Вызывает `updateBasketUI()`<br>2. Открывает корзину `modal.open(basketView)`                                                                                          |
| `BasketView`       | `basket:checkout`          | 1. Открывает форму заказа `modal.open(orderForm)` (данные не сбрасываются)                                                                                               |
| `OrderFormView`    | `order:payment-change`     | Обновляет модель `customerData.update({ payment })` → автоматически обновляется форма через `customer:update`                                                            |
| `OrderFormView`    | `order:address-input`      | Обновляет модель `customerData.update({ address })` → автоматически обновляется форма через `customer:update`                                                            |
| `OrderFormView`    | `order:submit`             | Открывает форму контактов `modal.open(contactsForm)`                                                                                                                     |
| `ContactsFormView` | `contacts:email-input`     | Обновляет модель `customerData.update({ email })` → автоматически обновляется форма через `customer:update`                                                              |
| `ContactsFormView` | `contacts:phone-input`     | Обновляет модель `customerData.update({ phone })` → автоматически обновляется форма через `customer:update`                                                              |
| `ContactsFormView` | `contacts:submit`          | 1. Отправляет заказ через `LarekApi.postOrder()`<br>2. При успехе: `modal.open(successView)`, `cart.clear()`, `customerData.clear()`<br>3. При ошибке: показывает ошибку |
| `OrderSuccessView` | `success:reset`            | 1. Закрывает модалку `modal.close()` (без очистки данных)                                                                                                                |
| `CatalogCardView`  | `card:select`              | Вызывает `catalog.setSelectedProduct(product)` по ID                                                                                                                     |
| `PreviewCardView`  | `preview:add-to-cart`      | Вызывает `cart.addItem(product)` по ID                                                                                                                                   |
| `PreviewCardView`  | `preview:remove-from-cart` | Вызывает `cart.removeItem(product)` по ID                                                                                                                                |
| `BasketCardView`   | `basket-card:delete`       | Вызывает `cart.removeItem(product)` по ID                                                                                                                                |

### 🔹 Инициализация приложения

```typescript
// 1. Создание моделей и шины событий
const catalog = new Catalog();
const cart = new Cart();
const customerData = new CustomerData();
const events = new EventEmitter();

// 2. Создание представлений (с передачей events в конструктор)
const galleryView = new GalleryView(galleryEl);
const modal = new ModalView(modalContainer, events);
const header = new HeaderView(headerEl, events);
const previewCard = new PreviewCardView(
  previewTemplate.content.cloneNode(true),
  events,
);
const basketView = new BasketView(
  basketTemplate.content.cloneNode(true),
  events,
);
// ... и другие

// 3. Подписка на события моделей
catalog.on("catalog:update", handler);
cart.on("cart:add", handler);
// ...

// 4. Подписка на события представлений
events.on("header:basket-click", handler);
events.on("card:select", handler);
// ...

// 5. Начальная загрузка данных
larekApi.getProducts().then((data) => {
  catalog.setProducts(data.items); // Запускает событие catalog:update
});
```

### 🔹 Логика оформления заказа

```mermaid
sequenceDiagram
    participant U as User
    participant V as View
    participant P as Presenter
    participant M as Model
    participant A as API

    U->>V: Кликает Оформить
    V->>P: onCheckout callback
    P->>M: customerData.clear()
    P->>V: modal.open(orderForm)

    U->>V: Вводит оплату/адрес
    V->>P: onPaymentChange/onAddressInput
    P->>M: customerData.update(fields)
    M-->>P: customer:update event
    P->>V: Перерисовка формы

    U->>V: Кликает Далее
    V->>P: onSubmit (шаг 1)
    P->>M: validate()
    M-->>P: errors
    P->>V: modal.open(contactsForm)

    U->>V: Вводит email/телефон
    V->>P: onEmailInput/onPhoneInput
    P->>M: customerData.update(fields)

    U->>V: Кликает Заказать
    V->>P: onSubmit (шаг 2)
    P->>M: validate()
    M-->>P: errors
    P->>A: postOrder({ ...customerData, total, items })
    A-->>P: OrderResult
    P->>V: modal.open(successView)

    U->>V: Кликает Закрыть
    V->>P: onReset
    P->>V: modal.close()
    P->>M: cart.clear()
    P->>M: customerData.clear()
    M-->>P: cart:clear event
    P->>V: Обновление UI
```

### 🔹 Ключевые методы презентера

| Метод                   | Описание                                                                                                      |
| :---------------------- | :------------------------------------------------------------------------------------------------------------ |
| `updateBasketUI()`      | Пересоздаёт все `BasketCardView` на основе данных из корзины, обновляет счётчик и состояние кнопки "Оформить" |
| `header.counter = N`    | Устанавливает значение счётчика товаров в шапке                                                               |
| `modal.open(component)` | Открывает модальное окно с переданным компонентом, эмитит `modal:open`                                        |
| `modal.close()`         | Закрывает модальное окно, эмитит `modal:close`                                                                |

### 🔹 Зависимости

Презентер использует:

- **Модели:** `Catalog`, `Cart`, `CustomerData`, `LarekApi`
- **Представления:** Все View-компоненты (GalleryView, ModalView, HeaderView, PreviewCardView, BasketView, OrderFormView, ContactsFormView, OrderSuccessView, CatalogCardView, BasketCardView)
- **API:** `Api` для HTTP-запросов
- **Константы:** `API_URL` для настройки бэкенда

## 💡 Ключевые архитектурные решения

1. **Event-Driven архитектура** — все взаимодействия между слоями происходят через единую шину событий (`EventEmitter`). View генерируют именованные события, Presenter обрабатывает их и вызывает методы моделей.
2. **Наследование базовых классов** — `Card<T>` и `Form<T>` выносят общую логику (поля `id`, `title`, `price`, `errors`, `valid`), что уменьшает дублирование кода в дочерних классах.
3. **Декларативный рендеринг** — `Component.render(data)` использует `Object.assign`, автоматически вызывая сеттеры. Код презентера остаётся чистым: `view.render({ title, price, valid })`.
4. **Валидация через модель** — валидация происходит в момент изменения данных (`customerData.update()`), результат синхронизируется с UI через событие `customer:update`. Кнопка отправки блокируется автоматически через сеттер `valid`.
5. **Dependency Injection для API** — `LarekApi` принимает интерфейс `IApi`, что позволяет легко подменять транспорт в тестах или при изменении backend.
6. **Централизованный Composition Root** — вся инициализация, подписка на события и логика навигации вынесена в `main.ts`, что упрощает рефакторинг и тестирование.
7. **Очистка данных после успешного заказа** — модели очищаются только после успешного ответа сервера (в `.then()`), а не при закрытии окна успеха.
8. **Сохранение данных форм** — при переходе между шагами оформления заказа данные не сбрасываются, пользователь может вернуться к предыдущему шагу без потери введённой информации.

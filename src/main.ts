import "./scss/styles.scss";
import { Catalog, Cart, CustomerData, LarekApi } from "./components/Models";
import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { API_URL } from "./utils/constants";
import {
  GalleryView,
  CatalogCardView,
  PreviewCardView,
  BasketView,
  BasketCardView,
  OrderFormView,
  ContactsFormView,
  OrderSuccessView,
  ModalView,
  HeaderView,
} from "./components/Views";
import type { Product, Customer } from "./types";

// ==========================================
// 1. Модели и события
// ==========================================
export const catalog = new Catalog();
export const cart = new Cart();
export const customerData = new CustomerData();
const events = new EventEmitter();

// ==========================================
// 2. Инициализация DOM и Представлений
// ==========================================
const galleryEl = document.querySelector("main.gallery") as HTMLElement;
if (!galleryEl) throw new Error("Элемент main.gallery не найден");
const galleryView = new GalleryView(galleryEl);

const modalContainer = document.getElementById(
  "modal-container",
) as HTMLElement;
if (!modalContainer) throw new Error("Контейнер модальных окон не найден");
const modal = new ModalView(modalContainer, events);

events.on("modal:open", () => document.body.classList.add("modal_open"));
events.on("modal:close", () => document.body.classList.remove("modal_open"));

const headerEl = document.querySelector(".header") as HTMLElement;
const header = new HeaderView(headerEl, events);

// Клонируем шаблоны
const previewTemplate = document.getElementById(
  "card-preview",
) as HTMLTemplateElement;
const basketTemplate = document.getElementById("basket") as HTMLTemplateElement;
const orderTemplate = document.getElementById("order") as HTMLTemplateElement;
const contactsTemplate = document.getElementById(
  "contacts",
) as HTMLTemplateElement;
const successTemplate = document.getElementById(
  "success",
) as HTMLTemplateElement;

// Создаем представления
const previewCard = new PreviewCardView(
  previewTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement,
  events,
);
const basketView = new BasketView(
  basketTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement,
  events,
);
const orderForm = new OrderFormView(
  orderTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement,
  events,
);
const contactsForm = new ContactsFormView(
  contactsTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement,
  events,
);
const successView = new OrderSuccessView(
  successTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement,
  events,
);

// ==========================================
// 3. События от Представлений (Presenter)
// ==========================================
events.on("header:basket-click", () => {
  updateBasketUI();
  modal.open(basketView);
});

events.on("basket:checkout", () => {
  modal.open(orderForm);
  const { errors } = customerData.validate();
  orderForm.render({
    ...customerData.getData(),
    valid: !errors.payment && !errors.address,
  });
});

events.on("success:reset", () => {
  modal.close();
});

events.on(
  "order:payment-change",
  ({ payment }: { payment: "card" | "cash" }) => {
    customerData.update({ payment });
  },
);

events.on("order:address-input", ({ address }: { address: string }) => {
  customerData.update({ address });
});

events.on("order:submit", () => {
  modal.open(contactsForm);
  const { errors } = customerData.validate();
  contactsForm.render({
    ...customerData.getData(),
    valid: !errors.email && !errors.phone,
  });
});

events.on("contacts:email-input", ({ email }: { email: string }) => {
  customerData.update({ email });
});

events.on("contacts:phone-input", ({ phone }: { phone: string }) => {
  customerData.update({ phone });
});

events.on("contacts:submit", () => {
  const larekApi = new LarekApi(new Api(API_URL));
  larekApi
    .postOrder({
      ...customerData.getData(),
      total: cart.getTotalPrice(),
      items: cart.getItems().map((item) => item.id),
    })
    .then((res) => {
      successView.render({ total: res.total });
      modal.open(successView);
      cart.clear();
      customerData.clear();
      header.counter = 0;
    })
    .catch((err) => {
      console.error("Ошибка оформления заказа:", err);
      contactsForm.render({
        ...customerData.getData(),
        errors: "Произошла ошибка при оформлении заказа",
      });
    });
});

events.on("card:select", ({ id }: { id: string }) => {
  const product = catalog.getProducts().find((p) => p.id === id);
  if (product) {
    catalog.setSelectedProduct(product);
  }
});

events.on("preview:add-to-cart", ({ id }: { id: string }) => {
  const product = catalog.getProducts().find((p) => p.id === id);
  if (product) {
    cart.addItem(product);
  }
});

events.on("preview:remove-from-cart", ({ id }: { id: string }) => {
  const product = cart.getItems().find((p) => p.id === id);
  if (product) {
    cart.removeItem(product);
  }
});

events.on("basket-card:delete", ({ id }: { id: string }) => {
  const product = cart.getItems().find((p) => p.id === id);
  if (product) {
    cart.removeItem(product);
  }
});

// ==========================================
// 4. Подписка на события моделей
// ==========================================
catalog.on("catalog:update", () => {
  const cardElements = catalog.getProducts().map((product) => {
    const template = document.getElementById(
      "card-catalog",
    ) as HTMLTemplateElement;
    const cardEl = template.content.firstElementChild?.cloneNode(
      true,
    ) as HTMLElement;
    const cardView = new CatalogCardView(cardEl, events);
    cardView.render(product);
    return cardEl;
  });
  galleryView.render({ items: cardElements });
});

catalog.on(
  "catalog:selected-change",
  ({ product }: { product: Product | null }) => {
    if (product) {
      previewCard.render(product);
      previewCard.inCart = cart.hasItem(product.id);
      modal.open(previewCard);
    }
  },
);

const updateBasketUI = () => {
  const basketItems = cart.getItems().map((item, index) => {
    const template = document.getElementById(
      "card-basket",
    ) as HTMLTemplateElement;
    const cardEl = template.content.firstElementChild?.cloneNode(
      true,
    ) as HTMLElement;
    const basketCard = new BasketCardView(cardEl, events);
    basketCard.render({
      ...item,
      index: index + 1,
      price: item.price ?? undefined,
    });
    return cardEl;
  });

  basketView.render({
    items: basketItems,
    total: cart.getTotalPrice(),
    canCheckout: cart.getItemCount() > 0,
  });
};

cart.on("cart:add", ({ product }: { product: Product }) => {
  header.counter = cart.getItemCount();
  updateBasketUI();
  const selectedProduct = catalog.getSelectedProduct();
  if (selectedProduct && selectedProduct.id === product.id) {
    previewCard.inCart = true;
  }
});

cart.on("cart:remove", ({ product }: { product: Product }) => {
  header.counter = cart.getItemCount();
  updateBasketUI();
  const selectedProduct = catalog.getSelectedProduct();
  if (selectedProduct && selectedProduct.id === product.id) {
    previewCard.inCart = false;
  }
});

cart.on("cart:clear", () => {
  header.counter = 0;
  updateBasketUI();
  const selectedProduct = catalog.getSelectedProduct();
  if (selectedProduct) {
    previewCard.inCart = false;
  }
});

customerData.on("customer:update", ({ data }: { data: Customer }) => {
  const { errors } = customerData.validate();
  orderForm.render({
    ...data,
    valid: !errors.payment && !errors.address,
  });
  contactsForm.render({
    ...data,
    valid: !errors.email && !errors.phone,
  });
});

customerData.on("customer:clear", () => {
  orderForm.render({
    payment: "",
    address: "",
    email: "",
    phone: "",
    valid: false,
  });
  contactsForm.render({
    payment: "",
    address: "",
    email: "",
    phone: "",
    valid: false,
  });
});

// ==========================================
// 5. Начальная загрузка
// ==========================================
header.counter = cart.getItemCount();
const larekApi = new LarekApi(new Api(API_URL));

larekApi
  .getProducts()
  .then((data) => catalog.setProducts(data.items))
  .catch((err) => console.error("Ошибка загрузки каталога:", err));

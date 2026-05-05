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
const modal = new ModalView(modalContainer, {
  onOpen: () => document.body.classList.add("modal_open"),
  onClose: () => document.body.classList.remove("modal_open"),
});

const headerEl = document.querySelector(".header") as HTMLElement;
const header = new HeaderView(headerEl, {
  onBasketClick: () => events.emit("header:basket-click"),
});

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
  {
    onAction: () => {
      const product = catalog.getSelectedProduct();
      if (product) {
        if (cart.hasItem(product.id)) {
          cart.removeItem(product);
        } else {
          cart.addItem(product);
        }
      }
    },
  },
);
const basketView = new BasketView(
  basketTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement,
  {
    onCheckout: () => events.emit("basket:checkout"),
  },
);
const orderForm = new OrderFormView(
  orderTemplate.content.firstElementChild?.cloneNode(true) as HTMLFormElement,
  events,
);
const contactsForm = new ContactsFormView(
  contactsTemplate.content.firstElementChild?.cloneNode(
    true,
  ) as HTMLFormElement,
  events,
);
const successView = new OrderSuccessView(
  successTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement,
  {
    onClose: () => events.emit("success:reset"),
  },
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
  const orderErrors = [errors.payment, errors.address]
    .filter(Boolean)
    .join("; ");
  orderForm.render({
    ...customerData.getData(),
    errors: orderErrors,
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
  const contactsErrors = [errors.email, errors.phone]
    .filter(Boolean)
    .join("; ");
  contactsForm.render({
    ...customerData.getData(),
    errors: contactsErrors,
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
    const cardView = new CatalogCardView(cardEl, {
      onSelect: () => events.emit("card:select", { id: product.id }),
    });
    cardView.render(product);
    return cardEl;
  });
  galleryView.render({ items: cardElements });
});

catalog.on(
  "catalog:selected-change",
  ({ product }: { product: Product | null }) => {
    if (product) {
      previewCard.render({ ...product, inCart: cart.hasItem(product.id) });
      modal.open(previewCard);
    }
  },
);

const updateBasketUI = () => {
  const basketItems = cart.getItems().map((item) => {
    const template = document.getElementById(
      "card-basket",
    ) as HTMLTemplateElement;
    const cardEl = template.content.firstElementChild?.cloneNode(
      true,
    ) as HTMLElement;
    const basketCard = new BasketCardView(cardEl, {
      onDelete: () => events.emit("basket-card:delete", { id: item.id }),
    });
    basketCard.render({
      ...item,
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
  header.counter = cart.getItemCount();
  updateBasketUI();
  const selectedProduct = catalog.getSelectedProduct();
  if (selectedProduct) {
    previewCard.inCart = false;
  }
});

customerData.on("customer:update", ({ data }: { data: Customer }) => {
  const { errors } = customerData.validate();

  const orderErrors = [errors.payment, errors.address]
    .filter(Boolean)
    .join("; ");

  const contactsErrors = [errors.email, errors.phone]
    .filter(Boolean)
    .join("; ");

  orderForm.render({
    ...data,
    errors: orderErrors,
    valid: !errors.payment && !errors.address,
  });
  contactsForm.render({
    ...data,
    errors: contactsErrors,
    valid: !errors.email && !errors.phone,
  });
});

customerData.on("customer:clear", () => {
  const { errors } = customerData.validate();
  const data = customerData.getData();

  const orderErrors = [errors.payment, errors.address]
    .filter(Boolean)
    .join("; ");

  const contactsErrors = [errors.email, errors.phone]
    .filter(Boolean)
    .join("; ");

  orderForm.render({
    ...data,
    errors: orderErrors,
    valid: !errors.payment && !errors.address,
  });
  contactsForm.render({
    ...data,
    errors: contactsErrors,
    valid: !errors.email && !errors.phone,
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

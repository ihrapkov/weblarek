import "./scss/styles.scss";
import { Catalog, Cart, CustomerData, LarekApi } from "./components/Models";
import { Api } from "./components/base/Api";
import { API_URL, CDN_URL } from "./utils/constants";
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

// ==========================================
// 1. Модели
// ==========================================
export const catalog = new Catalog();
export const cart = new Cart();
export const customerData = new CustomerData();

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
const modal = new ModalView(modalContainer);

const headerEl = document.querySelector(".header") as HTMLElement;
const header = new HeaderView(headerEl);

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
);
const basketView = new BasketView(
  basketTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement,
);
const orderForm = new OrderFormView(
  orderTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement,
);
const contactsForm = new ContactsFormView(
  contactsTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement,
);
const successView = new OrderSuccessView(
  successTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement,
);

// ==========================================
// 3. Привязка событий через СЕТТЕРЫ
// ==========================================
header.onBasketClick = () => modal.open(basketView);

basketView.onCheckout = () => modal.open(orderForm);
successView.onReset = () => {
  modal.close();
  cart.clear();
};

// Формы заказа
orderForm.onPaymentChange = (payment) => {
  customerData.update({ payment });
  orderForm.render({ valid: customerData.validate().isValid });
};
orderForm.onAddressInput = (address) => {
  customerData.update({ address });
  orderForm.render({ valid: customerData.validate().isValid });
};
orderForm.onSubmit = () => {
  const validation = customerData.validate();
  if (validation.isValid) modal.open(contactsForm);
  else
    orderForm.render({ errors: Object.values(validation.errors).join("; ") });
};

contactsForm.onEmailInput = (email) => {
  customerData.update({ email });
  contactsForm.render({ valid: customerData.validate().isValid });
};
contactsForm.onPhoneInput = (phone) => {
  customerData.update({ phone });
  contactsForm.render({ valid: customerData.validate().isValid });
};
contactsForm.onSubmit = () => {
  const validation = customerData.validate();
  if (validation.isValid) {
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
      })
      .catch((err) => {
        console.error("Ошибка оформления заказа:", err);
        contactsForm.render({
          errors: "Произошла ошибка при оформлении заказа",
        });
      });
  } else {
    contactsForm.render({
      errors: Object.values(validation.errors).join("; "),
    });
  }
};

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

    const cardView = new CatalogCardView(cardEl);
    cardView.onSelect = () => catalog.setSelectedProduct(product);

    cardView.render(product);
    return cardEl;
  });
  galleryView.render({ items: cardElements });
});

catalog.on("catalog:selected-change", ({ product }) => {
  if (product) {
    previewCard.render(product);
    previewCard.inCart = cart.hasItem(product.id);
    if (cart.hasItem(product.id)) {
      previewCard.onRemoveFromCart = () => {
        cart.removeItem(product);
      };
    } else {
      previewCard.onAddToCart = () => {
        cart.addItem(product);
      };
    }
    modal.open(previewCard);
  }
});

const updateBasketUI = () => {
  const basketItems = cart.getItems().map((item, index) => {
    const template = document.getElementById(
      "card-basket",
    ) as HTMLTemplateElement;
    const cardEl = template.content.firstElementChild?.cloneNode(
      true,
    ) as HTMLElement;

    const basketCard = new BasketCardView(cardEl);
    basketCard.onDelete = () => {
      const product = cart.getItems().find((p) => p.id === item.id);
      if (product) {
        cart.removeItem(product);
      }
    };

    basketCard.render({ ...item, index: index + 1 });
    return cardEl;
  });

  basketView.render({
    items: basketItems,
    total: cart.getTotalPrice(),
    canCheckout: cart.getItemCount() > 0,
  });
};

cart.on("cart:add", (data) => {
  header.counter = cart.getItemCount();
  updateBasketUI();
  const selectedProduct = catalog.getSelectedProduct();
  if (selectedProduct && selectedProduct.id === data.product.id) {
    previewCard.inCart = true;
    previewCard.onRemoveFromCart = () => {
      cart.removeItem(data.product);
    };
  }
});

cart.on("cart:remove", (data) => {
  header.counter = cart.getItemCount();
  updateBasketUI();
  const selectedProduct = catalog.getSelectedProduct();
  if (selectedProduct && selectedProduct.id === data.product.id) {
    previewCard.inCart = false;
    previewCard.onAddToCart = () => {
      cart.addItem(data.product);
    };
  }
});

cart.on("cart:clear", (data) => {
  header.counter = 0;
  updateBasketUI();
  const selectedProduct = catalog.getSelectedProduct();
  if (selectedProduct) {
    previewCard.inCart = false;
    previewCard.onAddToCart = () => {
      cart.addItem(selectedProduct);
    };
  }
});

customerData.on("customer:update", ({ data }) => {
  orderForm.render(data);
  contactsForm.render(data);
});

// ==========================================
// 5. Начальная загрузка
// ==========================================
header.counter = cart.getItemCount();

const larekApi = new LarekApi(new Api(API_URL));
larekApi
  .getProducts()
  .then((products) => {
    catalog.setProducts(products);
    // Инициализация состояния кнопки для корзины
    const selectedProduct = catalog.getSelectedProduct();
    if (selectedProduct) {
      previewCard.inCart = cart.hasItem(selectedProduct.id);
      if (cart.hasItem(selectedProduct.id)) {
        previewCard.onRemoveFromCart = () => {
          cart.removeItem(selectedProduct);
        };
      } else {
        previewCard.onAddToCart = () => {
          cart.addItem(selectedProduct);
        };
      }
    }
  })
  .catch((err) => console.error("Ошибка загрузки каталога:", err));

import "./scss/styles.scss";
import { Catalog, Cart, CustomerData, LarekApi } from "./components/Models";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { apiProducts } from "./utils/data";

export const catalog = new Catalog();
export const cart = new Cart();
export const customerData = new CustomerData();

// ==========================================
// Тестирование модели Catalog
// ==========================================
console.log("=== Catalog ===");

// setProducts / getProducts
catalog.setProducts(apiProducts.items);
console.log("catalog.getProducts() — все товары:", catalog.getProducts());

// getProductById
const firstProduct = catalog.getProductById(
  "854cef69-976d-4c2a-a18c-2aa45046c390",
);
console.log("catalog.getProductById() — первый товар:", firstProduct);

const nonexistent = catalog.getProductById("nonexistent-id");
console.log("catalog.getProductById() — несуществующий ID:", nonexistent);

// setSelectedProduct / getSelectedProduct
if (firstProduct) {
  catalog.setSelectedProduct(firstProduct);
  console.log(
    "catalog.getSelectedProduct() — выбранный товар:",
    catalog.getSelectedProduct(),
  );
}

catalog.setSelectedProduct(null);
console.log(
  "catalog.getSelectedProduct() после сброса:",
  catalog.getSelectedProduct(),
);

// ==========================================
// Тестирование модели Cart
// ==========================================
console.log("\n=== Cart ===");

console.log("cart.getItems() — пустая корзина:", cart.getItems());
console.log("cart.getItemCount() — количество:", cart.getItemCount());
console.log("cart.getTotalPrice() — сумма:", cart.getTotalPrice());

// addItem
if (firstProduct) {
  cart.addItem(firstProduct);
  console.log("cart.addItem() — добавлен первый товар");
}
const secondProduct = catalog.getProductById(
  "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
);
if (secondProduct) {
  cart.addItem(secondProduct);
  console.log("cart.addItem() — добавлен второй товар");
}

console.log("cart.getItems() — товары в корзине:", cart.getItems());
console.log("cart.getItemCount() — количество:", cart.getItemCount());
console.log("cart.getTotalPrice() — сумма:", cart.getTotalPrice());

// hasItem
console.log(
  'cart.hasItem("854cef69...") — есть в корзине:',
  cart.hasItem("854cef69-976d-4c2a-a18c-2aa45046c390"),
);
console.log(
  'cart.hasItem("nonexistent") — есть в корзине:',
  cart.hasItem("nonexistent-id"),
);

// removeItem
if (firstProduct) {
  cart.removeItem(firstProduct);
  console.log("cart.removeItem() — удалён первый товар");
}
console.log("cart.getItems() после удаления:", cart.getItems());
console.log("cart.getItemCount() после удаления:", cart.getItemCount());
console.log("cart.getTotalPrice() после удаления:", cart.getTotalPrice());

// clear
cart.clear();
console.log("cart.clear() — корзина очищена:", cart.getItems());

// ==========================================
// Тестирование модели CustomerData
// ==========================================
console.log("\n=== CustomerData ===");

console.log("customerData.getData() — пустые данные:", customerData.getData());

// validate — пустые данные
console.log(
  "customerData.validate() — пустые данные:",
  customerData.validate(),
);

// update
customerData.update({ payment: "card" });
customerData.update({ address: "г. Москва, ул. Примерная, д. 1" });
customerData.update({ email: "test@example.com" });
customerData.update({ phone: "+79001234567" });
console.log(
  "customerData.getData() — заполненные данные:",
  customerData.getData(),
);

// validate — заполненные данные
console.log(
  "customerData.validate() — заполненные данные:",
  customerData.validate(),
);

// validate — частично заполненные (проверка ошибок)
customerData.update({ email: "" });
console.log("customerData.validate() — пустой email:", customerData.validate());

// clear
customerData.clear();
console.log("customerData.clear() — данные очищены:", customerData.getData());

// ==========================================
// Тестирование LarekApi — запрос товаров с сервера
// ==========================================
console.log("\n=== LarekApi ===");

const api = new Api(API_URL);
const larekApi = new LarekApi(api);

larekApi.getProducts().then((products) => {
  console.log("larekApi.getProducts() — товары с сервера:", products);

  // Сохраняем полученные товары в модель каталога
  catalog.setProducts(products);
  console.log(
    "catalog.getProducts() — сохранённый каталог из сервера:",
    catalog.getProducts(),
  );
});

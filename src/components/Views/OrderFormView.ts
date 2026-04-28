import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import type { Customer } from "../../types";

export interface OrderFormViewData extends Partial<Customer> {
  errors?: string;
  valid?: boolean;
}

export class OrderFormView extends Component<OrderFormViewData> {
  protected _paymentCard: HTMLButtonElement;
  protected _paymentCash: HTMLButtonElement;
  protected _address: HTMLInputElement;
  protected _errors: HTMLElement;
  protected _submitBtn: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    // Точные селекторы под ваш <template id="order">
    this._paymentCard = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.container,
    );
    this._paymentCash = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.container,
    );
    this._address = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container,
    );
    this._errors = ensureElement<HTMLElement>(".form__errors", this.container);
    this._submitBtn = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container,
    );
  }

  set payment(value: "card" | "cash" | "") {
    if (value === "card") {
      this._paymentCard.classList.add("button_alt-active");
      this._paymentCash.classList.remove("button_alt-active");
    } else if (value === "cash") {
      this._paymentCash.classList.add("button_alt-active");
      this._paymentCard.classList.remove("button_alt-active");
    } else {
      this._paymentCard.classList.remove("button_alt-active");
      this._paymentCash.classList.remove("button_alt-active");
    }
  }

  set address(value: string) {
    this._address.value = value;
  }

  set errors(value: string) {
    this._errors.textContent = value || "";
  }

  set valid(value: boolean) {
    this._submitBtn.disabled = !value;
  }

  set onPaymentChange(callback: (value: "card" | "cash") => void) {
    this._paymentCard.addEventListener("click", () => {
      this.payment = "card";
      callback("card");
    });
    this._paymentCash.addEventListener("click", () => {
      this.payment = "cash";
      callback("cash");
    });
  }

  set onAddressInput(callback: (value: string) => void) {
    this._address.addEventListener("input", (e) =>
      callback((e.target as HTMLInputElement).value),
    );
  }

  set onSubmit(callback: () => void) {
    this._submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      callback();
    });
  }

  override render(data?: Partial<OrderFormViewData>): HTMLElement {
    super.render(data); // Автоматически вызовет set payment, address, errors, valid
    return this.container;
  }
}

import { Form } from "./Form";
import { ensureElement } from "../../utils/utils";
import type { Customer } from "../../types";
import type { IEvents } from "../base/Events";

export interface OrderFormViewData extends Partial<Customer> {
  errors?: string;
  valid?: boolean;
}

export class OrderFormView extends Form<OrderFormViewData> {
  protected _paymentCard: HTMLButtonElement;
  protected _paymentCash: HTMLButtonElement;
  protected _address: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
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

    this._paymentCard.addEventListener("click", () =>
      this.events.emit("order:payment-change", { payment: "card" }),
    );
    this._paymentCash.addEventListener("click", () =>
      this.events.emit("order:payment-change", { payment: "cash" }),
    );
    this._address.addEventListener("input", (e) =>
      this.events.emit("order:address-input", {
        address: (e.target as HTMLInputElement).value,
      }),
    );
    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit("order:submit");
    });
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
}

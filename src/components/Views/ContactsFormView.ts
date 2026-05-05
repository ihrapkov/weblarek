import { Form } from "./Form";
import { ensureElement } from "../../utils/utils";
import type { Customer } from "../../types";
import type { IEvents } from "../base/Events";

export interface ContactsFormViewData extends Partial<Customer> {
  errors?: string;
  valid?: boolean;
}

export class ContactsFormView extends Form<ContactsFormViewData> {
  protected _email: HTMLInputElement;
  protected _phone: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this._email = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container,
    );
    this._phone = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container,
    );

    this._email.addEventListener("input", (e) =>
      this.events.emit("contacts:email-input", {
        email: (e.target as HTMLInputElement).value,
      }),
    );
    this._phone.addEventListener("input", (e) =>
      this.events.emit("contacts:phone-input", {
        phone: (e.target as HTMLInputElement).value,
      }),
    );
    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit("contacts:submit");
    });
  }

  set email(value: string) {
    this._email.value = value;
  }

  set phone(value: string) {
    this._phone.value = value;
  }
}

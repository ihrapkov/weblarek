import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import type { Customer } from "../../types";

export interface ContactsFormViewData extends Partial<Customer> {
  errors?: string;
  valid?: boolean;
}

export class ContactsFormView extends Component<ContactsFormViewData> {
  protected _email: HTMLInputElement;
  protected _phone: HTMLInputElement;
  protected _errors: HTMLElement;
  protected _submitBtn: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    this._email = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container,
    );
    this._phone = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container,
    );
    this._errors = ensureElement<HTMLElement>(".form__errors", this.container);
    this._submitBtn = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container,
    );
  }

  set email(value: string) {
    this._email.value = value;
  }
  set phone(value: string) {
    this._phone.value = value;
  }
  set errors(value: string) {
    this._errors.textContent = value || "";
  }
  set valid(value: boolean) {
    this._submitBtn.disabled = !value;
  }

  set onEmailInput(callback: (value: string) => void) {
    this._email.addEventListener("input", (e) =>
      callback((e.target as HTMLInputElement).value),
    );
  }
  set onPhoneInput(callback: (value: string) => void) {
    this._phone.addEventListener("input", (e) =>
      callback((e.target as HTMLInputElement).value),
    );
  }
  set onSubmit(callback: () => void) {
    this._submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      callback();
    });
  }

  override render(data?: Partial<ContactsFormViewData>): HTMLElement {
    super.render(data);
    return this.container;
  }
}

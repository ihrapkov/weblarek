import { FormView, type FormViewData } from "./FormView";
import { ensureElement } from "../../utils/utils";

export interface ContactsFormViewData extends FormViewData {
  email: string;
  phone: string;
}

export interface ContactsFormHandlers {
  onEmailInput?: (value: string) => void;
  onPhoneInput?: (value: string) => void;
  onSubmit?: () => void;
}

export class ContactsFormView extends FormView<ContactsFormViewData> {
  private readonly emailInput: HTMLInputElement;
  private readonly phoneInput: HTMLInputElement;
  private readonly handlers: ContactsFormHandlers;

  constructor(container: HTMLElement, handlers: ContactsFormHandlers = {}) {
    super(container, handlers.onSubmit);

    this.handlers = handlers;
    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container,
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container,
    );

    this.emailInput.addEventListener("input", () => {
      this.handlers.onEmailInput?.(this.emailInput.value);
    });

    this.phoneInput.addEventListener("input", () => {
      this.handlers.onPhoneInput?.(this.phoneInput.value);
    });
  }

  public override render(data?: Partial<ContactsFormViewData>): HTMLElement {
    super.render(data);

    if (typeof data?.email === "string") {
      this.emailInput.value = data.email;
    }

    if (typeof data?.phone === "string") {
      this.phoneInput.value = data.phone;
    }

    return this.container;
  }
}

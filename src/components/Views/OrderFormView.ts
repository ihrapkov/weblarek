import { FormView, type FormViewData } from "./FormView";
import { ensureElement } from "../../utils/utils";

export interface OrderFormViewData extends FormViewData {
  payment: "card" | "cash" | "";
  address: string;
}

export interface OrderFormHandlers {
  onPaymentChange?: (payment: "card" | "cash") => void;
  onAddressInput?: (value: string) => void;
  onSubmit?: () => void;
}

export class OrderFormView extends FormView<OrderFormViewData> {
  private readonly cardButton: HTMLButtonElement;
  private readonly cashButton: HTMLButtonElement;
  private readonly addressInput: HTMLInputElement;
  private readonly handlers: OrderFormHandlers;

  constructor(container: HTMLElement, handlers: OrderFormHandlers = {}) {
    super(container, handlers.onSubmit);

    this.handlers = handlers;
    this.cardButton = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.container,
    );
    this.cashButton = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.container,
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container,
    );

    this.cardButton.addEventListener("click", (event: MouseEvent) => {
      event.preventDefault();
      this.handlers.onPaymentChange?.("card");
    });

    this.cashButton.addEventListener("click", (event: MouseEvent) => {
      event.preventDefault();
      this.handlers.onPaymentChange?.("cash");
    });

    this.addressInput.addEventListener("input", () => {
      this.handlers.onAddressInput?.(this.addressInput.value);
    });
  }

  public override render(data?: Partial<OrderFormViewData>): HTMLElement {
    super.render(data);

    if (typeof data?.address === "string") {
      this.addressInput.value = data.address;
    }

    if ("payment" in (data ?? {})) {
      this.setActivePayment(data?.payment ?? "");
    }

    return this.container;
  }

  private setActivePayment(payment: "card" | "cash" | ""): void {
    this.cardButton.classList.toggle("button_alt-active", payment === "card");
    this.cashButton.classList.toggle("button_alt-active", payment === "cash");
  }
}

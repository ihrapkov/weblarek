import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface FormViewData {
  valid: boolean;
  errors: string;
}

export type FormSubmitHandler = () => void;
export type FormInputHandler = (name: string, value: string) => void;

export abstract class FormView<T extends FormViewData = FormViewData> extends Component<T> {
  protected readonly formElement: HTMLFormElement;
  protected readonly submitButton: HTMLButtonElement;
  protected readonly errorsElement: HTMLElement;

  protected constructor(
    container: HTMLElement,
    private readonly onSubmit?: FormSubmitHandler,
    private readonly onInput?: FormInputHandler,
  ) {
    super(container);

    this.formElement =
      this.container instanceof HTMLFormElement
        ? this.container
        : ensureElement<HTMLFormElement>("form", this.container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.formElement,
    );
    this.errorsElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.formElement,
    );

    this.formElement.addEventListener("submit", (event: SubmitEvent) => {
      event.preventDefault();
      this.onSubmit?.();
    });

    this.formElement.addEventListener("input", (event: Event) => {
      const target = event.target;
      if (
        !(
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target instanceof HTMLSelectElement
        )
      ) {
        return;
      }

      if (!target.name) {
        return;
      }

      this.onInput?.(target.name, target.value);
    });
  }

  public override render(data?: Partial<T>): HTMLElement {
    if (typeof data?.valid === "boolean") {
      this.submitButton.disabled = !data.valid;
    }

    if (typeof data?.errors === "string") {
      this.errorsElement.textContent = data.errors;
    }

    return this.container;
  }
}

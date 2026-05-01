import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import type { IEvents } from "../base/Events";

export interface FormData {
  errors?: string;
  valid?: boolean;
}

export class Form<T extends FormData> extends Component<T> {
  protected _errors: HTMLElement;
  protected _submitBtn: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);
    this._errors = ensureElement<HTMLElement>(".form__errors", this.container);
    this._submitBtn = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container,
    );
  }

  set errors(value: string) {
    this._errors.textContent = value || "";
  }

  set valid(value: boolean) {
    this._submitBtn.disabled = !value;
  }
}

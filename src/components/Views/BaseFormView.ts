import { Component } from '../base/Component';

interface FormViewProps {
  errors?: string;
  valid?: boolean;
}

export abstract class BaseFormView extends Component<FormViewProps> {
  protected formEl: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected errorsEl: HTMLElement;
  protected inputElements: Map<string, HTMLInputElement>;

  constructor(container: HTMLElement, protected formName: string) {
    super(container);

    this.formEl = this.container.querySelector(`form[name="${formName}"]`) as HTMLFormElement;
    this.submitButton = this.formEl.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.errorsEl = this.container.querySelector('.form__errors') as HTMLElement;
    this.inputElements = new Map();

    // Собираем все инпуты формы
    const inputs = this.formEl.querySelectorAll('input');
    inputs.forEach((input) => {
      if (input.name) {
        this.inputElements.set(input.name, input as HTMLInputElement);
        input.addEventListener('input', () => {
          this.onInputChange();
        });
      }
    });

    this.formEl.addEventListener('submit', (event) => {
      event.preventDefault();
      this.onSubmit?.();
    });
  }

  protected abstract onInputChange(): void;

  set onSubmit(_callback: () => void) {
    // Обработчик устанавливается внешним кодом
  }

  set errors(value: string) {
    this.errorsEl.textContent = value || '';
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  getFormValues(): Record<string, string> {
    const values: Record<string, string> = {};
    this.inputElements.forEach((input, name) => {
      values[name] = input.value;
    });
    return values;
  }

  reset(): void {
    this.formEl.reset();
    this.errors = '';
    this.valid = false;
  }
}

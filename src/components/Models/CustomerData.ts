import type { Customer, CustomerValidationResult } from "../../types";
import { EventEmitter } from "../base/Events";

export class CustomerData extends EventEmitter {
  private data: Customer = {
    payment: "",
    address: "",
    email: "",
    phone: "",
  };

  /** Сохранение данных в модели */
  public update(fields: Partial<Customer>): void {
    this.data = { ...this.data, ...fields };
    this.emit("customer:update", { data: this.data });
  }

  /** Получение всех данных покупателя */
  public getData(): Customer {
    return { ...this.data };
  }

  /** Очистка данных покупателя */
  public clear(): void {
    const data = { ...this.data };
    this.data = { payment: "", address: "", email: "", phone: "" };
    this.emit("customer:clear", { data });
  }

  /** Полная валидация данных (используется при финальной проверке) */
  public validate(): CustomerValidationResult {
    const errors: Partial<Record<keyof Customer, string>> = {};
    if (!this.data.payment) {
      errors.payment = "Необходимо выбрать способ оплаты";
    }
    if (!this.data.address.trim()) {
      errors.address = "Необходимо указать адрес"; // ✅ Исправлено под ТЗ
    }
    if (!this.data.email.trim()) {
      errors.email = "Email не может быть пустым";
    }
    if (!this.data.phone.trim()) {
      errors.phone = "Телефон не может быть пустым";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /** Пошаговая валидация для UI (чтобы не проверять поля других шагов) */
  public validateStep(step: 1 | 2): CustomerValidationResult {
    const fullResult = this.validate();
    const fieldsToCheck: (keyof Customer)[] =
      step === 1 ? ["payment", "address"] : ["email", "phone"];
    const stepErrors: Partial<Record<keyof Customer, string>> = {};

    for (const field of fieldsToCheck) {
      if (fullResult.errors[field]) {
        stepErrors[field] = fullResult.errors[field];
      }
    }

    return {
      isValid: Object.keys(stepErrors).length === 0,
      errors: stepErrors,
    };
  }
}

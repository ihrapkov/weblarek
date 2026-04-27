import type { Customer, CustomerValidationResult, CustomerUpdateEvent, CustomerClearEvent } from "../../types";
import { EventEmitter } from "../base/Events";

export class CustomerData extends EventEmitter {
  private data: Customer = {
    payment: "",
    address: "",
    email: "",
    phone: "",
  };

  /**
   * Сохранение данных в модели.
   * Используется Partial<Customer>, что позволяет передавать только одно поле
   * без перезаписи остальных.
   */
  public update(fields: Partial<Customer>): void {
    this.data = { ...this.data, ...fields };
    this.emit<CustomerUpdateEvent>('customer:update', { data: this.data });
  }

  /** Получение всех данных покупателя */
  public getData(): Customer {
    return { ...this.data };
  }

  /** Очистка данных покупателя */
  public clear(): void {
    const data = { ...this.data };
    this.data = { payment: "", address: "", email: "", phone: "" };
    this.emit<CustomerClearEvent>('customer:clear', { data });
  }

  /**
   * Валидация данных.
   * Поле считается валидным, если оно не пустое (с учётом пробелов для строк).
   */
  public validate(): CustomerValidationResult {
    const errors: Partial<Record<keyof Customer, string>> = {};

    if (!this.data.payment) {
      errors.payment = "Необходимо выбрать способ оплаты";
    }
    if (!this.data.address.trim()) {
      errors.address = "Адрес не может быть пустым";
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
}

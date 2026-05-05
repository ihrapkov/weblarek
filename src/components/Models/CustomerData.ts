import type {
  Customer,
  CustomerValidationResult,
  CustomerErrors,
} from "../../types";
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
    this.data = { payment: "", address: "", email: "", phone: "" };
    this.emit("customer:clear", { data: this.data });
  }

  /** Полная валидация данных (используется при финальной проверке) */
  public validate(): CustomerValidationResult {
    const errors: CustomerErrors = {};
    if (!this.data.payment) {
      errors.payment = "Необходимо выбрать способ оплаты";
    }
    if (!this.data.address.trim()) {
      errors.address = "Необходимо указать адрес";
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

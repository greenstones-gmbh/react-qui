export class ApplicationError extends Error {
  data?: any;

  constructor(name: string, message: string, data?: any) {
    super(message);
    this.name = name;
    this.data = data;

    // Fix prototype chain (important when extending built-ins)
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

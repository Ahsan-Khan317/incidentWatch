import { Breadcrumb } from "../types";

export class BreadcrumbManager {
  private _limit: number;
  private _items: Breadcrumb[] = [];

  constructor(limit = 50) {
    this._limit = limit;
  }

  add({ category, data = {}, level = "info" }: Omit<Breadcrumb, "timestamp">) {
    this._items.push({
      category,
      data,
      level,
      timestamp: new Date().toISOString(),
    });
    if (this._items.length > this._limit) {
      this._items.shift(); // oldest drop karo
    }
  }

  getAll(): Breadcrumb[] {
    return [...this._items];
  }

  clear(): void {
    this._items = [];
  }
}

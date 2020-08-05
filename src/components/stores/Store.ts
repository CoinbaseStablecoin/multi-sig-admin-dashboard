export abstract class Store<T> {
  static storageKey = "Store";

  protected abstract prepareData(): T;
  protected abstract restoreData(data: T): void;

  public restore(): void {
    const json = localStorage.getItem(
      (this.constructor as typeof Store).storageKey
    );
    if (!json) {
      return;
    }
    let data: T;
    try {
      data = JSON.parse(json);
    } catch {
      return;
    }

    this.restoreData(data);
  }

  public persist(): void {
    localStorage.setItem(
      (this.constructor as typeof Store).storageKey,
      JSON.stringify(this.prepareData())
    );
  }
}

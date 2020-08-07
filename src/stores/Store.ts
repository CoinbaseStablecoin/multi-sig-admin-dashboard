export abstract class Store<T> {
  public static storageKey = "Store";

  protected abstract prepareData(): T;
  protected abstract restoreData(data: T): void;

  /**
   * Restore store from the data persisted in localStorage
   */
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

  /**
   * Persist data in localStorage
   */
  public persist(): void {
    localStorage.setItem(
      (this.constructor as typeof Store).storageKey,
      JSON.stringify(this.prepareData())
    );
  }
}

export abstract class Store<T> {
  public static readonly storageKey: string;

  /**
   * Convert native store data to a JSON-stringifiable format
   * @returns Marshaled data
   */
  protected abstract marshal(): T;

  /**
   * Convert marshalled data back to native store data
   * @param data Marshaled data
   */
  protected abstract unmarshal(data: T): void;

  /**
   * Load data from localStorage
   */
  public load(): void {
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

    this.unmarshal(data);
  }

  /**
   * Save data to localStorage
   */
  public save(): void {
    localStorage.setItem(
      (this.constructor as typeof Store).storageKey,
      JSON.stringify(this.marshal())
    );
  }
}

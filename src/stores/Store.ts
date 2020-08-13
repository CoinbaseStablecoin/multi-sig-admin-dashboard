import { action, observable } from "mobx";

export abstract class Store<T, U> {
  public static readonly storageKey: string;

  /**
   * Maps keys to entries
   * Keys must be case-insensitive string
   */
  @observable
  protected data = new Map<string, T>();

  /**
   * Convert native store data to a JSON-stringifiable format
   * @returns Marshaled data
   */
  protected abstract marshal(): U;

  /**
   * Convert marshalled data back to native store data
   * @param data Marshaled data
   */
  protected abstract unmarshal(data: U): void;

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
    let data: U;
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

  /**
   * Return all entries in the store
   * @returns An array of Transaction objects
   */
  public all(): T[] {
    return Array.from(this.data.values());
  }

  /**
   * Return the number of entries in the store
   * @returns Transaction count
   */
  public count(): number {
    return this.data.size;
  }

  /**
   * Get an entry by a key
   * @param key A case-insensitive key
   * @returns Contract or null if not found
   */
  public get(key: string): T | null {
    return this.data.get(key.toLowerCase()) ?? null;
  }

  /**
   * Remove an entry from the store
   * @param key A case-insensitive key
   */
  @action
  public remove(key: string): void {
    this.data.delete(key.toLowerCase());
  }
}

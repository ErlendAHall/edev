import { objectsIsEqual } from "./object";

export type AnyObject = Record<string, unknown>;

/**
 * This extension of Set is designed to handle objects like values instead of references.
 * In addition, this Set implmentation contains logic that make Set objects a little bit easier to work with.
 *
 * For example:
 * - The object {foo: "bar"} is always equal to another object {foo: "bar"} because it is compared by value.
 * - If an object contains more than 1 props, the sorting order of those are irrelevant.
 */
class FriendlySet<T> extends Set<T> {
  constructor(initialItems?: Array<T>) {
    super();
    initialItems?.forEach((i) => {
      if (this.valueIsUnique(i)) this.add(i);
    });
  }
  /**
   * Retrieves a value from the Set from a given index.
   * A negative index will count backwards from the Set.
   */
  public get(index: number): T | undefined {
    return this.toArray().at(index);
  }

  /** Appends a new element with a specified value to the end of the Set. */
  public add(value: T): this {
    if (!this.getValue(value)) {
      super.add(value);
    }

    return this;
  }

  /**
   * Removes a specified value from the Set.
   * @returns — Returns true if an element in the Set existed and has been removed, or false if the element does not exist.
   */
  public delete(value: T): boolean {
    if (typeof value === "object") {
      const objectToDelete = this.getValue(value);
      if (objectToDelete) {
        return super.delete(objectToDelete);
      }
    }
    return super.delete(value);
  }

  /**
   * Uses value equality to check if a given value is present in the Set.
   * If present, it returns the value. Otherwise it returns undefined.
   */
  public getValue(value: T): T | undefined {
    const setIterator = this.values();
    let nextValue = setIterator.next();

    while (!nextValue.done) {
      if (
        nextValue.value &&
        objectsIsEqual(nextValue.value as AnyObject, value as AnyObject)
      ) {
        return nextValue.value;
      }
      nextValue = setIterator.next();
    }

    return undefined;
  }

  /** Returns true if the specificed parameter is not found by value in the working set.*/
  private valueIsUnique(value: T): boolean {
    return Boolean(!this.getValue(value));
  }

  /**
   * Accepts a collection and merges the values into the working set.
   * Duplicate items by value is filtered away.
   */
  public merge(collection: FriendlySet<T> | Set<T> | Array<T>): this {
    collection.forEach((value) => this.valueIsUnique(value) && this.add(value));
    return this;
  }

  /**
   * Accepts a replacement value that shall replace the current value at the specified index.
   * If the replacement is already present by value in the working set, the unaltered set is returned.
   * TODO: This operation is relatively expensive in order to preserve the item order.
   */
  public replaceByIndex(replacement: T, index: number): this {
    if (!this.valueIsUnique(replacement)) return this;
    const newCollection = structuredClone(this.toArray());
    newCollection[index] = replacement;
    return this.replaceAll(newCollection);
  }

  /**
   * Accepts a set and replaces all content from it into the working set.
   * Duplicate items by value is filtered away.
   */
  public replaceAll(collection: FriendlySet<T> | Set<T> | Array<T>): this {
    this.clear();
    collection.forEach((value) => this.valueIsUnique(value) && this.add(value));
    return this;
  }

  /** Returns an array representation of the working set. */
  public toArray(): T[] {
    return Array.from(this);
  }
}

export { FriendlySet };

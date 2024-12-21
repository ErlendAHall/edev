import { arraysIsEqual } from "./array";

/**
 *
 * Function for recursively checking the equality of two objects.
 * @param {Record<string, unknown>} obj1 The first object to consider.
 * @param {Record<string, unknown>} obj2 The second object to consider.
 * @return {*}  {boolean} Returns if the objects are equal (true) or not (false).
 */
export const objectsIsEqual = (
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>
): boolean => {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);

  if (obj1Keys.length !== obj2Keys.length) return false;
  obj1Keys.sort();
  obj2Keys.sort();
  if (!arraysIsEqual(obj1Keys, obj2Keys)) return false;

  for (const key of obj1Keys) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (val1 !== val2) {
      if (Array.isArray(val1) && Array.isArray(val2)) {
        if (!arraysIsEqual(val1, val2)) return false;
      } else if (
        val1 !== null &&
        val2 !== null &&
        typeof val1 === "object" &&
        typeof val2 === "object"
      ) {
        if (
          !objectsIsEqual(
            val1 as Record<string, unknown>,
            val2 as Record<string, unknown>
          )
        )
          return false;
      } else {
        return false;
      }
    }
  }
  return true;
};

/**
 * Accepts any object and returns a new object of the generic type T, omitting anything not specified in T.
 * @param target The object to omit properties from.
 * @param props The properties to omit as a string array.
 */
export function omit<TTarget, K extends keyof TTarget = keyof TTarget>(
  target: TTarget,
  props: K[]
): Omit<TTarget, K> {
  const optionals: TTarget = { ...target };
  props.forEach((prop) => delete optionals[prop]);
  return optionals as Omit<TTarget, K>;
}

/**
 * Returns the sum of an object's numerical properties. Will ignore any properties with type !== number
 * @param object the object
 * @returns The sum of the object's properties of type number
 */
export function sumNumericalProperties(object: any) {
  if (!object) return 0;

  let sum = 0;
  for (const value of Object.values(object)) {
    if (typeof value === "number") sum += value;
  }

  return sum;
}

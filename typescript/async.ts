/**
 * limits your function to be called at most every W milliseconds, where W is wait.
 * Calls over W get dropped.
 * Thanks to Pat Migliaccio.
 * see https://medium.com/@pat_migliaccio/rate-limiting-throttling-consecutive-function-calls-with-queues-4c9de7106acc
 * @param fn
 * @param wait
 * @example let throttledFunc = throttle(myFunc,500);
 */
export function throttle(fn: Function, wait: number) {
  let isCalled = false;

  return function (...args: any[]) {
    if (!isCalled) {
      fn(...args);
      isCalled = true;
      setTimeout(function () {
        isCalled = false;
      }, wait);
    }
  };
}
/**
 * Works like throttle. Wrap the function to debounce and store the returned ref.
 * The returned ref is what is called to actually handle debouncing.
 *
 * const debounced = debounce(functionToDebounce, 200);
 * debounced();
 */
export function debounce(func: Function, timeout = 300) {
  let timer: NodeJS.Timeout;

  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

/** A generic delaying function.
 * @param delayInMs The delay time. Defaults to 2000 milliseconds.
 * @returns {Promise<undefined>}
 */
export function delay(delayTime: number = 2000): Promise<undefined> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(undefined), delayTime);
  });
}

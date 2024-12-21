export function trimTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

export function trimLeadingSlash(url: string): string {
  return url.replace(/^\//, "");
}

export function trimLeadingQuestion(url: string): string {
  return url.replace(/^\?/, "");
}

export function combineUrls(
  base: string,
  ...parts: (string | undefined)[]
): string {
  const separator = "/";
  const url = (parts || [])
    // fancy user-defined type guard. Just removes undefined parts.
    .filter((part): part is string => !!part)
    .reduce(
      (url, part) => url + separator + encodeURIComponent(part),
      base || ""
    );

  return trimTrailingSlash(url);
}

export type Params = { [key: string]: any };

/**
 * Takes a url as input and adds the specified parameters to it.
 * @param url The url to extend.
 * @param params The params to add.
 */
export const addParams = (url: string, params: Params): string => {
  const queryString = Object.keys(params)
    .filter((key) => params[key] !== undefined)
    .reduce(
      (query, key) =>
        query + `${query ? "&" : ""}${key}=${encodeURIComponent(params[key])}`,
      ""
    );

  if (queryString) {
    return url + "?" + queryString;
  }

  return url;
};

/**
 * Takes a url and returns the params as an object.
 * @param url
 */
export const parseParams = <T>(url: string): T => {
  const query = trimLeadingQuestion(url);

  const params: Params = {};
  query.split("&").forEach((param: string) => {
    const [key, value] = param.split("=");
    const decodedKey = decodeURIComponent(key);
    const decodedValue = decodeURIComponent(value);

    params[decodedKey] = decodedValue;
  });

  return params as T;
};

/**
 * Updates a query string params and returns updated query string.
 * @param queryString,
 * @param key string,
 * @param value a value to add or update,
 * @returns string
 */
export const updateQueryStringParam = (
  queryString: string,
  key: string,
  value: string
): string => {
  const searchParams = new URLSearchParams(queryString);
  if (searchParams.has(key)) {
    searchParams.set(key, value);
  } else {
    searchParams.append(key, value);
  }
  return searchParams.toString();
};

/**
 * Updates or adds a values list in the query string.
 * @param queryString,
 * @param key string,
 * @param values list of string values,
 * @returns Updated query string
 */
export const updateQueryStringList = (
  queryString: string,
  key: string,
  values: string[]
): string => {
  const searchParams = new URLSearchParams(queryString);
  const list = searchParams.get(key);
  if (list) {
    const parsedList = list.split(",");
    const uniqueSet = new Set([...parsedList, ...values]);
    searchParams.set(key, Array.from(uniqueSet).join(","));
  } else {
    searchParams.append(key, values.join(","));
  }
  return searchParams.toString();
};

/**
 * Removes a value from the list of values in the query string.
 * @param queryString,
 * @param key string,
 * @param value a string value,
 * @returns Updated query string | undefined
 */
export const removeFromQueryStringList = (
  queryString: string,
  key: string,
  value: string
): string | undefined => {
  let result;
  const searchParams = new URLSearchParams(queryString);
  const list = searchParams.get(key);
  if (list) {
    const parsedList = list.split(",");
    const filtered = parsedList.filter((item: string) => item !== value);
    if (filtered.length) {
      searchParams.set(key, filtered.join(","));
    } else {
      searchParams.delete(key);
    }
    result = searchParams.toString();
  }
  return result;
};

/**
 * Checks is the value exists in the querystring list
 * @param queryString,
 * @param key string,
 * @param value a string value,
 * @returns boolean
 */
export const queryStringListContains = (
  queryString: string,
  key: string,
  value: string
): boolean => {
  const searchParams = new URLSearchParams(queryString);
  const list = searchParams.get(key);
  if (list) {
    const parsedList = list.split(",");
    return parsedList.some((item) => item === value);
  }
  return false;
};

export function urlPartDecoder<T>(
  urlstring?: string | null
): string | undefined {
  if (!urlstring) {
    return;
  }

  return decodeURIComponent(urlstring);
}

export function urlPartListDecoder<T>(
  urlstring?: string | null
): Array<T> | undefined {
  if (!urlstring) {
    return;
  }

  const decodedString = decodeURIComponent(urlstring);
  const splitString = decodedString.split(",");
  return splitString as Array<T>;
}

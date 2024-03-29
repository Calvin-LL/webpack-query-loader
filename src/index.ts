import loaderUtils from "loader-utils";
import { validate } from "schema-utils";
import { Schema } from "schema-utils/declarations/validate";
import { RawSourceMap } from "source-map";
import { loader } from "webpack";

import schema from "./options.json";

type RuleSetCondition =
  | string
  | string[]
  | ((
      resource: string,
      resourceQuery: string,
      query: Record<string, unknown>
    ) => boolean);

interface RuleSetLoader {
  /**
   * Loader name
   */
  loader?: string;
  /**
   * Loader options
   */
  options?: RuleSetQuery;
}

type RuleSetUseItem = string | RuleSetLoader;

type RuleSetQuery = { [k: string]: any };

interface Options {
  readonly use: RuleSetUseItem;
  readonly resourceQuery?: RuleSetCondition;
}

export const raw = true;

export function pitch(
  this: loader.LoaderContext,
  remainingRequest: string,
  precedingRequest: string,
  data: any
): any {
  const options = (loaderUtils.getOptions(this) as Readonly<Options>) || {};
  const params = this.resourceQuery
    ? loaderUtils.parseQuery(this.resourceQuery)
    : {};

  validate(schema as Schema, options, {
    name: "Query Loader",
    baseDataPath: "options",
  });

  const conditionsMet = checkConditions(
    this.resource,
    this.resourceQuery,
    params,
    options.resourceQuery
  );

  if (!conditionsMet) return undefined;

  // code from https://github.com/webpack-contrib/url-loader
  // Normalize the fallback.
  const { loader: fallbackLoader, options: fallbackOptions } = normalizeUse(
    options?.use
  );

  // Require the fallback.
  const fallback = require(fallbackLoader).pitch;

  if (!fallback || typeof fallback !== "function") return undefined;

  // Call the fallback, passing a copy of the loader context. The copy has the query replaced. This way, the fallback
  // loader receives the query which was intended for it instead of the query which was intended for url-loader.
  const fallbackLoaderContext = { ...this, query: fallbackOptions };

  return fallback.call(
    fallbackLoaderContext,
    remainingRequest,
    precedingRequest,
    data
  );
}

export default function (
  this: loader.LoaderContext,
  source: string | Buffer,
  sourceMap?: RawSourceMap
): any {
  const options = (loaderUtils.getOptions(this) as Readonly<Options>) || {};
  const params = this.resourceQuery
    ? loaderUtils.parseQuery(this.resourceQuery)
    : {};

  validate(schema as Schema, options, {
    name: "Query Loader",
    baseDataPath: "options",
  });

  const conditionsMet = checkConditions(
    this.resource,
    this.resourceQuery,
    params,
    options.resourceQuery
  );

  if (!conditionsMet) return source;

  // code from https://github.com/webpack-contrib/url-loader
  // Normalize the fallback.
  const { loader: fallbackLoader, options: fallbackOptions } = normalizeUse(
    options.use
  );

  // Require the fallback.
  const fallback = require(fallbackLoader);

  if (!fallback || typeof fallback !== "function") return source;

  // Call the fallback, passing a copy of the loader context. The copy has the query replaced. This way, the fallback
  // loader receives the query which was intended for it instead of the query which was intended for url-loader.
  const fallbackLoaderContext = { ...this, query: fallbackOptions };

  const normalizedContent = normalizeContent(source, fallback.raw);

  return fallback.call(fallbackLoaderContext, normalizedContent, sourceMap);
}

// from https://github.com/webpack/loader-runner/blob/master/lib/LoaderRunner.js
function normalizeContent(
  source: string | Buffer,
  raw: boolean
): string | Buffer {
  if (!raw && Buffer.isBuffer(source)) return utf8BufferToString(source);
  else if (raw && typeof source === "string")
    return Buffer.from(source, "utf-8");
  return source;
}

// from https://github.com/webpack/loader-runner/blob/master/lib/LoaderRunner.js
function utf8BufferToString(buf: Buffer): string {
  const str = buf.toString("utf-8");
  if (str.charCodeAt(0) === 0xfeff) {
    return str.substr(1);
  } else {
    return str;
  }
}

function checkConditions(
  resource: string,
  resourceQuery: string,
  query: loaderUtils.OptionObject,
  resourceQueryConditions: Options["resourceQuery"]
): boolean {
  if (resourceQueryConditions === undefined) return true;

  if (typeof resourceQueryConditions === "function") {
    return resourceQueryConditions(resource, resourceQuery, query);
  } else if (typeof resourceQueryConditions === "object") {
    return resourceQueryConditions.every((parameter) =>
      checkQueryParameter(parameter, query)
    );
  } else if (typeof resourceQueryConditions === "string") {
    return checkQueryParameter(resourceQueryConditions, query);
  }

  throw new Error("resourceQuery Not Found");
}

function checkQueryParameter(parameter: string, query: any): boolean {
  if (parameter.charAt(0) === "!") {
    const actualParameter = parameter.substring(1);

    return !Object.keys(query).includes(actualParameter);
  } else {
    return Object.keys(query).includes(parameter);
  }
}

function normalizeUse(
  use: RuleSetUseItem
): {
  loader: string;
  options: Record<string, unknown>;
} {
  let loaderString;
  let options = {};

  if (typeof use === "string") {
    loaderString = use;
  } else if (typeof use === "object") {
    loaderString = use.loader;
    if (use.options) options = use.options;
  }

  if (loaderString === undefined) throw new Error("Loader Not Found");

  return normalizeLoader(loaderString, options);
}

// code from https://github.com/webpack-contrib/url-loader
function normalizeLoader(
  loaderString: string,
  originalOptions: RuleSetQuery
): {
  loader: string;
  options: Record<string, unknown>;
} {
  let loaderName = loaderString;
  let options = {};

  if (typeof loaderString === "string") {
    loaderName = loaderString;

    const index = loaderString.indexOf("?");

    if (index >= 0) {
      loaderName = loaderString.substr(0, index);
      options = loaderUtils.parseQuery(loaderString.substr(index));
    }
  }

  if (loaderString !== null && typeof loaderString === "object") {
    ({ loaderName, options } = loaderString);
  }

  options = Object.assign({}, originalOptions, options);

  return { loader: loaderName, options };
}

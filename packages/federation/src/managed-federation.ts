import type {
  GatewayApolloConfig,
  GatewayGraphQLRequestContext,
  GatewayInterface,
  GatewayLoadResult,
  GatewaySchemaLoadOrUpdateCallback,
} from '@apollo/server-gateway-interface';
import { createDefaultExecutor } from '@graphql-tools/delegate';
import type { FetchFn } from '@graphql-tools/executor-http';
import { ExecutionResult, fakePromise } from '@graphql-tools/utils';
import type { TypedEventTarget } from '@graphql-yoga/typed-event-target';
import { DisposableSymbols } from '@whatwg-node/disposablestack';
import { CustomEvent } from '@whatwg-node/events';
import { fetch as defaultFetch } from '@whatwg-node/fetch';
import { getEnvStr } from '~internal/env';
import { GraphQLSchema } from 'graphql';
import {
  getStitchedSchemaFromSupergraphSdl,
  GetStitchedSchemaFromSupergraphSdlOpts,
} from './supergraph.js';

export type FetchSupergraphSdlFromManagedFederationOpts = {
  /**
   * The graph ref of the managed federation graph.
   * It is composed of the graph ID and the variant (`<YOUR_GRAPH_ID>@<VARIANT>`).
   *
   * If not provided, `APOLLO_GRAPH_REF` environment variable is used.
   *
   * You can find a a graph's ref at the top of its Schema Reference page in Apollo Studio.
   */
  graphRef?: string;
  /**
   * The API key to use to authenticate with the managed federation up link.
   * It needs at least the `service:read` permission.
   *
   * If not provided, `APOLLO_KEY` environment variable will be used instead.
   *
   * [Learn how to create an API key](https://www.apollographql.com/docs/federation/v1/managed-federation/setup#4-connect-the-gateway-to-studio)
   */
  apiKey?: string;
  /**
   * The URL of the managed federation up link. When retrying after a failure, you should cycle through the default up links using this option.
   *
   * Uplinks are available in `DEFAULT_UPLINKS` constant.
   *
   * This options can also be defined using the `APOLLO_SCHEMA_CONFIG_DELIVERY_ENDPOINT` environment variable.
   * It should be a comma separated list of up links, but only the first one will be used.
   *
   * Default: 'https://uplink.api.apollographql.com/' (Apollo's managed federation up link on GCP)
   *
   * Alternative: 'https://aws.uplink.api.apollographql.com/' (Apollo's managed federation up link on AWS)
   */
  upLink?: string;
  /**
   * The ID of the last fetched supergraph.
   * If provided, a supergraph is returned only if the managed supergraph have changed.
   */
  lastSeenId?: string;
  /**
   * The fetch implementation to use.
   * Default: global.fetch
   */
  fetch?: FetchFn;
  /**
   * Up link can send back messages meant to be logged alongside the supergraph SDL.
   * By default, the console is used.
   */
  loggerByMessageLevel?: typeof DEFAULT_MESSAGE_LOGGER;
};

export type RouterConfig = {
  /**
   * The supergraph SDL.
   */
  supergraphSdl: string;
  /**
   * The minimum delay in seconds to wait before trying to fetch this supergraph again.
   */
  minDelaySeconds: number;
  /**
   * The ID of the supergraph. Should be used as `lastSeenId` in the next fetch.
   */
  id: string;
};

export type Unchanged = {
  /**
   * The minimum delay in seconds to wait before trying to fetch this supergraph again.
   */
  minDelaySeconds: number;
  /**
   * The ID of the supergraph. Should be used as `lastSeenId` in the next fetch.
   */
  id: string;
};

export type FetchError = {
  /**
   * The fetch error reported by the up link. This means it's not the local fetch error.
   * Local fetch errors are thrown as exceptions.
   */
  error: { code: string; message: string };
  /**
   * The minimum delay in seconds to wait before trying to fetch this supergraph again.
   */
  minDelaySeconds: number;
};

type RouterConfigResult = {
  routerConfig:
    | {
        __typename: 'RouterConfigResult';
        messages: { level: 'ERROR' | 'WARN' | 'INFO'; body: string }[];
        supergraphSdl: string;
        minDelaySeconds: number;
        id: string;
      }
    | { __typename: 'Unchanged'; minDelaySeconds: number; id: string }
    | {
        __typename: 'FetchError';
        code: string;
        message: string;
        minDelaySeconds: never;
      };
};

/**
 * The default managed federation up links. In case of failure, you should try to cycle through these up links.
 *
 * The first one is Apollo's managed federation up link on GCP, the second one is on AWS.
 */
export const DEFAULT_UPLINKS = [
  'https://uplink.api.apollographql.com/',
  'https://aws.uplink.api.apollographql.com/',
];

/**
 * Fetches the supergraph SDL from a managed federation GraphOS up link.
 * @param options
 * @throws When the fetch fails or the response is not a valid.
 * @returns An object with the supergraph SDL when possible. It also includes metadata to handle polling and retry logic.
 *
 *          If `lastSeenId` is provided and the supergraph has not changed, `supergraphSdl` is not present.
 *
 *          If The up link report a fetch error (which is not a local fetch error), it will be returned along with polling/retry metadata.
 *          Any local fetch error will be thrown as an exception.
 */
export async function fetchSupergraphSdlFromManagedFederation(
  options: FetchSupergraphSdlFromManagedFederationOpts = {},
): Promise<RouterConfig | Unchanged | FetchError> {
  const userDefinedUplinks =
    getEnvStr('APOLLO_SCHEMA_CONFIG_DELIVERY_ENDPOINT')?.split(',') ?? [];

  const {
    upLink = userDefinedUplinks[0] || DEFAULT_UPLINKS[0],
    loggerByMessageLevel = DEFAULT_MESSAGE_LOGGER,
    fetch = defaultFetch,
    ...variables
  } = options;

  if (!variables.graphRef) {
    variables.graphRef = getEnvStr('APOLLO_GRAPH_REF');
  }

  if (!variables.apiKey) {
    variables.apiKey = getEnvStr('APOLLO_KEY');
  }

  if (!upLink) {
    throw new Error('No up link provided');
  }

  const response = await fetch(upLink, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: /* GraphQL */ `
        query ($apiKey: String!, $graphRef: String!, $lastSeenId: ID) {
          routerConfig(
            ref: $graphRef
            apiKey: $apiKey
            ifAfterId: $lastSeenId
          ) {
            __typename
            ... on FetchError {
              code
              message
              minDelaySeconds
            }
            ... on Unchanged {
              id
              minDelaySeconds
            }
            ... on RouterConfigResult {
              id
              supergraphSdl: supergraphSDL
              minDelaySeconds
              messages {
                level
                body
              }
            }
          }
        }
      `,
      variables,
    }),
    signal: AbortSignal.timeout(30_000),
  });

  const responseBody = await response.text();

  if (!response.ok) {
    throw new Error(
      `Failed to fetch supergraph SDL from '${upLink}' due to an HTTP error (${response.status}) ${responseBody}`,
    );
  }

  let result: ExecutionResult<RouterConfigResult>;
  try {
    result = JSON.parse(responseBody);
  } catch (err) {
    throw new Error(
      `Failed to parse response from '${upLink}': ${(err as Error).message}\n\n${responseBody}`,
    );
  }

  if (result.errors) {
    throw new AggregateError(
      result.errors,
      `Failed to fetch supergraph SDL from '${upLink}'`,
    );
  }

  if (!result.data?.routerConfig) {
    throw new Error(
      `Failed to fetch supergraph SDL from '${upLink}': ${responseBody}`,
    );
  }

  const { routerConfig } = result.data;

  if (routerConfig.__typename === 'FetchError') {
    return {
      error: { code: routerConfig.code, message: routerConfig.message },
      minDelaySeconds: routerConfig.minDelaySeconds,
    };
  }

  if (routerConfig.__typename === 'Unchanged') {
    return {
      id: routerConfig.id,
      minDelaySeconds: routerConfig.minDelaySeconds,
    };
  }

  for (const message of routerConfig.messages) {
    loggerByMessageLevel[message.level](message.body);
  }

  return {
    supergraphSdl: routerConfig.supergraphSdl,
    id: routerConfig.id,
    minDelaySeconds: routerConfig.minDelaySeconds,
  };
}

export type GetStitchedSchemaFromManagedFederationOpts =
  FetchSupergraphSdlFromManagedFederationOpts &
    Omit<GetStitchedSchemaFromSupergraphSdlOpts, 'supergraphSdl'>;

export type RouterConfigWithSchema = RouterConfig & {
  /**
   * The stitched schema based on the supergraph SDL.
   */
  schema: GraphQLSchema;
};

/**
 * Fetches the supergraph SDL from a managed federation GraphOS up link and stitches it into an executable schema.
 * @param options
 * @throws When the fetch fails, the response is not a valid or the stitching fails.
 * @returns An object with the supergraph SDL and the stitched schema when possible. It also includes metadata to handle polling and retry logic.
 *
 *          If `lastSeenId` is provided and the supergraph has not changed, `supergraphSdl` is not present.
 *
 *          If The up link report a fetch error (which is not a local fetch error), it will be returned along with polling/retry metadata.
 *          Any local fetch error will be thrown as an exception.
 */
export async function getStitchedSchemaFromManagedFederation(
  options: GetStitchedSchemaFromManagedFederationOpts,
): Promise<RouterConfigWithSchema | FetchError | Unchanged> {
  const result = await fetchSupergraphSdlFromManagedFederation({
    graphRef: options.graphRef,
    apiKey: options.apiKey,
    upLink: options.upLink,
    lastSeenId: options.lastSeenId,
    fetch: options.fetch,
    loggerByMessageLevel: options.loggerByMessageLevel,
  });
  if ('supergraphSdl' in result) {
    return {
      ...result,
      schema: getStitchedSchemaFromSupergraphSdl({
        supergraphSdl: result.supergraphSdl,
        onStitchingOptions: options.onStitchingOptions,
        onStitchedSchema: options.onStitchedSchema,
        httpExecutorOpts: options.httpExecutorOpts,
        onSubschemaConfig: options.onSubschemaConfig,
        batch: options.batch,
      }),
    };
  }
  return result;
}

const DEFAULT_MESSAGE_LOGGER = {
  ERROR: (message: string) =>
    console.error('[Managed Federation] Uplink message: [ERROR]', message),
  WARN: (message: string) =>
    console.warn('[Managed Federation] Uplink message: [WARN]', message),
  INFO: (message: string) =>
    console.info('[Managed Federation] Uplink message: [INFO]', message),
};

export type SupergraphSchemaManagerOptions = Omit<
  GetStitchedSchemaFromManagedFederationOpts,
  'lastSeenId'
> & {
  maxRetries?: number;
  minDelaySeconds?: number;
  retryDelaySeconds?: number;
};

export type SupergraphSchemaManagerSchemaEvent = CustomEvent<{
  schema: GraphQLSchema;
  supergraphSdl: string;
}>;
export type SupergraphSchemaManagerErrorEvent = CustomEvent<FetchError | Error>;
export type SupergraphSchemaManagerFailureEvent = CustomEvent<{
  error: FetchError['error'] | Error;
  delayInSeconds: number;
}>;
export type SupergraphSchemaManagerLogEvent = CustomEvent<{
  source: 'uplink' | 'manager';
  message: string;
  level: 'error' | 'warn' | 'info';
}>;

export type SupergraphSchemaManagerEvent =
  | SupergraphSchemaManagerSchemaEvent
  | SupergraphSchemaManagerErrorEvent
  | SupergraphSchemaManagerFailureEvent
  | SupergraphSchemaManagerLogEvent;

const TypedEventTargetCtor = EventTarget as unknown as new <
  TEvent extends CustomEvent,
>() => TypedEventTarget<TEvent>;

export class SupergraphSchemaManager
  extends TypedEventTargetCtor<SupergraphSchemaManagerEvent>
  implements GatewayInterface
{
  public schema?: GraphQLSchema = undefined;

  #lastSeenId: string | undefined;
  #retries = 1;

  #timeout: ReturnType<typeof setTimeout> | undefined;

  constructor(private options: SupergraphSchemaManagerOptions = {}) {
    super();
  }

  load = async (options: {
    apollo: GatewayApolloConfig;
  }): Promise<GatewayLoadResult> => {
    this.options.apiKey ||= options.apollo.key;
    this.options.graphRef ||= options.apollo.graphRef;
    await this.#fetchSchema();
    return {
      executor(requestContext: GatewayGraphQLRequestContext) {
        return createDefaultExecutor(requestContext.schema)({
          document: requestContext.document,
          variables: requestContext.request.variables,
          operationType: requestContext.operation.operation,
          operationName: requestContext.operationName || undefined,
          context: requestContext.context,
        }) as Promise<ExecutionResult>;
      },
    };
  };

  onSchemaLoadOrUpdate = (callback: GatewaySchemaLoadOrUpdateCallback) => {
    const onSchemaChange = (event: SupergraphSchemaManagerSchemaEvent) => {
      callback({
        apiSchema: event.detail.schema,
        coreSupergraphSdl: event.detail.supergraphSdl,
      });
    };
    this.addEventListener('schema', onSchemaChange);
    return () => {
      this.removeEventListener('schema', onSchemaChange);
    };
  };

  start = (delayInSeconds = 0) => {
    if (this.#timeout) {
      this.stop();
    }

    this.#timeout = setTimeout(() => {
      this.#log('info', 'Polling started');
      this.#retries = 1;
      this.#fetchSchema();
    }, delayInSeconds * 1000);
  };

  forcePull = () => {
    if (this.#timeout) {
      clearTimeout(this.#timeout);
      this.#timeout = undefined;
    }
    this.#retries = 1;
    this.#fetchSchema();
  };

  stop = () => {
    this.#log('info', 'Polling stopped');
    if (this.#timeout) {
      clearTimeout(this.#timeout);
      this.#timeout = undefined;
    }
    return fakePromise();
  };

  #fetchSchema = async () => {
    const { retryDelaySeconds = 0, minDelaySeconds = 0 } = this.options;
    try {
      this.#log('info', 'Fetch schema from managed federation');
      const result = await getStitchedSchemaFromManagedFederation({
        ...this.options,
        loggerByMessageLevel: {
          ERROR: (message) => {
            const logEvent: SupergraphSchemaManagerLogEvent = new CustomEvent(
              'log',
              {
                detail: { source: 'uplink', level: 'error', message },
              },
            );
            this.dispatchEvent(logEvent);
          },
          WARN: (message) => {
            const logEvent: SupergraphSchemaManagerLogEvent = new CustomEvent(
              'log',
              {
                detail: { source: 'uplink', level: 'warn', message },
              },
            );
            this.dispatchEvent(logEvent);
          },
          INFO: (message) => {
            const logEvent: SupergraphSchemaManagerLogEvent = new CustomEvent(
              'log',
              {
                detail: { source: 'uplink', level: 'info', message },
              },
            );
            this.dispatchEvent(logEvent);
          },
        },
        lastSeenId: this.#lastSeenId,
      });

      if ('error' in result) {
        this.#lastSeenId = undefined; // When an error is reported, Apollo doesn't provide an id.
        const errorEvent: SupergraphSchemaManagerErrorEvent = new CustomEvent(
          'error',
          {
            detail: {
              error: result.error,
              minDelaySeconds: result.minDelaySeconds,
            },
          },
        );
        this.dispatchEvent(errorEvent);
        this.#retryOnError(
          result.error,
          Math.max(result.minDelaySeconds, minDelaySeconds),
        );
        return;
      }

      if ('schema' in result) {
        this.#lastSeenId = result.id;
        this.schema = result.schema;
        const schemaEvent: SupergraphSchemaManagerSchemaEvent = new CustomEvent(
          'schema',
          {
            detail: {
              schema: result.schema,
              supergraphSdl: result.supergraphSdl,
            },
          },
        );
        this.dispatchEvent(schemaEvent);
        this.#log('info', 'Supergraph successfully updated');
      } else {
        this.#log('info', 'Supergraph is up to date');
      }

      this.#retries = 1;
      const delay = Math.max(result.minDelaySeconds, minDelaySeconds);
      this.#timeout = setTimeout(this.#fetchSchema, delay * 1000);
      this.#log('info', `Next pull in ${delay.toFixed(1)} seconds`);
    } catch (e) {
      this.#retryOnError(e as FetchError['error'], retryDelaySeconds ?? 0);
      const errorEvent: SupergraphSchemaManagerErrorEvent = new CustomEvent(
        'error',
        {
          detail: e as Error,
        },
      );
      this.dispatchEvent(errorEvent);
    }
  };

  #retryOnError = (error: FetchError['error'], delayInSeconds: number) => {
    const { maxRetries = 3 } = this.options;
    const message = error?.message;
    this.#log(
      'error',
      `Failed to pull schema from managed federation: ${message}`,
    );

    if (this.#retries >= maxRetries) {
      this.#timeout = undefined;
      this.#log('error', 'Max retries reached, giving up');
      const failureEvent: SupergraphSchemaManagerFailureEvent = new CustomEvent(
        'failure',
        {
          detail: { error, delayInSeconds },
        },
      );
      this.dispatchEvent(failureEvent);
      return;
    }

    this.#retries++;

    this.#log(
      'info',
      `Retrying (${this.#retries}/${maxRetries})${delayInSeconds ? ` in ${delayInSeconds.toFixed(1)} seconds` : ''}`,
    );
    this.#timeout = setTimeout(this.#fetchSchema, delayInSeconds * 1000);
  };

  #log = (level: 'error' | 'warn' | 'info', message: string) => {
    const logEvent: SupergraphSchemaManagerLogEvent = new CustomEvent('log', {
      detail: {
        source: 'manager',
        level,
        message,
      },
    });
    this.dispatchEvent(logEvent);
  };

  [DisposableSymbols.dispose]() {
    return this.stop();
  }
}

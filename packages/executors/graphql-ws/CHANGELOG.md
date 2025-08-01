# @graphql-tools/executor-graphql-ws

## 2.0.7

### Patch Changes

- [#1358](https://github.com/graphql-hive/gateway/pull/1358) [`8e37851`](https://github.com/graphql-hive/gateway/commit/8e3785194d97edbe82c7fce316104b81bb0362f1) Thanks [@dependabot](https://github.com/apps/dependabot)! - dependencies updates:
  - Updated dependency [`@graphql-tools/utils@^10.9.1` ↗︎](https://www.npmjs.com/package/@graphql-tools/utils/v/10.9.1) (from `^10.9.0`, in `dependencies`)

- Updated dependencies [[`8e37851`](https://github.com/graphql-hive/gateway/commit/8e3785194d97edbe82c7fce316104b81bb0362f1)]:
  - @graphql-tools/executor-common@0.0.6

## 2.0.6

### Patch Changes

- [#1321](https://github.com/graphql-hive/gateway/pull/1321) [`6215001`](https://github.com/graphql-hive/gateway/commit/6215001b1d650ad865331661532bcc4f7bad6b40) Thanks [@dependabot](https://github.com/apps/dependabot)! - dependencies updates:
  - Updated dependency [`ws@^8.18.3` ↗︎](https://www.npmjs.com/package/ws/v/8.18.3) (from `^8.17.1`, in `dependencies`)

- [#1329](https://github.com/graphql-hive/gateway/pull/1329) [`ce99e43`](https://github.com/graphql-hive/gateway/commit/ce99e43b9fec43c665836bd3a282ce6d4302481d) Thanks [@dependabot](https://github.com/apps/dependabot)! - dependencies updates:
  - Updated dependency [`graphql-ws@^6.0.6` ↗︎](https://www.npmjs.com/package/graphql-ws/v/6.0.6) (from `^6.0.3`, in `dependencies`)

- [#1344](https://github.com/graphql-hive/gateway/pull/1344) [`a71236d`](https://github.com/graphql-hive/gateway/commit/a71236d6ba356741bc85fe27757bea45576dcf1a) Thanks [@dependabot](https://github.com/apps/dependabot)! - dependencies updates:
  - Updated dependency [`@graphql-tools/utils@^10.9.0` ↗︎](https://www.npmjs.com/package/@graphql-tools/utils/v/10.9.0) (from `^10.8.1`, in `dependencies`)

- Updated dependencies [[`6215001`](https://github.com/graphql-hive/gateway/commit/6215001b1d650ad865331661532bcc4f7bad6b40), [`a71236d`](https://github.com/graphql-hive/gateway/commit/a71236d6ba356741bc85fe27757bea45576dcf1a)]:
  - @graphql-tools/executor-common@0.0.5

## 2.0.5

### Patch Changes

- [#862](https://github.com/graphql-hive/gateway/pull/862) [`278618a`](https://github.com/graphql-hive/gateway/commit/278618a1383a01016041ce0a40adec8803c62448) Thanks [@ardatan](https://github.com/ardatan)! - Use signal.addEventListener instead of leaking `registerAbortSignalListener` helper

## 2.0.4

### Patch Changes

- [#727](https://github.com/graphql-hive/gateway/pull/727) [`c54a080`](https://github.com/graphql-hive/gateway/commit/c54a080b8b9c477ed55dd7c23fc8fcae9139bec8) Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:
  - Updated dependency [`@whatwg-node/disposablestack@^0.0.6` ↗︎](https://www.npmjs.com/package/@whatwg-node/disposablestack/v/0.0.6) (from `^0.0.5`, in `dependencies`)

- Updated dependencies [[`e393337`](https://github.com/graphql-hive/gateway/commit/e393337ecb40beffb79748b19b5aa8f2fd9197b7)]:
  - @graphql-tools/executor-common@0.0.4

## 2.0.3

### Patch Changes

- Updated dependencies [[`a289faa`](https://github.com/graphql-hive/gateway/commit/a289faae1469eb46f1458be341d21909fe5f8f8f)]:
  - @graphql-tools/executor-common@0.0.3

## 2.0.2

### Patch Changes

- [#620](https://github.com/graphql-hive/gateway/pull/620) [`d72209a`](https://github.com/graphql-hive/gateway/commit/d72209ad82ec53689f93ce5d81bfa52493919ad9) Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:
  - Updated dependency [`@graphql-tools/utils@^10.8.1` ↗︎](https://www.npmjs.com/package/@graphql-tools/utils/v/10.8.1) (from `^10.7.0`, in `dependencies`)

- Updated dependencies [[`d72209a`](https://github.com/graphql-hive/gateway/commit/d72209ad82ec53689f93ce5d81bfa52493919ad9)]:
  - @graphql-tools/executor-common@0.0.2

## 2.0.1

### Patch Changes

- [#591](https://github.com/graphql-hive/gateway/pull/591) [`7d42160`](https://github.com/graphql-hive/gateway/commit/7d42160c31a10efbc680826704410fc1a33fb97c) Thanks [@ardatan](https://github.com/ardatan)! - Fix the regression preventing users from passing custom `lazy` and `lazyCloseTimeout` options

## 2.0.0

### Major Changes

- [#481](https://github.com/graphql-hive/gateway/pull/481) [`0b13cb4`](https://github.com/graphql-hive/gateway/commit/0b13cb472305edd01cdbd964a71995831797305e) Thanks [@enisdenjo](https://github.com/enisdenjo)! - Executor options don't exist graphql-ws dependency options

  Removing the dependency on the types. Some options are still exposed, but if you want to further customise the graphql-ws client, you should pass your own instance of the client instead.

  ```ts
  import { buildGraphQLWSExecutor } from '@graphql-tools/executor-graphql-ws';
  import { createClient } from 'graphql-ws';
  import { options } from './my-graphql-ws-client-options';

  const executor = buildGraphQLWSExecutor(
    createClient({
      url: 'ws://localhost:4000/graphql',
      ...options,
    }),
  );
  ```

- [#481](https://github.com/graphql-hive/gateway/pull/481) [`0b13cb4`](https://github.com/graphql-hive/gateway/commit/0b13cb472305edd01cdbd964a71995831797305e) Thanks [@enisdenjo](https://github.com/enisdenjo)! - Upgrade graphql-ws to v6

  If you have a custom graphql-ws configuration when building the executor with `buildGraphQLWSExecutor`, you will have to migrate the graphql-ws side to v6. [Please consult the changelog of graphql-ws.](https://github.com/enisdenjo/graphql-ws/releases/tag/v6.0.0)

### Minor Changes

- [#481](https://github.com/graphql-hive/gateway/pull/481) [`0b13cb4`](https://github.com/graphql-hive/gateway/commit/0b13cb472305edd01cdbd964a71995831797305e) Thanks [@enisdenjo](https://github.com/enisdenjo)! - Export GraphQLWSExecutorOptions type

### Patch Changes

- [#481](https://github.com/graphql-hive/gateway/pull/481) [`0b13cb4`](https://github.com/graphql-hive/gateway/commit/0b13cb472305edd01cdbd964a71995831797305e) Thanks [@enisdenjo](https://github.com/enisdenjo)! - dependencies updates:
  - Updated dependency [`graphql-ws@^6.0.3` ↗︎](https://www.npmjs.com/package/graphql-ws/v/6.0.3) (from `^5.14.0`, in `dependencies`)

## 1.3.7

### Patch Changes

- [#381](https://github.com/graphql-hive/gateway/pull/381) [`55eb1b4`](https://github.com/graphql-hive/gateway/commit/55eb1b4d14aec7b3e6c7bcf9f596bc01192d022c) Thanks [@ardatan](https://github.com/ardatan)! - dependencies updates:
  - Added dependency [`@graphql-tools/executor-common@workspace:^` ↗︎](https://www.npmjs.com/package/@graphql-tools/executor-common/v/workspace:^) (to `dependencies`)

- [#381](https://github.com/graphql-hive/gateway/pull/381) [`55eb1b4`](https://github.com/graphql-hive/gateway/commit/55eb1b4d14aec7b3e6c7bcf9f596bc01192d022c) Thanks [@ardatan](https://github.com/ardatan)! - This is a bugfix with some internal changes, no user action is needed. This bugfix and improvement is done to improve the stability of some components of the gateway;

  Like HMAC Upstream Signature plugin, different components of the gateway were using different ways of serializing the execution request.
  Some of them were ignoring `variables` if it is empty, some of not, this was causing the signature generation to be different for the same query.
  For example, it was working as expected in Proxy mode, but not working as expected in Federation Gateway mode.

  With this change, now we have a shared helper to serialize the upstream execution request with a memoized `print` function for query AST etc to have a consistent serialization so consistent signature generation for HMAC.

  For example instead of using `print`, you should use `defaultPrintFn` that memoizes `print` operation and also used the string version of it parsed before by Envelop/Yoga.

  ```diff
  -import { print } from 'graphql';
  -const query = print(parsedQuery);
  +import { defaultPrintFn } from '@graphql-tools/executor-common';
  +const query = defaultPrintFn(parsedQuery);
  ```

  Or instead of creating objects from `ExecutionRequest`, use `serializeExecutionRequest` helper.

  ```diff
  -const serializedRequest = {
  -  query: print(executionRequest.document),
  -  variables: executionRequest.variables,
  -  operationName: executionRequest.operationName,
  -  extensions: executionRequest.extensions,
  -};
  +import { serializeExecutionRequest } from '@graphql-tools/executor-common';
  +const serializedRequest = serializeExecutionRequest(executionRequest);
  ```

- Updated dependencies [[`55eb1b4`](https://github.com/graphql-hive/gateway/commit/55eb1b4d14aec7b3e6c7bcf9f596bc01192d022c)]:
  - @graphql-tools/executor-common@0.0.1

## 1.3.6

### Patch Changes

- [#373](https://github.com/graphql-hive/gateway/pull/373) [`e606975`](https://github.com/graphql-hive/gateway/commit/e60697593290255fb9ac407e591ae3e8cb752df2) Thanks [@ardatan](https://github.com/ardatan)! - dependencies updates:
  - Updated dependency [`@graphql-tools/utils@^10.7.0` ↗︎](https://www.npmjs.com/package/@graphql-tools/utils/v/10.7.0) (from `^10.6.2`, in `dependencies`)

## 1.3.5

### Patch Changes

- [#291](https://github.com/graphql-hive/gateway/pull/291) [`34d1224`](https://github.com/graphql-hive/gateway/commit/34d12249ead65b8277df976f6318dca757df1151) Thanks [@ardatan](https://github.com/ardatan)! - dependencies updates:
  - Updated dependency [`tslib@^2.8.1` ↗︎](https://www.npmjs.com/package/tslib/v/2.8.1) (from `^2.4.0`, in `dependencies`)

## 1.3.4

### Patch Changes

- [#269](https://github.com/graphql-hive/gateway/pull/269) [`cdca511`](https://github.com/graphql-hive/gateway/commit/cdca5116ce30c2bfced1130c9fbead67280af9d4) Thanks [@ardatan](https://github.com/ardatan)! - dependencies updates:
  - Updated dependency [`@graphql-tools/utils@^10.6.2` ↗︎](https://www.npmjs.com/package/@graphql-tools/utils/v/10.6.2) (from `^10.6.0`, in `dependencies`)

## 1.3.3

### Patch Changes

- [#164](https://github.com/graphql-hive/gateway/pull/164) [`310613d`](https://github.com/graphql-hive/gateway/commit/310613d68d1df3e2bceafbd0730084a4c83527bf) Thanks [@ardatan](https://github.com/ardatan)! - dependencies updates:
  - Updated dependency [`@graphql-tools/utils@^10.6.0` ↗︎](https://www.npmjs.com/package/@graphql-tools/utils/v/10.6.0) (from `^10.5.6`, in `dependencies`)

## 1.3.2

### Patch Changes

- Updated dependencies
  [[`dc5043b`](https://github.com/ardatan/graphql-tools/commit/dc5043bb7c9afaca907c242eb6bf65e8019d79c4)]:
  - @graphql-tools/utils@10.5.6

## 1.3.1

### Patch Changes

- Updated dependencies
  [[`cf2ce5e`](https://github.com/ardatan/graphql-tools/commit/cf2ce5ed4773087cc324599f2812f4fb91398b21)]:
  - @graphql-tools/utils@10.5.5

## 1.3.0

### Minor Changes

- [#6540](https://github.com/ardatan/graphql-tools/pull/6540)
  [`1e085bd`](https://github.com/ardatan/graphql-tools/commit/1e085bd8516a692e91afe3f1b95b9f5740485693)
  Thanks [@EmrysMyrddin](https://github.com/EmrysMyrddin)! - Allow to configure headers of the
  WebSocket sent with the upgrade request.

## 1.2.1

### Patch Changes

- [#6536](https://github.com/ardatan/graphql-tools/pull/6536)
  [`3facde0`](https://github.com/ardatan/graphql-tools/commit/3facde02724add648a00feafaaee6a76a443d25d)
  Thanks [@EmrysMyrddin](https://github.com/EmrysMyrddin)! - `webSocketImpl` and `lazy` options were
  ignored and overriden by default values. This is no longer the case and it's now possible to
  change the `WebSocket` implementation.

## 1.2.0

### Minor Changes

- [#6323](https://github.com/ardatan/graphql-tools/pull/6323)
  [`cacf20f`](https://github.com/ardatan/graphql-tools/commit/cacf20f8dbe4ec5dce0d5fd87e37cf69ef9b177e)
  Thanks [@ardatan](https://github.com/ardatan)! - Implement Symbol.dispose or Symbol.asyncDispose
  to make \`Executor\`s \`Disposable\`

### Patch Changes

- Updated dependencies
  [[`cacf20f`](https://github.com/ardatan/graphql-tools/commit/cacf20f8dbe4ec5dce0d5fd87e37cf69ef9b177e)]:
  - @graphql-tools/utils@10.3.0

## 1.1.2

### Patch Changes

- [#5913](https://github.com/ardatan/graphql-tools/pull/5913)
  [`83c0af0`](https://github.com/ardatan/graphql-tools/commit/83c0af0713ff2ce55ccfb97a1810ecfecfeab703)
  Thanks [@enisdenjo](https://github.com/enisdenjo)! - dependencies updates:
  - Updated dependency
    [`@graphql-tools/utils@^10.0.13` ↗︎](https://www.npmjs.com/package/@graphql-tools/utils/v/10.0.13)
    (from `^10.0.2`, in `dependencies`)

## 1.1.1

### Patch Changes

- [#5666](https://github.com/ardatan/graphql-tools/pull/5666)
  [`6269314d`](https://github.com/ardatan/graphql-tools/commit/6269314dfe2ae7b9074096a2831e39c9ee17be0a)
  Thanks [@ThomasMoritz](https://github.com/ThomasMoritz)! - changed the order how the configuration
  is given into the graphql-wsclient and prevent the overwriting of the parameters

## 1.1.0

### Minor Changes

- [#4781](https://github.com/ardatan/graphql-tools/pull/4781)
  [`104921ff`](https://github.com/ardatan/graphql-tools/commit/104921ffc066bde737d4cb36a3bbd1b3b2ad4094)
  Thanks [@enisdenjo](https://github.com/enisdenjo)! - Read and use `connectionParams` from
  operation extensions

## 1.0.2

### Patch Changes

- [#5396](https://github.com/ardatan/graphql-tools/pull/5396)
  [`bb8f169e`](https://github.com/ardatan/graphql-tools/commit/bb8f169e21a8a7002b66d3bc6e4e4b40cc2a5f5c)
  Thanks [@ardatan](https://github.com/ardatan)! - Simplify GraphQL WS executor

- Updated dependencies
  [[`bb8f169e`](https://github.com/ardatan/graphql-tools/commit/bb8f169e21a8a7002b66d3bc6e4e4b40cc2a5f5c),
  [`bb8f169e`](https://github.com/ardatan/graphql-tools/commit/bb8f169e21a8a7002b66d3bc6e4e4b40cc2a5f5c)]:
  - @graphql-tools/utils@10.0.2

## 1.0.1

### Patch Changes

- [#5374](https://github.com/ardatan/graphql-tools/pull/5374)
  [`88a7de96`](https://github.com/ardatan/graphql-tools/commit/88a7de96c7766d94f9ac0adbe54523e585f8566c)
  Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:
  - Updated dependency [`graphql-ws@5.14.0` ↗︎](https://www.npmjs.com/package/graphql-ws/v/5.14.0)
    (from `5.13.1`, in `dependencies`)

## 1.0.0

### Major Changes

- [#5274](https://github.com/ardatan/graphql-tools/pull/5274)
  [`944a68e8`](https://github.com/ardatan/graphql-tools/commit/944a68e8becf9c86b4c97fd17c372d98a285b955)
  Thanks [@ardatan](https://github.com/ardatan)! - Drop Node 14 support. Require Node.js `>= 16`

### Patch Changes

- [#5272](https://github.com/ardatan/graphql-tools/pull/5272)
  [`3a870139`](https://github.com/ardatan/graphql-tools/commit/3a870139e13236f3ecc744666dd1c6fdb9f6be59)
  Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:
  - Updated dependency [`graphql-ws@5.13.0` ↗︎](https://www.npmjs.com/package/graphql-ws/v/5.13.0)
    (from `5.12.1`, in `dependencies`)

- [#5277](https://github.com/ardatan/graphql-tools/pull/5277)
  [`853db708`](https://github.com/ardatan/graphql-tools/commit/853db70824fc86350a61bae415b7965fa2c06355)
  Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:
  - Updated dependency [`graphql-ws@5.13.1` ↗︎](https://www.npmjs.com/package/graphql-ws/v/5.13.1)
    (from `5.13.0`, in `dependencies`)
- Updated dependencies
  [[`944a68e8`](https://github.com/ardatan/graphql-tools/commit/944a68e8becf9c86b4c97fd17c372d98a285b955),
  [`944a68e8`](https://github.com/ardatan/graphql-tools/commit/944a68e8becf9c86b4c97fd17c372d98a285b955)]:
  - @graphql-tools/utils@10.0.0

## 0.0.14

### Patch Changes

- [`1c95368a`](https://github.com/ardatan/graphql-tools/commit/1c95368aea868be537d956ba5e994cde58dfee41)
  Thanks [@ardatan](https://github.com/ardatan)! - Use ranged versions for dependencies

## 0.0.13

### Patch Changes

- [#5112](https://github.com/ardatan/graphql-tools/pull/5112)
  [`828fbf93`](https://github.com/ardatan/graphql-tools/commit/828fbf93ff317d00577c9a94402736bac5f4be39)
  Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:
  - Updated dependency [`ws@8.13.0` ↗︎](https://www.npmjs.com/package/ws/v/8.13.0) (from `8.12.1`,
    in `dependencies`)
  - Updated dependency [`graphql-ws@5.12.1` ↗︎](https://www.npmjs.com/package/graphql-ws/v/5.12.1)
    (from `5.12.0`, in `dependencies`)

## 0.0.12

### Patch Changes

- [#5096](https://github.com/ardatan/graphql-tools/pull/5096)
  [`a5073e85`](https://github.com/ardatan/graphql-tools/commit/a5073e85124fa90db9dda606ed70a4a560d95737)
  Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:
  - Updated dependency [`graphql-ws@5.12.0` ↗︎](https://www.npmjs.com/package/graphql-ws/v/5.12.0)
    (from `5.11.3`, in `dependencies`)

## 0.0.11

### Patch Changes

- [#5058](https://github.com/ardatan/graphql-tools/pull/5058)
  [`1298727c`](https://github.com/ardatan/graphql-tools/commit/1298727c629b4d535b023dcf920639ae43571692)
  Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:
  - Updated dependency [`ws@8.12.1` ↗︎](https://www.npmjs.com/package/ws/v/8.12.1) (from `8.12.0`,
    in `dependencies`)

## 0.0.10

### Patch Changes

- Updated dependencies
  [[`b5c8f640`](https://github.com/ardatan/graphql-tools/commit/b5c8f6407b74466ed0d2989000458cb59239e9af)]:
  - @graphql-tools/utils@9.2.1

## 0.0.9

### Patch Changes

- [#5020](https://github.com/ardatan/graphql-tools/pull/5020)
  [`d104ce50`](https://github.com/ardatan/graphql-tools/commit/d104ce50a9ee18e92ffc92c39ff87e1cffc2aa19)
  Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:
  - Updated dependency [`graphql-ws@5.11.3` ↗︎](https://www.npmjs.com/package/graphql-ws/v/5.11.3)
    (from `5.11.2`, in `dependencies`)

## 0.0.8

### Patch Changes

- Updated dependencies
  [[`a94217e9`](https://github.com/ardatan/graphql-tools/commit/a94217e920c5d6237471ab6ad4d96cf230984177),
  [`62d074be`](https://github.com/ardatan/graphql-tools/commit/62d074be48779b1e096e056ca1233822c421dc99)]:
  - @graphql-tools/utils@9.2.0

## 0.0.7

### Patch Changes

- [`1c291f33`](https://github.com/ardatan/graphql-tools/commit/1c291f33ba5e42126b5335530c1ac4cd6b3eaf6a)
  Thanks [@ardatan](https://github.com/ardatan)! - Support regular queries and mutations in WS
  Executor

## 0.0.6

### Patch Changes

- [#4952](https://github.com/ardatan/graphql-tools/pull/4952)
  [`1c4853cb`](https://github.com/ardatan/graphql-tools/commit/1c4853cb8563d83c0d862d3c11257c48c7d1469c)
  Thanks [@renovate](https://github.com/apps/renovate)! - dependencies updates:
  - Updated dependency [`ws@8.12.0` ↗︎](https://www.npmjs.com/package/ws/v/8.12.0) (from `8.11.0`,
    in `dependencies`)
- Updated dependencies
  [[`e3ec35ed`](https://github.com/ardatan/graphql-tools/commit/e3ec35ed27d4a329739c8da6be06ce74c8f25591)]:
  - @graphql-tools/utils@9.1.4

## 0.0.5

### Patch Changes

- Updated dependencies
  [[`904fe770`](https://github.com/ardatan/graphql-tools/commit/904fe770a355ee3d79464c3bbf0375d2dcd64759)]:
  - @graphql-tools/utils@9.1.3

## 0.0.4

### Patch Changes

- Updated dependencies
  [[`13c24883`](https://github.com/ardatan/graphql-tools/commit/13c24883004d5330f7402cb20566e37535c5729b)]:
  - @graphql-tools/utils@9.1.2

## 0.0.3

### Patch Changes

- Updated dependencies
  [[`7411a5e7`](https://github.com/ardatan/graphql-tools/commit/7411a5e71a8138d9ccfe907b1fb01e62fcbb0cdb)]:
  - @graphql-tools/utils@9.1.1

## 0.0.2

### Patch Changes

- [`e2fc041e`](https://github.com/ardatan/graphql-tools/commit/e2fc041e6f751c70efc20e8a02cbf88da0b905d2)
  Thanks [@ardatan](https://github.com/ardatan)! - Improve typings

## 0.0.1

### Patch Changes

- [#4829](https://github.com/ardatan/graphql-tools/pull/4829)
  [`61812ccb`](https://github.com/ardatan/graphql-tools/commit/61812ccb97d6e179e74d72661dd0736f6ca0a7ff)
  Thanks [@ardatan](https://github.com/ardatan)! - Break down UrlLoader into different pieces

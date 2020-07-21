import { possibleTypes } from 'generated/fragments.json'
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  NormalizedCacheObject,
  InMemoryCache,
} from '@apollo/client'
import { RetryLink } from '@apollo/client/link/retry'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { persistCache } from 'apollo-cache-persist'
import { mergeDeep } from '@apollo/client/utilities/common/mergeDeep'
import isLoggedInTypePolicies from 'components/IsLoggedIn/typePolicies'
import cartIdtypePolicies from 'components/CartId/typePolicies'
import cartTypePolicies from 'components/Cart/typePolicies'
import { deferLink } from './deferLink'

let globalApolloClient: ApolloClient<NormalizedCacheObject> | undefined

export function createApolloClient(
  initialState: NormalizedCacheObject = {},
): ApolloClient<NormalizedCacheObject> {
  let link: ApolloLink

  if (typeof window === 'undefined') {
    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        )
      if (networkError) console.log(`[Network error]: ${networkError}`)
    })

    link = deferLink(async () => {
      const { mesh } = await import('node/meshSchema')
      const { SchemaLink } = await import('@apollo/client/link/schema')
      const { schema } = await mesh
      return errorLink.concat(new SchemaLink({ schema }))
    })

    const cache = new InMemoryCache({
      possibleTypes,
    }).restore(initialState)

    return new ApolloClient({
      link,
      cache,
      connectToDevTools: true,
    })
  }

  const authLink = setContext((_, { headers }) => {
    const token =
      typeof window !== 'undefined' ? window.localStorage.getItem('customer_token') : null
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    }
  })

  link = ApolloLink.from([
    // new MutationQueueLink() as ApolloLink,
    new RetryLink(),
    authLink,
    new HttpLink({
      uri: '/api/graphql',
      credentials: 'same-origin',
    }),
  ])

  // todo(paales): Make sure the typePolicies are configured instead of hardcoded here.
  // What other type policies could we need?
  // Currency?
  // Customer Group?
  const cache = new InMemoryCache({
    possibleTypes,
    typePolicies: mergeDeep(cartIdtypePolicies, isLoggedInTypePolicies, cartTypePolicies),
  }).restore(initialState)

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  persistCache({ cache, storage: window.localStorage })

  return new ApolloClient({ link, cache })
}

export default function apolloClient(
  initialState: NormalizedCacheObject = {},
): ApolloClient<NormalizedCacheObject> {
  if (typeof window === 'undefined') {
    return createApolloClient(initialState)
  }
  // Reuse client on the client-side
  if (!globalApolloClient) {
    globalApolloClient = createApolloClient(initialState)
  }

  return globalApolloClient
}

import { TypePolicies, FieldPolicy, FieldReadFunction } from '@apollo/client'
import { CustomerTokenDocument } from 'generated/apollo'

const revokeCustomerToken: FieldPolicy<GQLMutation['revokeCustomerToken']> = {
  merge(_existing, incoming, options) {
    options.cache.evict({ id: 'Cart', broadcast: true })
    options.cache.evict({ id: 'Customer', broadcast: true })
    options.cache.evict({ id: 'CustomerToken', broadcast: true })
    return incoming
  },
}

const generateCustomerToken: FieldPolicy<GQLMutation['generateCustomerToken']> = {
  keyArgs: () => '',
  merge(_existing, incoming, options) {
    if (!options.isReference(incoming)) return incoming
    options.cache.writeQuery<GQLCustomerTokenQuery, GQLCustomerTokenQueryVariables>({
      query: CustomerTokenDocument,
      broadcast: true,
      data: {
        customerToken: {
          __typename: 'CustomerToken',
          token: options.readField('token', incoming),
          createdAt: new Date().toUTCString(),
        },
      },
    })
    return incoming
  },
}

const customer: FieldReadFunction<GQLQuery['customer']> = (incoming, options) => {
  if (!options.canRead(incoming)) return null
  return incoming
}

const typePolicies: TypePolicies = {
  Query: { fields: { customer } },
  Mutation: { fields: { generateCustomerToken, revokeCustomerToken } },
  Customer: { keyFields: (object) => object.__typename },
  CustomerToken: { keyFields: (object) => object.__typename },
}

export default typePolicies

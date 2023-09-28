import { useMutation, useApolloClient, useQuery } from '@graphcommerce/graphql'
import { useCustomerSession } from '@graphcommerce/magento-customer'
import { nonNullable } from '@graphcommerce/next-ui'
import { useEffect } from 'react'
import { AddProductToWishlistDocument } from '../queries/AddProductToWishlist.gql'
import { GuestWishlistDocument } from '../queries/GuestWishlist.gql'

/** Merge guest wishlist items to customer session upon login */
export function useMergeGuestWishlistWithCustomer() {
  const { loggedIn } = useCustomerSession()
  const { cache } = useApolloClient()

  const wishlist = useQuery(GuestWishlistDocument).data?.customer?.wishlists?.[0]?.items_v2?.items

  const [addWishlistItem] = useMutation(AddProductToWishlistDocument)

  useEffect(() => {
    if (!loggedIn || !wishlist || wishlist.length === 0) return

    const clearGuestList = () => cache.evict({ fieldName: 'customer' })
    if (wishlist?.length === 0) {
      clearGuestList()
    } else {
      const input = wishlist.map((item) => ({
        sku: item?.product?.sku || '',
        selected_options:
          item?.__typename === 'ConfigurableWishlistItem'
            ? item?.configurable_options
                ?.filter(nonNullable)
                .map((option) => option?.configurable_product_option_value_uid)
            : [],
        quantity: 1,
      }))
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      if (input.length) addWishlistItem({ variables: { input } }).then(clearGuestList)
    }
  }, [addWishlistItem, cache, loggedIn, wishlist])
}

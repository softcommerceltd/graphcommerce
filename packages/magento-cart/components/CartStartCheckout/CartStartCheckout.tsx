import { Money } from '@graphcommerce/magento-store'
import {
  iconChevronRight,
  IconSvg,
  extendableComponent,
  useStorefrontConfig,
} from '@graphcommerce/next-ui'
import { Trans } from '@lingui/react'
import { Box, Button, ButtonProps, SxProps, Theme } from '@mui/material'
import React from 'react'
import { CartStartCheckoutFragment } from './CartStartCheckout.gql'
import { useCustomerSession } from '@graphcommerce/magento-customer'

export type CartStartCheckoutProps = {
  children?: React.ReactNode
  sx?: SxProps<Theme>
  buttonProps?: ButtonProps<'button'>
  disabled?: boolean
  cart?: CartStartCheckoutFragment | null | undefined
  onStart?: (
    e: React.MouseEvent<HTMLButtonElement>,
    cart: CartStartCheckoutFragment | null | undefined,
  ) => void
}

const name = 'CartStartCheckout' as const
const parts = [
  'checkoutButtonContainer',
  'checkoutButton',
  'checkoutButtonTotal',
  'checkoutMoney',
] as const
const { classes } = extendableComponent(name, parts)

export function CartStartCheckout(props: CartStartCheckoutProps) {
  const {
    children,
    onStart,
    buttonProps: { onClick, ...buttonProps } = {},
    disabled,
    sx = [],
    cart,
  } = props

  const { signInMode } = useStorefrontConfig()
  const { loggedIn } = useCustomerSession()
  const disableGuestCheckout = signInMode === 'DISABLE_GUEST_CHECKOUT' && !loggedIn

  const hasTotals = (cart.prices?.grand_total?.value ?? 0) > 0
  const hasErrors = cart.items?.some((item) => (item?.errors?.length ?? 0) > 0)


  return (
    <Box
      className={classes.checkoutButtonContainer}
      sx={[
        (theme) => ({ textAlign: 'center', my: theme.spacings.md }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Button
        href={disableGuestCheckout ? '/account/signin' : '/checkout'}
        id='cart-start-checkout'
        variant='pill'
        color='secondary'
        size='large'
        className={classes.checkoutButton}
        endIcon={<IconSvg src={iconChevronRight} />}
        onClick={(e) => {
          onClick?.(e)
          onStart?.(e, cart)
          return onClick?.(e)
        }}
        disabled={disabled || !hasTotals || hasErrors}
        {...buttonProps}
      >
        <Box
          component='span'
          className={classes.checkoutButtonTotal}
          sx={(theme) => ({
            paddingRight: theme.spacings.xxs,
            '& ~ span.MuiButton-endIcon': { marginLeft: '6px' },
          })}
        >
          <Trans id='Start Checkout' />
        </Box>{' '}
        {hasTotals && (
          <span className={classes.checkoutMoney}>
            <Money {...cart?.prices?.grand_total} />
          </span>
        )}
      </Button>

      {children}

      {hasErrors && (
        <Box sx={(theme) => ({ color: 'error.main', mt: theme.spacings.xs })}>
          <Trans id='Some items in your cart contain errors, please update or remove them, then try again.' />
        </Box>
      )}
    </Box>
  )
}

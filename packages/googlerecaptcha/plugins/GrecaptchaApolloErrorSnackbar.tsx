import type { ApolloErrorSnackbarProps } from '@graphcommerce/ecommerce-ui'
import type { PluginConfig, PluginProps } from '@graphcommerce/next-config'
import { useGoogleRecaptcha } from '../hooks/useGoogleRecaptcha'

export const config: PluginConfig = {
  type: 'component',
  module: '@graphcommerce/ecommerce-ui',
  ifConfig: 'googleRecaptchaKey',
}

export function ApolloErrorSnackbar(props: PluginProps<ApolloErrorSnackbarProps>) {
  const { Prev, ...rest } = props
  useGoogleRecaptcha()
  return <Prev {...rest} />
}

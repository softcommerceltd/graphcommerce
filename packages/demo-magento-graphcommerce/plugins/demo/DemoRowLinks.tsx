import type { PluginConfig, PluginProps } from '@graphcommerce/next-config'
import type { RowLinksProps } from '@graphcommerce/next-ui'
import { responsiveVal } from '@graphcommerce/next-ui'

export const config: PluginConfig = {
  type: 'component',
  module: '@graphcommerce/next-ui',
  ifConfig: 'demoMode',
}

export function RowLinks(props: PluginProps<RowLinksProps>) {
  const { Prev, children, title, maxWidth, sx, ...rest } = props
  if (title !== 'Hot & New' && title !== 'Heet & Nieuw')
    return (
      <Prev {...rest} title={title} maxWidth={maxWidth} sx={sx}>
        {children}
      </Prev>
    )
  return (
    <Prev
      {...rest}
      maxWidth={false}
      title={title}
      sx={[
        (theme) => ({
          display: 'flex',
          flexDirection: 'column',
          '& .RowLinks-title': {
            order: 1,
          },
          '& .RowLinks-scrollerWrapper': {
            order: 2,
          },
          '& .RowLinks-copy': {
            order: 3,
          },
          mt: `calc(${theme.spacings.xl} * -1)`,
          '& .Scroller-root > .MuiButtonBase-root': {
            display: 'grid',
            gridAutoFlow: 'column',
            textAlign: 'left',
            alignItems: 'start',
            justifyContent: 'start',
            rowGap: 3,
            '& > .MuiBox-root': {
              color: '#fff',
              width: responsiveVal(260, 400),
              maxWidth: responsiveVal(260, 400),
              px: theme.spacings.md,
              gridArea: '1 / 1',
              zIndex: 2,
              mixBlendMode: 'difference',
            },
            '&:has(video) .MuiBox-root': {
              mixBlendMode: 'unset',
            },
            '& picture, & video': {
              gridArea: '1 / 1',
            },
            '& video': {
              height: '100%',
              objectFit: 'cover',
              aspectRatio: '4 / 6',
            },
            '& h3': {
              mt: theme.spacings.md,
              typography: 'body1',
              mb: 1,
            },
            '& p': {
              typography: 'h4',
            },
            borderRadius: responsiveVal(theme.shape.borderRadius * 3, theme.shape.borderRadius * 4),
            overflow: 'hidden',
            '& img, & video': {
              filter: 'none',
              willChange: 'unset',
              width: responsiveVal(260, 400),
              maxWidth: responsiveVal(260, 400),
            },
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Prev>
  )
}

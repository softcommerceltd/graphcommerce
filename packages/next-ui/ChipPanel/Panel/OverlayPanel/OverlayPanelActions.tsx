import { i18n } from '@lingui/core'
import { Trans } from '@lingui/react'
import { Box, ChipProps, TextField } from '@mui/material'
import React, { useState, ReactElement, useMemo } from 'react'
import { LinkOrButton } from '../../../Button'
import { IconSvg } from '../../../IconSvg'
import { LayoutTitle } from '../../../Layout'
import { LayoutOverlayHeader } from '../../../LayoutOverlay'
import { useOverlayContext } from '../../../Overlay'
import { OverlayButton } from '../../../Overlay/components/OverlayButton'
import { iconClose } from '../../../icons'
import { PanelProps } from '../../types'

type OverlayPanelActionsProps = Pick<
  PanelProps,
  'closeOnAction' | 'maxLength' | 'onApply' | 'onClose' | 'onReset' | 'children'
> &
  Pick<ChipProps, 'label'>

export const OverlayPanelActions = (props: OverlayPanelActionsProps) => {
  const { label, children, onReset, onApply, maxLength = 20, closeOnAction = true } = props

  const [search, setSearch] = useState<string>()
  const castedChildren = children as ReactElement
  const menuLength = castedChildren?.props.items?.length

  const filteredChildren = useMemo(() => {
    const { items } = castedChildren.props
    const filteredItems = items?.filter((item) => {
      return true

      const optionLabelLowerCase = item.label.toLowerCase()
      const searchLowerCase = search?.toLowerCase() ?? ''
      return search ? optionLabelLowerCase?.includes(searchLowerCase) : true
    })
    return React.cloneElement(castedChildren, { items: filteredItems })
  }, [castedChildren, search])

  const { close } = useOverlayContext()

  const inSearchMode = menuLength > maxLength

  const handleReset = () => {
    onReset?.()
    onApply?.()
    if (closeOnAction) close?.()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <LayoutOverlayHeader
        switchPoint={0}
        primary={
          <LinkOrButton button={{ variant: 'text' }} color='primary' onClick={handleReset}>
            <Trans id='Reset' />
          </LinkOrButton>
        }
        secondary={
          <LinkOrButton
            button={{ variant: 'inline' }}
            color='inherit'
            startIcon={<IconSvg src={iconClose} size='medium' />}
            onClick={close}
          />
        }
      >
        {inSearchMode ? (
          <TextField
            type='search'
            fullWidth
            variant='standard'
            size='small'
            color='primary'
            placeholder={i18n._(/* 18n */ 'Search {filter}', { filter: label })}
            onChange={(e) => setSearch(e.target.value)}
          />
        ) : (
          <LayoutTitle size='small' component='span'>
            {label}
          </LayoutTitle>
        )}
      </LayoutOverlayHeader>

      <Box
        sx={(theme) => ({
          mt: theme.appShell.headerHeightSm,
          flex: 1,
          padding: `0 ${theme.page.horizontal}`,
          overflow: 'visable',
        })}
      >
        {filteredChildren}

        <Box sx={(theme) => ({ height: theme.spacings.xxl })} />
        <OverlayButton
          variant='pill'
          size='large'
          type='submit'
          onClick={close}
          sx={{
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            position: 'absolute',
            left: 10,
            right: 10,
          }}
        >
          <Trans id='Apply' />
        </OverlayButton>
      </Box>
    </Box>
  )
}

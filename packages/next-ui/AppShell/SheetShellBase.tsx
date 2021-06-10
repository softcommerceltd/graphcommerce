import { useCloseOverlay, usePageContext, usePageRouter } from '@reachdigital/framer-next-pages'
import {
  Sheet,
  SheetBackdrop,
  SheetContainer,
  SheetDragIndicator,
  SheetPanel,
  SheetProps,
} from '@reachdigital/framer-sheet'
import { useRouter } from 'next/router'
import React from 'react'
import useSheetStyles from '../FramerSheet/useSheetStyles'
import BackButton from './BackButton'
import ShellBase, { PageLayoutBaseProps } from './ShellBase'

export type SheetShellBaseProps = {
  header?: React.ReactNode
  children?: React.ReactNode
} & Pick<SheetProps, 'size' | 'variant'> &
  PageLayoutBaseProps

function SheetShellBase(props: SheetShellBaseProps) {
  const { children, variant, size, name } = props

  const sheetClasses = useSheetStyles()
  const router = useRouter()
  const pageRouter = usePageRouter()
  const { depth } = usePageContext()
  const close = useCloseOverlay()
  const open = depth < 0 || router.asPath === pageRouter.asPath

  return (
    <ShellBase name={name}>
      <Sheet
        open={open}
        onSnap={(snapPoint) => snapPoint === 'closed' && router.back()}
        variant={variant}
        size={size}
      >
        <SheetBackdrop onTap={close} classes={sheetClasses} />
        <SheetContainer classes={sheetClasses}>
          <SheetPanel header={<SheetDragIndicator classes={sheetClasses} />} classes={sheetClasses}>
            {/* <FocusLock returnFocus={{ preventScroll: true }} disabled={!isActive}> */}
            {children}
            {/* </FocusLock> */}
          </SheetPanel>
        </SheetContainer>
      </Sheet>
    </ShellBase>
  )
}

export default SheetShellBase

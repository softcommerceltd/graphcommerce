import { motion, MotionProps, MotionValue, useTransform } from 'framer-motion'
import { CSSProperties } from 'react'
import { useSheetContext } from './SheetContext'

export type SheetBackdropClassKeys = 'backdrop'

type SheetBackdropProps = Omit<MotionProps, 'initial' | 'animate' | 'exit'> & {
  styles?: Record<SheetBackdropClassKeys, CSSProperties>
  classes?: Record<SheetBackdropClassKeys, string>
}

export default function SheetBackdrop(props: SheetBackdropProps) {
  const { style, onTap, styles, classes } = props
  const { drag, size, variant } = useSheetContext()

  const sign = ['top', 'left'].includes(variant) ? -1 : 1

  // We animate the opacity of the Backdrop based on the position of the sheet
  const opacity = useTransform([drag, size] as MotionValue[], ([dragv, sizev]: number[]) => {
    if (sizev === 0) return 0
    if (dragv === 0) return 1
    return 1 - (dragv / sizev) * sign
  })

  const Component = onTap ? motion.button : motion.div
  return (
    <Component
      onTap={onTap}
      type='button'
      {...props}
      style={{ ...styles?.backdrop, ...style, opacity }}
      className={classes?.backdrop}
    />
  )
}

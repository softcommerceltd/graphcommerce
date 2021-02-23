import { makeStyles, Theme } from '@material-ui/core'
import clsx from 'clsx'
import React, { useRef } from 'react'
import { UseStyles } from '../../Styles'
import SliderContainer from '../SliderContainer'
import { SliderContext } from '../SliderContext'
import SliderDots from '../SliderDots'
import SliderNext from '../SliderNext'
import SliderPrev from '../SliderPrev'
import SliderScroller, { SliderScrollerProps } from '../SliderScroller'
import useScopeRef from '../useScopeRef'

type ClassKey = 'container' | 'scroller' | 'nav'
type Classes = Partial<Record<ClassKey, string>>
type StylesProps = { count: number; classes?: Classes }

const useStyles = makeStyles<Theme, StylesProps, ClassKey>(
  (theme: Theme) => ({
    container: {
      position: 'relative',
    },
    scroller: ({ count = 2 }: StylesProps) => ({
      minWidth: '100%',
      gridTemplateColumns: `repeat(${count}, 100%)`,
    }),
    nav: {
      display: 'grid',
      gridAutoFlow: 'column',
      gap: theme.spacings.xxs,
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: `translateX(-50%)`,
    },
  }),
  { name: 'SingleItemSlider' },
)

type SingleItemSliderProps = Omit<
  SliderScrollerProps,
  'containerRef' | 'scope' | 'className' | 'itemClassName'
> &
  UseStyles<typeof useStyles>

export default function SingleItemSlider(props: SingleItemSliderProps) {
  const { classes, children, ...sliderScrollerProps } = props
  const classesBase = useStyles({ count: React.Children.count(children), classes })
  const containerRef = useRef<HTMLDivElement>(null)
  const scope = useScopeRef()

  return (
    <SliderContext scope={scope} containerRef={containerRef}>
      <SliderContainer scope={scope} className={classesBase.container}>
        <SliderScroller scope={scope} className={classesBase.scroller} {...sliderScrollerProps}>
          {children}
        </SliderScroller>

        <div className={classesBase.nav}>
          <SliderPrev scope={scope} />
          <SliderDots scope={scope} count={React.Children.count(children)} />
          <SliderNext scope={scope} />
        </div>
      </SliderContainer>
    </SliderContext>
  )
}

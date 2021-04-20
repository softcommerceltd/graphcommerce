import { motionValue, MotionValue } from 'framer-motion'

export type ClientSize = {
  x: MotionValue<number>
  y: MotionValue<number>
}

const x = () => global.window?.document.documentElement.clientWidth ?? 0
const y = () => global.window?.document.documentElement.clientHeight ?? 0

export const clientSize: ClientSize = {
  x: motionValue(x()),
  y: motionValue(y()),
}

if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    clientSize.x.set(x())
    clientSize.y.set(y())
  })
}

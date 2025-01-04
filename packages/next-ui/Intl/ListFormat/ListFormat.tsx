import React from 'react'
import type { UseIntlListFormatOptions } from './useIntlListFormat'
import { useIntlListFormat } from './useIntlListFormat'

export type ListFormatProps = {
  children: React.ReactNode[]
} & UseIntlListFormatOptions

/** @public */
export function ListFormat(props: ListFormatProps) {
  const { children, ...options } = props
  const formatter = useIntlListFormat(options)

  const childArray = React.Children.toArray(children)
  const fauxChildren = childArray.map((child, index) => `${index}`) ?? []
  const parts = formatter.formatToParts(fauxChildren)

  return (
    <>
      {parts.map((part, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={index}>
          {part.type === 'literal' ? part.value : childArray[part.value]}
        </React.Fragment>
      ))}
    </>
  )
}

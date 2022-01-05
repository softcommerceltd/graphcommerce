import { responsiveVal, makeStyles } from '@graphcommerce/next-ui'
import React from 'react'
import { DirectoryTree } from '../../util/files'
import SidebarMenu from '../SidebarMenu'

export type LayoutProps = { menuData: DirectoryTree; children: React.ReactNode }

const useStyles = makeStyles()((theme) => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: `${responsiveVal(150, 300)} 4fr`,
    maxWidth: '100%',
    overflow: 'hidden',
  },
  side: {
    overflowY: 'auto',
    minWidth: 'min-content',
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  content: {
    overflow: 'hidden',
    maxWidth: '100%',
    padding: `0 ${theme.spacings.sm} ${theme.spacings.sm}`,
  },
  listItemText: {
    ...theme.typography.caption,
  },
}))

export default function Layout(props: LayoutProps) {
  const { menuData, children } = props
  const { classes } = useStyles()

  return (
    <div className={classes.grid}>
      <div className={classes.side}>
        <SidebarMenu tree={menuData} />
      </div>
      <div className={classes.content}>{children}</div>
    </div>
  )
}

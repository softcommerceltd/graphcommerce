import React from 'react'
import { CssBaseline } from '@material-ui/core'
import Head from 'next/head'
import Error from 'next/error'
import PageMeta from '../PageMeta'
import ThemedProvider, { theme } from '../Theme'
import { LayoutPage } from '../../lib/layout'
import { GQLGetBreadcrumbQuery, GQLGetPageLayoutQuery } from '../../generated/graphql'
import Header from '../Header'

export type PageLayoutProps = GQLGetPageLayoutQuery & GQLGetBreadcrumbQuery
type LayoutComponent = LayoutPage<PageLayoutProps>['layout']

const LayoutFull: LayoutComponent = ({ children, pages, breadcrumbs, mainMenu, team }) => {
  if (!pages.length) return <Error statusCode={404}>Page not found</Error>
  if (!mainMenu) return <Error statusCode={404}>Main menu found</Error>
  const page = pages[0] ?? undefined

  return (
    <ThemedProvider>
      <Head>
        <meta name='theme-color' content={theme.palette.primary.main} />
        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
      </Head>
      <CssBaseline />
      <PageMeta {...page} />
      <Header menu={mainMenu} page={page} team={team} />
      {/* <Breadcrumb breadcrumbs={breadcrumbs} /> */}
      {children}
    </ThemedProvider>
  )
}

export default LayoutFull

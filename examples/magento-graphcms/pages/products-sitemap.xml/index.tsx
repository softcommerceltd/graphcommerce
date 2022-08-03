import { ApolloClient, ApolloQueryResult, NormalizedCacheObject } from '@graphcommerce/graphql'
import { productLink } from '@graphcommerce/magento-product'
import {
  ProductStaticPathsDocument,
  ProductStaticPathsQuery,
} from '@graphcommerce/magento-product/components/ProductStaticPaths/ProductStaticPaths.gql'
import { canonicalize } from '@graphcommerce/next-ui'
import { GetServerSideProps } from 'next'
import { getServerSideSitemap } from 'next-sitemap'
import { graphqlSsrClient } from '../../lib/graphql/graphqlSsrClient'

const nonNullable = <T,>(value: T): value is NonNullable<T> => value !== null && value !== undefined

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locales = [], defaultLocale, res } = ctx
  const lastmod = new Date().toISOString()
  const Changefreq = 'daily'
  const priority = 0.7

  res.setHeader(
    'Cache-Control',
    `public, s-maxage=${60 * 60 * 2}, stale-while-revalidate=${60 * 60 * 24}`,
  )

  async function getPaths(client: ApolloClient<NormalizedCacheObject>, locale: string) {
    const query = graphqlSsrClient(locale).query({
      query: ProductStaticPathsDocument,
      variables: {
        currentPage: 1,
        pageSize: 300,
      },
    })

    const pages: Promise<ApolloQueryResult<ProductStaticPathsQuery>>[] = [query]

    const paths = (await Promise.all(pages))
      .map((q) => q.data.products?.items)
      .flat(1)
      .filter(nonNullable)
      .map((p) =>
        canonicalize(
          { locale, defaultLocale, pathname: '/', isLocaleDomain: false },
          productLink(p),
        ),
      )
      .filter(nonNullable)
      .map((loc) => ({ loc, lastmod, Changefreq, priority }))

    return paths
  }

  const path = (locale: string) => getPaths(graphqlSsrClient(locale), locale)
  const paths = (await Promise.all(locales.map(path))).flat(1)

  return getServerSideSitemap(ctx, paths)
}

export default function SitemapIndex() {}

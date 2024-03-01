import { ImageProps } from '@graphcommerce/image'
import { cssFlag, cssNotFlag, extendableComponent } from '@graphcommerce/next-ui'
import { SxProps, Theme, useEventCallback, Skeleton } from '@mui/material'
import React from 'react'
import { ProductListItemFragment } from '../../Api/ProductListItem.gql'
import { productLink } from '../../hooks/useProductLink'
import { ProductListPrice } from '../ProductListPrice/ProductListPrice'
import { ProductDiscountLabel } from './ProductDiscountLabel'
import {
  ProductListItemImageProps,
  ProductListItemImage,
  ProductListItemImageSkeleton,
} from './ProductListItemImage'
import {
  ProductListItemImageAreaKeys,
  ProductListsItemImageAreaProps,
  ProductListItemImageAreas,
  ProductImageContainer,
} from './ProductListItemImageContainer'
import { ProductListItemLinkOrDiv } from './ProductListItemLinkOrDiv'
import {
  ProductListItemTitleAndPrice,
  ProductListItemTitleAndPriceProps,
} from './ProductListItemTitleAndPrice'

const { classes, selectors } = extendableComponent('ProductListItem', [
  'root',
  'item',
  'title',
  'titleContainer',
  'subtitle',
  'price',
  'overlayItems',
  'topLeft',
  'topRight',
  'bottomLeft',
  'bottomRight',
  'imageContainer',
  'placeholder',
  'image',
  'discount',
] as const)

type StyleProps = {
  imageOnly?: boolean
}

type BaseProps = {
  imageOnly?: boolean
  children?: React.ReactNode
  sx?: SxProps<Theme>
  mask?: boolean
  // eslint-disable-next-line react/no-unused-prop-types
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>, item: ProductListItemFragment) => void
} & StyleProps &
  Omit<ProductListItemTitleAndPriceProps, 'title' | 'classes' | 'children'> &
  Omit<ProductListItemImageProps, 'classes'> &
  Omit<ProductListsItemImageAreaProps, 'classes'> &
  Pick<ImageProps, 'loading' | 'sizes' | 'dontReportWronglySizedImages'>

// eslint-disable-next-line react/no-unused-prop-types
type SkeletonProps = BaseProps & { __typename: 'Skeleton' }

type ProductProps = BaseProps & ProductListItemFragment

export type ProductListItemProps = ProductProps | SkeletonProps

export function ProductListItemReal(props: ProductProps) {
  const {
    subTitle,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
    small_image,
    name,
    price_range,
    children,
    imageOnly = false,
    loading,
    sizes,
    dontReportWronglySizedImages,
    aspectRatio = [4, 3],
    titleComponent = 'h2',
    sx = [],
    mask,
    onClick,
  } = props

  const handleClick = useEventCallback((e: React.MouseEvent<HTMLAnchorElement>) =>
    onClick?.(e, props),
  )

  return (
    <ProductListItemLinkOrDiv
      href={productLink(props)}
      className={classes.root}
      sx={sx}
      onClick={handleClick}
    >
      <ProductImageContainer className={classes.imageContainer}>
        <ProductListItemImage
          classes={classes}
          src={small_image?.url}
          alt={small_image?.label}
          aspectRatio={aspectRatio}
          loading={loading}
          sizes={sizes}
          dontReportWronglySizedImages={dontReportWronglySizedImages}
        />

        {!imageOnly && (
          <ProductListItemImageAreas
            topRight={topRight}
            bottomLeft={bottomLeft}
            bottomRight={bottomRight}
            classes={classes}
            topLeft={
              <>
                <ProductDiscountLabel className={classes.discount} price_range={price_range} />
                {topLeft}
              </>
            }
          />
        )}
      </ProductImageContainer>

      {!imageOnly && (
        <>
          <ProductListItemTitleAndPrice
            classes={classes}
            titleComponent={titleComponent}
            title={name}
            subTitle={subTitle}
          >
            <ProductListPrice
              {...price_range.minimum_price}
              sx={{
                [cssFlag('signed-in')]: { display: mask ? 'none' : undefined },
              }}
            />

            <Skeleton
              variant='text'
              sx={{
                width: '50px',
                [cssFlag('signed-in')]: { display: mask ? 'inherit' : 'none' },
                [cssNotFlag('signed-in')]: { display: 'none' },
              }}
            />
          </ProductListItemTitleAndPrice>
          {children}
        </>
      )}
    </ProductListItemLinkOrDiv>
  )
}

export function ProductListItemSkeleton(props: SkeletonProps) {
  const { children, imageOnly = false, aspectRatio, titleComponent = 'h2', sx = [] } = props

  return (
    <ProductListItemLinkOrDiv sx={sx} className={classes.root}>
      <ProductImageContainer className={classes.imageContainer}>
        <ProductListItemImageSkeleton classes={classes} aspectRatio={aspectRatio} />
      </ProductImageContainer>

      {!imageOnly && (
        <>
          <ProductListItemTitleAndPrice
            classes={classes}
            titleComponent={titleComponent}
            title={<Skeleton variant='text' sx={{ width: '100px' }} />}
            subTitle={<Skeleton variant='text' sx={{ width: '20px' }} />}
          >
            <Skeleton variant='text' sx={{ width: '20px' }} />
          </ProductListItemTitleAndPrice>
          {children}
        </>
      )}
    </ProductListItemLinkOrDiv>
  )
}

function isSkeleton(props: ProductListItemProps): props is SkeletonProps {
  return props.__typename === 'Skeleton'
}
export function ProductListItem(props: ProductListItemProps) {
  return isSkeleton(props) ? (
    <ProductListItemSkeleton {...props} />
  ) : (
    <ProductListItemReal {...props} />
  )
}

ProductListItem.selectors = { ...selectors, ...ProductListPrice.selectors }

/** @deprecated */
export type OverlayAreaKeys = ProductListItemImageAreaKeys
/** @deprecated */
export type OverlayAreas = ProductListsItemImageAreaProps

import { useQuery } from '@apollo/client'
import { ProductReviewRatingInput } from '@graphcommerce/graphql'
import { ApolloCustomerErrorAlert } from '@graphcommerce/magento-customer'
import {
  Button,
  Form,
  UseStyles,
  responsiveVal,
  FormActions,
  FormRow,
  StarRatingField,
  makeStyles,
  useMergedClasses,
} from '@graphcommerce/next-ui'
import { useFormGqlMutation } from '@graphcommerce/react-hook-form'
import { Trans } from '@lingui/macro'
import { Box, TextField, Typography, Alert } from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { CreateProductReviewDocument } from './CreateProductReview.gql'
import { ProductReviewRatingsMetadataDocument } from './ProductReviewRatingsMetadata.gql'

const useStyles = makeStyles({ name: 'CreateProductReviewForm' })((theme) => ({
  ratingContainer: {
    marginBottom: theme.spacings.xxs,
  },
  rating: {
    paddingBottom: 'unset',
    gridTemplateColumns: `minmax(${responsiveVal(60, 80)}, 0.1fr) max-content`,
    alignItems: 'center',
  },
  ratingLabel: {
    fontWeight: 'normal',
    justifySelf: 'left',
  },
  submitButton: {
    width: responsiveVal(200, 250),
    height: responsiveVal(40, 50),
  },
  cancelButton: {
    display: 'block',
    maxWidth: 'max-content',
    margin: '0 auto',
  },
  formActions: {
    gridAutoFlow: 'row',
    gap: 8,
    marginTop: theme.spacings.xxs,
  },
}))

type CreateProductReviewFormProps = {
  sku: string
  nickname?: string
} & UseStyles<typeof useStyles>

export default function CreateProductReviewForm(props: CreateProductReviewFormProps) {
  const { sku, nickname } = props
  const classes = useMergedClasses(useStyles().classes, props.classes)
  const router = useRouter()
  const [ratings, setRatings] = useState<ProductReviewRatingInput[]>([])

  const { data, loading } = useQuery(ProductReviewRatingsMetadataDocument)

  const form = useFormGqlMutation(
    CreateProductReviewDocument,
    {
      defaultValues: { sku, nickname },
      onBeforeSubmit: (formData) => ({
        ...formData,
        ratings: ratings.some((r) => r.value_id === '') ? [] : ratings,
      }),
    },
    { errorPolicy: 'all' },
  )
  const { handleSubmit, muiRegister, formState, required, error } = form
  const submitHandler = handleSubmit(() => {})

  useEffect(() => {
    if (loading || !data) return

    // set initial state
    if (ratings.length === 0) {
      const reviewMetadataRatings = data.productReviewRatingsMetadata.items.map((metadata) => ({
        id: metadata?.id ?? '',
        value_id: '',
      }))

      setRatings(reviewMetadataRatings)
    }
  }, [loading, data, ratings.length])

  if (!data) return null

  if (formState.isSubmitSuccessful && data) {
    return (
      <>
        <Alert severity='success' variant='standard'>
          <Trans>Thank you! Your review was successfully submitted for approval</Trans>
        </Alert>
        <Box mt={6}>
          <Button variant='pill' color='secondary' size='large' onClick={() => router.back()}>
            <Trans>Continue shopping</Trans>
          </Button>
        </Box>
      </>
    )
  }

  return (
    <Form onSubmit={submitHandler} noValidate>
      <FormRow>
        <TextField
          variant='outlined'
          type='text'
          error={!!formState.errors.nickname || !!error}
          label={<Trans>Name</Trans>}
          required={required.nickname}
          {...muiRegister('nickname', { required: required.nickname })}
          helperText={formState.errors.nickname?.message}
          disabled={formState.isSubmitting}
          InputProps={{
            readOnly: typeof nickname !== 'undefined',
          }}
        />
      </FormRow>

      <div className={classes.ratingContainer}>
        {data?.productReviewRatingsMetadata?.items?.map((prrvm) => (
          <FormRow key={prrvm?.id} className={classes.rating}>
            <Typography variant='h5' component='span' className={classes.ratingLabel}>
              {prrvm?.name}
            </Typography>
            {prrvm && (
              <StarRatingField
                id={prrvm?.id ?? ''}
                size='large'
                onChange={(id, value) => {
                  const productReviewRatingInputValue =
                    data.productReviewRatingsMetadata.items.find((meta) => meta?.id === id)?.values[
                      value - 1
                    ]

                  const ratingsArr = [...ratings]

                  const clonedProductReviewRatingInputValue = ratingsArr.find(
                    (meta) => meta.id === id,
                  )

                  if (
                    !clonedProductReviewRatingInputValue ||
                    typeof productReviewRatingInputValue?.value_id === undefined
                  ) {
                    console.error('Cannot find product review rating input value in local state')
                    return
                  }

                  clonedProductReviewRatingInputValue.value_id =
                    productReviewRatingInputValue?.value_id ?? ''

                  setRatings(ratingsArr)
                }}
              />
            )}
          </FormRow>
        ))}
      </div>

      <FormRow>
        <TextField
          variant='outlined'
          type='text'
          error={!!formState.errors.summary || !!error}
          label='Summary'
          required={required.summary}
          {...muiRegister('summary', { required: required.summary })}
          helperText={formState.errors.summary?.message}
          disabled={formState.isSubmitting}
        />
      </FormRow>

      <FormRow>
        <TextField
          variant='outlined'
          type='text'
          error={!!formState.errors.text || !!error}
          label='Review'
          required={required.text}
          {...muiRegister('text', { required: required.text })}
          helperText={formState.errors.text?.message}
          disabled={formState.isSubmitting}
          multiline
          rows={8}
          maxRows={8}
        />
      </FormRow>

      <FormActions className={classes.formActions}>
        <Button
          variant='pill'
          color='primary'
          type='submit'
          size='medium'
          className={classes.submitButton}
        >
          Submit review
        </Button>
        <Button
          variant='text'
          color='primary'
          onClick={() => router.back()}
          className={classes.cancelButton}
        >
          Cancel
        </Button>
      </FormActions>

      <ApolloCustomerErrorAlert error={error} />
    </Form>
  )
}

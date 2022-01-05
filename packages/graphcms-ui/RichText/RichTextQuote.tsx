import { withStyles } from '@graphcommerce/next-ui'
import RichText from '.'

const RichTextQuote = withStyles(RichText, (theme) => ({
  paragraph: {
    ...theme.typography.h4,
    fontWeight: 600,
    '@supports (font-variation-settings: normal)': {
      fontVariationSettings: "'wght' 620",
    },
    textTransform: 'uppercase',
    maxWidth: '60%',
    textAlign: 'center',
    margin: '0 auto',
    [theme.breakpoints.up('lg')]: {
      maxWidth: '80%',
    },
  },
}))

export default RichTextQuote

import { css, Theme, ThemeProvider } from '@mui/material'
import { typography } from './tssReact'

/**
 * It will provide a theme for the underlying tree and will set the color/font and backgroundColor
 * for the child.
 *
 * To use it, wrap your component with it.
 *
 * Example:
 *
 * ```tsx
 * const MyPage = () => {
 *   return <div>Your regular page content</div>
 * }
 * export default MyPage
 * ```
 *
 * Becomes:
 *
 * ```tsx
 * const MyPage = () => {
 *   return <div>Your regular page content, but now in darkMode</div>
 * }
 *
 * export default withTheme(MyPage, darkTheme)
 * ```
 */
export function withTheme(Component: React.FC<{ className?: string }>, theme: Theme) {
  return (props: Record<string, unknown>) => (
    <ThemeProvider theme={theme}>
      <Component
        {...props}
        css={css({
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.default,
          ...typography(theme, 'body1'),
        })}
      />
    </ThemeProvider>
  )
}

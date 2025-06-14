import { makeStyles, tokens } from '@fluentui/react-components'

export const useStyles = makeStyles({
  Wrapper: {
    width: '100dvw',
    minHeight: '100svh',
    display: 'flex',
    flexDirection: 'column'
  },
  MainBG: {
    backgroundColor: tokens.colorNeutralBackground2,
    width: '100%',
    flex: 1
  },
  StartUIPadding: {
    padding: '30px 0 30px 50px'
  },
  card: {
    width: '360px',
    maxWidth: '100%',
    height: 'fit-content'
  },
  section: {
    width: 'fit-content'
  },
  title: { margin: '0 0 12px' },
  caption: {
    color: tokens.colorNeutralForeground3
  }
})

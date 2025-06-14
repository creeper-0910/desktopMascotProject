import { makeStyles, tokens } from '@fluentui/react-components'

export const useStyles = makeStyles({
  MainBG: {
    backgroundColor: tokens.colorNeutralBackground2,
    width: '100%',
    height: '100svh'
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

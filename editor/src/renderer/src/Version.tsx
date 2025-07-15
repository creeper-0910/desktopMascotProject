import { mergeClasses } from '@fluentui/react-components'
import { useStyles } from './styles'

function Version(): React.JSX.Element {
  const styles = useStyles()
  return (
    <>
      <div className={mergeClasses(styles.Wrapper, styles.VersionBG, styles.VersionUIPadding)}>
        Hello World!<br/>
        ここにバージョンが表示されます!
      </div>
    </>
  )
}

export default Version

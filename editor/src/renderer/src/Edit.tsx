import { useStyles } from './styles'

function Edit(): React.JSX.Element {
  //const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const styles = useStyles()
  return (
    <>
      <div className={styles.MainBG}></div>
    </>
  )
}

export default Edit

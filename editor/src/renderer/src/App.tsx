import { useStyles } from "./styles";

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const styles = useStyles();
  return (
    <>
      <div className={styles.MainBG}></div>
    </>
  )
}

export default App

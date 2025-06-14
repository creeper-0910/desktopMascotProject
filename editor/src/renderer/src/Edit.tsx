import { useLocation } from 'react-router'
import { useStyles } from './styles'

function Edit(): React.JSX.Element {
  const location = useLocation()
  const styles = useStyles()
  const data = location.state
  console.log(data.project)
  window.electron.ipcRenderer.send('setTitle', data.project.PROJECT_NAME)

  return (
    <>
      <div className={styles.MainBG}>
        <div
          style={{
            width: data.project.SIZE_X,
            height: data.project.SIZE_Y,
            backgroundColor: 'white'
          }}
        ></div>
      </div>
    </>
  )
}

export default Edit

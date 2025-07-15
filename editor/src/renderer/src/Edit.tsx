import { useLocation } from 'react-router'

import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { useStyles } from './styles'

function Edit(): React.JSX.Element {
  const location = useLocation()
  const data = location.state
  console.log(data.project)
  window.electron.ipcRenderer.send('setTitle', data.project.PROJECT_NAME)
  const styles = useStyles()
  return (
    <div>
      <TransformWrapper>
        <TransformComponent wrapperClass="!h-full !w-full">
          <div
            style={{
              width: data.project.SIZE_X,
              height: data.project.SIZE_Y,
              backgroundColor: 'white'
            }}
          ></div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}

export default Edit

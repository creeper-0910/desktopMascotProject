import { Subtitle1, useRestoreFocusTarget } from '@fluentui/react-components'

import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { CardButton } from './components/CardButton'
import { lang } from './components/Const'
import { InfoDialog } from './components/InfoDialog'
import { useExistDialog, useNPDialog } from './components/ProjectDialog'
import { useStyles } from './styles'

function App(): React.JSX.Element {
  const navigate = useNavigate()
  const styles = useStyles()
  const [err, setErr] = useState(false)
  const errorMsg = useRef({})
  const npDialog = useNPDialog()
  const existDialog = useExistDialog()
  const restoreFocusTargetAttribute = useRestoreFocusTarget()
  const showErrorMessage = (msg): void => {
    errorMsg.current = {
      TITLE: lang.ERROR_TITLE,
      CONTENTS: `${lang.ERROR_MESSAGE}${msg}`
    }
    setErr(true)
  }

  window.electron.ipcRenderer.send('setTitle')
  return (
    <>
      <div className={`${styles.StartUIPadding} flex flex-col gap-4`}>
        <Subtitle1>{lang.START}</Subtitle1>
        <div className="flex gap-3">
          <CardButton
            title={lang.NEW_PROJECT}
            subtitle={lang.NEW_PROJECT_MESSAGE}
            options={{
              ...restoreFocusTargetAttribute,
              onClick: () => {
                npDialog.open()
              }
            }}
          />
          <CardButton
            title={lang.OPEN_PROJECT}
            subtitle={lang.OPEN_PROJECT_MESSAGE}
            options={{ onClick: existDialog }}
          />
        </div>
      </div>
      {npDialog.elem}
      <InfoDialog open={err} setOpen={setErr} message={errorMsg.current} />
    </>
  )
}

export default App

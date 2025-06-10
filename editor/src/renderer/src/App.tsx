import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Subtitle1,
  mergeClasses,
  useRestoreFocusTarget
} from '@fluentui/react-components'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { CardButton } from './components/CardButton'
import { useStyles } from './styles'

function App(): React.JSX.Element {
  const navigate = useNavigate()
  const styles = useStyles()
  const [open, setOpen] = useState(false)
  const restoreFocusTargetAttribute = useRestoreFocusTarget()
  const openFile = async (): Promise<void> => {
    await window.electron.ipcRenderer.invoke('openFile')
  }
  return (
    <>
      <div className={`${mergeClasses(styles.StartUIPadding, styles.MainBG)} flex flex-col gap-4`}>
        <Subtitle1>開始</Subtitle1>
        <div className="flex gap-3">
          <CardButton
            title="新規プロジェクト"
            subtitle="新しいプロジェクトを作成します"
            options={{
              ...restoreFocusTargetAttribute,
              onClick: () => {
                setOpen(true)
              }
            }}
          />
          <Dialog
            open={open}
            onOpenChange={(_, data) => {
              setOpen(data.open)
            }}
          >
            <DialogSurface>
              <DialogBody>
                <DialogTitle>新規作成</DialogTitle>
                <DialogContent>
                  プロジェクト名<br/>
                  サイズ(正方形？)<br/>
                  その他色々設定あれば
                </DialogContent>
              </DialogBody>
            </DialogSurface>
          </Dialog>
          <CardButton
            title="開く"
            subtitle="既存のプロジェクトを開きます"
            options={{ onClick: openFile }}
          />
        </div>
      </div>
    </>
  )
}

export default App

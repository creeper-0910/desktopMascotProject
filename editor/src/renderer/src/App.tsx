import {
  Caption1,
  Card,
  CardHeader,
  Subtitle1,
  Text,
  mergeClasses
} from '@fluentui/react-components'
import { useNavigate } from 'react-router'
import { useStyles } from './styles'

function App(): React.JSX.Element {
  const openFile = async (): Promise<void> => {
    await window.electron.ipcRenderer.invoke('openFile')
  }
  const navigate = useNavigate()
  const styles = useStyles()
  return (
    <>
      <div className={`${mergeClasses(styles.StartUIPadding, styles.MainBG)} flex flex-col gap-4`}>
        <Subtitle1>開始</Subtitle1>
        <div className="flex gap-3">
          <Card className={styles.card} orientation="horizontal" onClick={() => navigate('/edit')}>
            <CardHeader
              header={<Text weight="semibold">新規プロジェクト</Text>}
              description={
                <Caption1 className={styles.caption}>新しいプロジェクトを作成します</Caption1>
              }
            />
          </Card>
          <Card className={styles.card} orientation="horizontal" onClick={openFile}>
            <CardHeader
              header={<Text weight="semibold">開く</Text>}
              description={
                <Caption1 className={styles.caption}>既存のプロジェクトを開きます</Caption1>
              }
            />
          </Card>
        </div>
      </div>
    </>
  )
}

export default App

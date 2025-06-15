import { Button } from '@fluentui/react-components'
import { lang } from './Const'

export function MenuBar(): React.JSX.Element {
  const about = (): void => {
    window.electron.ipcRenderer.invoke('openAbout', lang.ABOUT_MESSAGE)
  }
  return (
    <>
      <div className="flex w-full h-5">
        <Button size="small" appearance="transparent" className="!min-w-fit">
          {lang.MENU_FILE}
        </Button>
        <Button size="small" appearance="transparent" className="!min-w-fit" onClick={about}>
          {lang.MENU_HELP}
        </Button>
      </div>
    </>
  )
}

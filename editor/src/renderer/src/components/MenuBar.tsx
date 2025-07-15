import {
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger
} from '@fluentui/react-components'
import { useStyles } from '@renderer/styles'
import { Outlet } from 'react-router'
import { lang } from './Const'
import { useExistDialog, useNPDialog } from './ProjectDialog'

export function MenuBar(): React.JSX.Element {
  const about = (): void => {
    window.electron.ipcRenderer.invoke('openAbout', lang.ABOUT_MESSAGE)
  }
  const existDialog = useExistDialog()
  const npDialog = useNPDialog()
  const styles = useStyles()
  return (
    <div className={styles.Wrapper}>
      <div className="flex w-full h-5">
        <Menu positioning={{ autoSize: true }}>
          <MenuTrigger disableButtonEnhancement>
            <Button size="small" appearance="transparent" className="!min-w-fit">
              {lang.MENU_FILE}
            </Button>
          </MenuTrigger>

          <MenuPopover>
            <MenuList>
              <MenuItem onClick={() => npDialog.open()}>{lang.NEW_CREATE}</MenuItem>
              <MenuItem onClick={() => existDialog()}>{lang.OPEN_PROJECT}</MenuItem>
              <MenuItem onClick={() => window.electron.ipcRenderer.send('quit')}>
                {lang.QUIT}
              </MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>
        <Button
          size="small"
          appearance="transparent"
          className="!min-w-fit"
          onClick={() => window.open('#/version', '_blank')}
        >
          {lang.MENU_HELP}
        </Button>
        {npDialog.elem}
      </div>
      <div className={styles.MainBG}>
        <Outlet />
      </div>
    </div>
  )
}

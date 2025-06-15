import {
  Body1,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Field,
  Input,
  Subtitle1,
  mergeClasses,
  useRestoreFocusTarget
} from '@fluentui/react-components'

import { yupResolver } from '@hookform/resolvers/yup'
import { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import * as yup from 'yup'
import { ja } from 'yup-locales'
import { CardButton } from './components/CardButton'
import { lang } from './components/Const'
import { InfoDialog } from './components/InfoDialog'
import { MenuBar } from './components/MenuBar'
import { useStyles } from './styles'
yup.setLocale(ja)
const defaultValues = {
  PROJECT_NAME: '',
  SIZE_X: 500,
  SIZE_Y: 500
}

const schema = yup.object().shape({
  PROJECT_NAME: yup
    .string()
    .label(lang.PROJECT_NAME)
    .required()
    .max(20)
    .test({
      name: 'PROJECT_NAME',
      message: lang.EXISTS_PROJECT_NAME,
      test: (value) => {
        return !window.electron.ipcRenderer.sendSync('isExist', value)
      }
    })
    .test({
      name: 'PROJECT_NAME',
      message: lang.INVALID_PROJECT_NAME,
      test: (value) => {
        // eslint-disable-next-line
        const regexp = /[\\\/:\*\?\"<>\|]/
        return !regexp.test(value)
      }
    })
    .test({
      name: 'PROJECT_NAME',
      message: lang.INVALID_LAST_DOT,
      test: (value) => {
        const regexp = /[.\s]$/
        return !regexp.test(value)
      }
    }),
  SIZE_X: yup
    .number()
    .label(lang.WIDTH)
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(250)
    .required(),
  SIZE_Y: yup
    .number()
    .label(lang.HEIGHT)
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(250)
    .required()
})

type NewProjectForm = yup.InferType<typeof schema>

function App(): React.JSX.Element {
  const navigate = useNavigate()
  const { handleSubmit, control, reset } = useForm<NewProjectForm>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
    mode: 'onSubmit'
  })
  const styles = useStyles()
  const [open, setOpen] = useState(false)
  const [err, setErr] = useState(false)
  const errorMsg = useRef({})
  const restoreFocusTargetAttribute = useRestoreFocusTarget()
  const showErrorMessage = (msg): void => {
    errorMsg.current = {
      TITLE: lang.ERROR_TITLE,
      CONTENTS: `${lang.ERROR_MESSAGE}${msg}`
    }
    setErr(true)
  }
  //ファイルを読み込んでからJSONを受け渡しページ遷移
  const openFile = async (): Promise<void> => {
    const response = await window.electron.ipcRenderer.invoke('openFile')
    if (!response.canceled) {
      const data = await window.electron.ipcRenderer.invoke('readFile', response.filePaths[0])
      if (!data.error) {
        navigate('/edit', { state: { project: data.data } })
      } else {
        showErrorMessage(data.errorMsg)
      }
    }
  }
  //ファイルを作成&読み込みしてからJSONを受け渡しページ遷移
  const createNewProject = async (values): Promise<void> => {
    const response = await window.electron.ipcRenderer.invoke('initProject', values)
    if (!response.error) {
      const data = await window.electron.ipcRenderer.invoke('readFile', response.path)
      if (!data.error) {
        navigate('/edit', { state: { project: data.data } })
      } else {
        showErrorMessage(data.errorMsg)
      }
    } else {
      showErrorMessage(response.errorMsg)
    }
  }

  window.electron.ipcRenderer.send('setTitle')
  return (
    <div className={styles.Wrapper}>
      <MenuBar />
      <div className={`${mergeClasses(styles.StartUIPadding, styles.MainBG)} flex flex-col gap-4`}>
        <Subtitle1>{lang.START}</Subtitle1>
        <div className="flex gap-3">
          <CardButton
            title={lang.NEW_PROJECT}
            subtitle={lang.NEW_PROJECT_MESSAGE}
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
              reset(defaultValues)
              setOpen(data.open)
            }}
          >
            <DialogSurface>
              <DialogBody>
                <DialogTitle>{lang.CREATE_NEW}</DialogTitle>
                <DialogContent>
                  {/* プロジェクト名
                  <br />
                  サイズ(正方形？)
                  <br />
                  その他色々設定あれば */}
                  <form onSubmit={handleSubmit(createNewProject)}>
                    <div className="flex flex-col gap-1 mb-5">
                      <Body1 className="text-center">{lang.PROJECT_NAME}</Body1>
                      <Controller
                        control={control}
                        name="PROJECT_NAME"
                        render={({ field, fieldState }) => (
                          <>
                            <Field
                              validationState={fieldState.error ? 'error' : 'none'}
                              validationMessage={fieldState.error?.message}
                              max={20}
                            >
                              <Input {...field} />
                            </Field>
                          </>
                        )}
                      />
                      <Body1 className="text-center">{lang.PROJECT_SIZE}</Body1>
                      <div className="flex">
                        <Controller
                          control={control}
                          name="SIZE_Y"
                          render={({ field, fieldState }) => (
                            <>
                              <Field
                                validationState={fieldState.error ? 'error' : 'none'}
                                validationMessage={fieldState.error?.message}
                              >
                                {/*@ts-ignore 修正が難しい*/}
                                <Input {...field} />
                              </Field>
                            </>
                          )}
                        />
                        <Body1 className="m-2 text-center">✕</Body1>
                        <Controller
                          control={control}
                          name="SIZE_X"
                          render={({ field, fieldState }) => (
                            <>
                              <Field
                                validationState={fieldState.error ? 'error' : 'none'}
                                validationMessage={fieldState.error?.message}
                              >
                                {/*@ts-ignore 修正が難しい*/}
                                <Input {...field} />
                              </Field>
                            </>
                          )}
                        />
                      </div>
                    </div>
                    <DialogActions>
                      <Button type="submit">{lang.START}</Button>
                    </DialogActions>
                  </form>
                </DialogContent>
              </DialogBody>
            </DialogSurface>
          </Dialog>
          <CardButton
            title={lang.OPEN_PROJECT}
            subtitle={lang.OPEN_PROJECT_MESSAGE}
            options={{ onClick: openFile }}
          />
        </div>
      </div>
      <InfoDialog open={err} setOpen={setErr} message={errorMsg.current} />
    </div>
  )
}

export default App

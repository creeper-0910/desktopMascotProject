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
import { CardButton } from './components/CardButton'
import {
  COMMON_MESSAGE,
  EXISTS,
  INVALID_VALUE,
  REQIRED_MESSAGE,
  VALUE_SIZE
} from './components/Const'
import { InfoDialog } from './components/InfoDialog'
import { useStyles } from './styles'

const defaultValues = {
  PROJECT_NAME: '',
  SIZE_X: 500,
  SIZE_Y: 500
}

const schema = yup.object().shape({
  PROJECT_NAME: yup
    .string()
    .required(REQIRED_MESSAGE.PROJECT_NAME)
    .max(20, VALUE_SIZE.BIG)
    .test({
      name: 'PROJECT_NAME',
      message: EXISTS.PROJECT_NAME,
      test: (value) => {
        return !window.electron.ipcRenderer.sendSync('isExist', value)
      }
    })
    .test({
      name: 'PROJECT_NAME',
      message: INVALID_VALUE.PROJECT_NAME,
      test: (value) => {
        // eslint-disable-next-line
        const regexp = /[\\\/:\*\?\"<>\|]/
        return !regexp.test(value)
      }
    })
    .test({
      name: 'PROJECT_NAME',
      message: INVALID_VALUE.LAST_DOT,
      test: (value) => {
        const regexp = /[.\s]$/
        return !regexp.test(value)
      }
    }),
  SIZE_X: yup
    .number()
    .required(REQIRED_MESSAGE.INPUT)
    .typeError(REQIRED_MESSAGE.NUMBER)
    .min(250, VALUE_SIZE.LESS),
  SIZE_Y: yup
    .number()
    .required(REQIRED_MESSAGE.INPUT)
    .typeError(REQIRED_MESSAGE.NUMBER)
    .min(250, VALUE_SIZE.LESS)
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
      TITLE: COMMON_MESSAGE.ERROR.TITLE,
      CONTENTS: `${COMMON_MESSAGE.ERROR.CONTENTS}${msg}`
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
              reset(defaultValues)
              setOpen(data.open)
            }}
          >
            <DialogSurface>
              <DialogBody>
                <DialogTitle>新規作成</DialogTitle>
                <DialogContent>
                  {/* プロジェクト名
                  <br />
                  サイズ(正方形？)
                  <br />
                  その他色々設定あれば */}
                  <form onSubmit={handleSubmit(createNewProject)}>
                    <div className="flex flex-col gap-1 mb-5">
                      <Body1 className="text-center">プロジェクト名</Body1>
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
                      <Body1 className="text-center">プロジェクトのサイズ</Body1>
                      <div className="flex">
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
                        <Body1 className="m-2 text-center">✕</Body1>
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
                      </div>
                    </div>
                    <DialogActions>
                      <Button type="submit">始める</Button>
                    </DialogActions>
                  </form>
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
      <InfoDialog open={err} setOpen={setErr} message={errorMsg.current} />
    </>
  )
}

export default App

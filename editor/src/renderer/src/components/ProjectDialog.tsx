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
  Input
} from '@fluentui/react-components'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import * as yup from 'yup'
import { ja } from 'yup-locales'
import { lang } from './Const'

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

export function useNPDialog(): {
  elem: React.JSX.Element
  open: () => void
} {
  const navigate = useNavigate()
  const [openDialog, setOpenDialog] = useState(false)
  const { handleSubmit, control, reset } = useForm<NewProjectForm>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
    mode: 'onSubmit'
  })

  //ファイルを作成&読み込みしてからJSONを受け渡しページ遷移
  const createNewProject = async (values): Promise<void> => {
    const response = await window.electron.ipcRenderer.invoke('initProject', values)
    if (!response.error) {
      const data = await window.electron.ipcRenderer.invoke('readFile', response.path)
      if (!data.error) {
        navigate('/edit', { state: { project: data.data } })
      } else {
        console.log('Error')
      }
    } else {
      console.log('Error')
    }
  }
  const open = (): void => {
    setOpenDialog(true)
  }
  const elem = (
    <Dialog
      open={openDialog}
      onOpenChange={(_, data) => {
        reset(defaultValues)
        setOpenDialog(data.open)
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
  )

  return {
    elem,
    open
  }
}

export function useExistDialog(): () => Promise<void> {
  const navigate = useNavigate()
  //ファイルを読み込んでからJSONを受け渡しページ遷移
  const openFile = async (): Promise<void> => {
    const response = await window.electron.ipcRenderer.invoke('openFile')
    if (!response.canceled) {
      const data = await window.electron.ipcRenderer.invoke('readFile', response.filePaths[0])
      if (!data.error) {
        navigate('/edit', { state: { project: data.data } })
      } else {
        console.log('Error')
      }
    }
  }
  return openFile
}

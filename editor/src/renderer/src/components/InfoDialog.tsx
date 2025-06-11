import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle
} from '@fluentui/react-components'
import PropTypes from 'prop-types'

export function InfoDialog(props): React.JSX.Element {
  console.log(props.message)
  return (
    <Dialog
      open={props.open}
      onOpenChange={(_, data) => {
        props.setOpen(data.open)
      }}
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{props.message.TITLE}</DialogTitle>
          <DialogContent className="whitespace-pre-wrap">{props.message.CONTENTS}</DialogContent>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

InfoDialog.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  open: PropTypes.object,
  setOpen: PropTypes.object,
  message: PropTypes.object
}

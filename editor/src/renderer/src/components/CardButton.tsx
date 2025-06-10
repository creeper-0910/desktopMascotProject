import { Caption1, Card, CardHeader, Text } from '@fluentui/react-components'
import { useStyles } from '@renderer/styles'
import PropTypes from 'prop-types'

export function CardButton(props): React.JSX.Element {
  const styles = useStyles()
  return (
    <Card className={styles.card} orientation="horizontal" {...props.options}>
      <CardHeader
        header={<Text weight="semibold">{props.title}</Text>}
        description={<Caption1 className={styles.caption}>{props.subtitle}</Caption1>}
      />
    </Card>
  )
}

CardButton.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  options: PropTypes.object
}

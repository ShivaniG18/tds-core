import React from 'react'
import PropTypes from 'prop-types'
import { childrenOfType } from 'airbnb-prop-types'

import StandaloneIcon from '../Icons/StandaloneIcon/StandaloneIcon'
import Text from '../Typography/Text/Text'
import Paragraph from '../Typography/Paragraph/Paragraph'
import Box from '../Box/Box'
import Flexbox from '../Flexbox/Flexbox'
import Tooltip from '../Tooltip/Tooltip'
import Helper from './Helper/Helper'
import Fade from '../Animation/Fade'

import safeRest from '../../utils/safeRest'
import joinClassNames from '../../utils/joinClassNames'
import generateId from '../../utils/generateId'

import formFieldStyles from '../FormFields.modules.scss'
import styles from './Input.modules.scss'

const getWrapperClassName = (feedback, focus, disabled) => {
  if (disabled) {
    return styles.disabled
  }

  if (focus) {
    return styles.focus
  }

  if (feedback) {
    return styles[feedback]
  }

  return styles.default
}

const showFeedbackIcon = (feedback, focus) =>
  (feedback === 'success' || feedback === 'error') && !focus

class Input extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: this.props.value,
      focus: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.value) {
      this.setState({
        value: nextProps.value,
      })
    }
  }

  onChange = event => {
    const { onChange } = this.props

    this.setState({
      value: event.target.value,
    })

    if (onChange) {
      onChange(event)
    }
  }

  onFocus = event => {
    const { onFocus } = this.props

    this.setState({ focus: true })

    if (onFocus) {
      onFocus(event)
    }
  }

  onBlur = event => {
    const { onBlur } = this.props

    this.setState({ focus: false })

    if (onBlur) {
      onBlur(event)
    }
  }

  renderLabel(label, hint, inputId) {
    const labelClassNames = joinClassNames(styles.resetLabel, styles.label)

    return (
      <label htmlFor={inputId.identity()} className={labelClassNames}>
        <Box inline between={2}>
          <Text size="medium" bold>
            {label}
          </Text>

          {hint && <Text size="small">{hint}</Text>}
        </Box>
      </label>
    )
  }

  renderError(error, errorId) {
    return (
      <Helper id={errorId} feedback="error">
        <Paragraph size="small">{error}</Paragraph>
      </Helper>
    )
  }

  renderHelper(helper, helperId, feedback, value) {
    if (typeof helper === 'function') {
      return (
        <div id={helperId}>
          <Text size="small">{helper(feedback, value)}</Text>
        </div>
      )
    }

    return (
      <Helper id={helperId} feedback={feedback}>
        <Text size="small">{helper}</Text>
      </Helper>
    )
  }

  renderIcon(feedback) {
    if (feedback === 'success') {
      return (
        <StandaloneIcon
          symbol="checkmark"
          variant="primary"
          size={16}
          a11yText="The value of this input field is valid."
        />
      )
    }

    return (
      <StandaloneIcon
        symbol="exclamationPointCircle"
        variant="error"
        size={16}
        a11yText="The value of this input field is invalid."
      />
    )
  }

  render() {
    const { type, label, hint, feedback, error, helper, tooltip, ...rest } = this.props

    const inputId = generateId(rest.id, rest.name, label)
    const helperId = helper && inputId.postfix('helper')
    const errorId = error && inputId.postfix('error-message')

    const wrapperClassName = getWrapperClassName(feedback, this.state.focus, rest.disabled)

    const showIcon = showFeedbackIcon(feedback, this.state.focus)

    return (
      <Box between={2}>
        <Flexbox direction="row" dangerouslyAddClassName={formFieldStyles.containsTooltip}>
          {this.renderLabel(label, hint, inputId)}
          {tooltip && React.cloneElement(tooltip, { connectedFieldLabel: label })}
        </Flexbox>

        {helper && (
          <Box below={3}>{this.renderHelper(helper, helperId, feedback, this.state.value)}</Box>
        )}

        {error && <Box below={3}>{this.renderError(error, errorId)}</Box>}

        <Box horizontal={3} dangerouslyAddClassName={wrapperClassName} data-testid="inputWrapper">
          <Box inline between={3} dangerouslyAddClassName={styles.sizing}>
            <Box dangerouslyAddClassName={styles.fullWidth}>
              <input
                {...safeRest(rest)}
                id={inputId.identity()}
                type={type}
                className={styles.input}
                value={this.state.value}
                onChange={this.onChange}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                aria-invalid={feedback === 'error' ? 'true' : 'false'}
                aria-describedby={errorId || helperId || undefined}
              />
            </Box>

            <Fade timeout={100} in={showIcon} mountOnEnter={true} unmountOnExit={true}>
              {() => this.renderIcon(feedback)}
            </Fade>
          </Box>
        </Box>
      </Box>
    )
  }
}

Input.propTypes = {
  /**
   * The HTML5 type of the input field.
   */
  type: PropTypes.oneOf(['text', 'number', 'password', 'email', 'search', 'tel', 'url']),
  /**
   * The label.
   */
  label: PropTypes.string.isRequired,
  /**
   * Clarify the expected input.
   */
  hint: PropTypes.string,
  /**
   * The value.
   */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /**
   * A feedback state.
   */
  feedback: PropTypes.oneOf(['success', 'error']),
  /**
   * An error message. Either an error or a helper should be used, not both.
   */
  error: PropTypes.string,
  /**
   * A detailed explanation of the input expected by a form field. Can be text,
   * other components, or HTML elements.
   *
   * If a function is provided, it must return an `Input.Helper`. The function will be
   * invoked with the following arguments.
   *
   * @param {String} feedback The input's current feedback state.
   * @param {String} value The input's current value.
   */
  helper: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  /**
   * A `Tooltip`
   */
  tooltip: childrenOfType(Tooltip),
  /**
   * A callback function to be invoked when the input value changes.
   *
   * @param {SyntheticEvent} event The React `SyntheticEvent`
   */
  onChange: PropTypes.func,
  /**
   * A callback function to be invoked when the input receives focus.
   *
   * @param {SyntheticEvent} event The React `SyntheticEvent`
   */
  onFocus: PropTypes.func,
  /**
   * A callback function to be invoked when the input loses focus.
   *
   * @param {SyntheticEvent} event The React `SyntheticEvent`
   */
  onBlur: PropTypes.func,
}

Input.defaultProps = {
  type: 'text',
  hint: undefined,
  value: '',
  feedback: undefined,
  error: undefined,
  helper: undefined,
  tooltip: undefined,
  onChange: undefined,
  onFocus: undefined,
  onBlur: undefined,
}

Input.Helper = Helper

export default Input

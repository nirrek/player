import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

// m :: [StyleObject | Any ] -> StyleObject
// Given a list of style objects, produces a single style object that is a
// merger of all the passed style objects. Style objects are merged
// left-to-right, so styles from later objects will override earlier styles.
//
// Importantly, any items in the list that are not of type object, will be
// ignored. This supports the following use-case:
//   `let s = m(predicate && style, possiblyUndefinedStyle)`
const m = (objects) =>
  objects.reduce((acc, obj) => {
    if (typeof obj === 'object')
      Object.entries(obj).forEach(([key, val]) => acc[key] = val);
    return acc;
  }, {});

const RETURN_CHARCODE = 13;

export default class Input extends Component {
  constructor(props) {
    super(props);
    this.handleKeypress = this.handleKeypress.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      isFocused: false
    };
  }

  componentWillMount() {
    window.addEventListener('keypress', this.handleKeypress);
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.handleKeypress);
  }

  handleKeypress(e) {
    if (e.charCode === RETURN_CHARCODE
        && this.state.isFocused
        && this.props.onReturn) {
      this.props.onReturn(this.refs.input.value);
    }
  }

  handleFocus() {
    this.setState({ isFocused: true });
  }

  handleBlur() {
    this.setState({ isFocused: false });
  }

  render() {
    const { icon, onReturn, inputStyle, containerStyle, ...rest } = this.props;

    let iconDiv = icon && (
      <div>
        {icon}
      </div>
    );

    let mergedInputStyle = {
      backgroundColor: 'transparent',
      width: '100%',
      height: '100%',
      border: 'none',
      ...inputStyle,
    };

    const iconClass = classNames({
      [styles.icon]: true,
      [styles.iconFocused]: this.state.isFocused,
    });

    return (
      <div className={styles.container} style={containerStyle}>
        <div className={iconClass}>
          {icon}
        </div>
        <input
          autoComplete="off"
          autoCorrect="off"
          className={styles.input}
          ref="input"
          type="text"
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          style={mergedInputStyle}
          {...rest} />
      </div>
    );
  }
}

Input.propTypes = {
  icon: PropTypes.element,
  onReturn: PropTypes.func,
  inputStyle: PropTypes.object,
  containerStyle: PropTypes.object,
};

const styles = cssInJS({
  container: {
    display: 'flex',
    borderBottom: '1px solid rgba(0,0,0,.3)',
    alignItems: 'center',
  },
  input: {
    '::-webkit-input-placeholder': {
      color: 'rgba(255, 255, 255,.7)',
    },
    ':focus': {
      outline: 'none',
    }
  },
  icon: {
    transition: 'opacity 160ms ease-out',
  },
  iconFocused: {
    opacity: 0.5,
  }
});


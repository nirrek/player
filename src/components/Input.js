import React, { Component, PropTypes } from 'react';
import cn from 'classnames';
import { noop } from '../utils/utils.js';


export default class Input extends Component {
  constructor(props) {
    super(props);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.state = {
      isFocused: false
    };
  }

  handleKeyDown({ key }) {
    if (key === 'Enter')
      this.props.onReturn(this.refs.input.value);
  }

  handleFocus() {
    this.setState({ isFocused: true });
  }

  handleBlur() {
    this.setState({ isFocused: false });
  }

  render() {
    const { icon, inputStyle, containerStyle, ...rest } = this.props;
    const { isFocused } = this.state;
    return (
      <div className={styles.container} style={containerStyle}>
        <div className={cn(styles.icon, { [styles.iconFocused]: isFocused })}>
          {icon}
        </div>
        <input
          onKeyDown={this.handleKeyDown}
          autoComplete="off"
          autoCorrect="off"
          className={styles.input}
          style={inputStyle}
          ref="input"
          type="text"
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
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

Input.defaultProps = {
  onReturn: noop,
}

const styles = cssInJS({
  container: {
    display: 'flex',
    borderBottom: '1px solid rgba(0,0,0,.3)',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    border: 'none',
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


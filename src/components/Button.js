import React, { Component } from 'react';
import Hoverable from './Hoverable.js';
import { noop } from '../utils/utils.js';
import cn from 'classnames';

export default class Button extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleHoverChange = this.handleHoverChange.bind(this);
    this.state = {
      isHovered: false
    };
  }

  handleClick(event) {
    if (this.props.disabled) {
      event.preventDefault();
      return;
    }
    this.props.onClick(event);
  }

  handleHoverChange(isHovered) {
    this.setState({ isHovered });
  }

  render() {
    const { className, disabled, children, ...rest } = this.props;
    const buttonClasses = cn(
      styles.default,
      { [styles.disabled]: disabled },
      className,
    )
    return (
      <div className={buttonClasses}
           {...rest}
           onClick={this.handleClick} /* must take precedence over rest */>
        {children}
      </div>
    );
  }
}

Button.defaultProps = {
  onClick: noop,
};

const styles = cssInJS({
  default: {
    ':hover': { cursor: 'pointer' }
  },
  disabled: {
    opacity: 0.2,
    ':hover': { cursor: 'default' }
  },
});

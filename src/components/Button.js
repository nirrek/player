import React, { Component } from 'react';
import Hoverable from './Hoverable.js';

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
    const { children, disabled, style, ...rest } = this.props;
    const { isHovered } = this.state;
    const localStyle = {
      opacity: disabled ? 0.2 : 'inherit',
      cursor: isHovered && !disabled ? 'pointer' : 'default',
    }

    return (
      <Hoverable onHoverChange={this.handleHoverChange}>
        <div onClick={this.handleClick}
          style={{...style, ...localStyle}}
          {...rest}>
          {children}
        </div>
      </Hoverable>
    );
  }
}

Button.defaultProps = {
  onClick: () => {}
};

import React, { Component } from 'react';

export default class Hoverable extends Component {
  constructor(props) {
    super(props);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  handleMouseOver() {
    this.props.onHoverChange(true);
  }

  handleMouseOut() {
    this.props.onHoverChange(false);
  }

  render() {
    const { children, ...rest } = this.props;
    return (
      <div {...rest}
           onMouseOver={this.handleMouseOver}
           onMouseOut={this.handleMouseOut}>
        {children}
      </div>
    );
  }
}

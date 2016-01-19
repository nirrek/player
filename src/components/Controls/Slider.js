import React, { Component, PropTypes } from 'react';

// clamp :: (Number, Number) -> Number -> Number
// Clamps the provided value to the range [min, max].
const clamp =
  (min, max) =>
    (value) => Math.max(min, Math.min(max, value));

export default class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      widthIsCalculated: false,
      width: undefined,
      value: this.props.value,
      doTrack: false,
      isHovered: false,
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
  }

  componentWillMount() {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseDown(event) {
    const value = this.calcValue(event);
    this.setState({
      doTrack: true,
      value
    });
    this.props.onSlide(value);
  }

  handleMouseUp(event) {
    if (!this.state.doTrack) return;

    const value = this.calcValue(event);
    this.setState({
      doTrack: false,
      value,
    });
    this.props.onSlideEnd(value);
  }

  handleMouseMove(event) {
    if (!this.state.doTrack) return;
    const value = this.calcValue(event);
    this.setState({ value: this.calcValue(event) });
    this.props.onSlide(value);
  }

  // calcValue :: Event -> Number
  // Given a mouse position event, calculates the relevant value for the slider
  // that corresponds to that mouse position.
  calcValue(event) {
    const { min, max } = this.props;
    const range = max - min;
    const { left, width } = this.refs.hoverArea.getBoundingClientRect();
    const mouseFromLeft = event.pageX - left;
    const percentage = clamp(0, 1)(mouseFromLeft / width);
    return percentage * range;
  }

  handleMouseOver() {
    this.setState({ isHovered: true });
  }

  handleMouseOut() {
    this.setState({ isHovered: false });
  }

  componentWillReceiveProps(props) {
    // Don't let props update the slide if we are currently sliding it.
    if (this.state.doTrack) return;

    this.setState({ value: props.value });
  }

  render() {
    const { value, isHovered, doTrack } = this.state;
    const { min, max } = this.props;

    const clampedVal = clamp(min, max)(value);
    const percentage = ((value - min) / max) * 100;
    const widthStyle = { width: `${percentage}%`};
    const activeStyle = (isHovered || doTrack) ? { visibility: 'visible' } : {};

    return (
      <div onMouseOver={this.handleMouseOver}
           onMouseOut={this.handleMouseOut}
           onMouseDown={this.handleMouseDown}
           ref="hoverArea"
           style={styles.hoverArea}>
        <div className="barContainer" ref="barContainer"
             style={styles.barContainer}>
          <div style={{...styles.bar, ...widthStyle}}>
            <div style={{...styles.handle, ...activeStyle}}>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Slider.PropTypes = {
  value: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  onSlide: PropTypes.func,
  onSlideEnd: PropTypes.func,
};

Slider.defaultProps = {
  min: 0,
  max: 100,
  value: 0,
  onSlide: () => {},
  onSlideEnd: () => {},
};

// can't do hover without Radium
const styles = {
  hoverArea: {
    height: 20,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  barContainer: {
    height: 2,
    backgroundColor: 'rgba(0,0,0,.1)',
    width: '100%',
  },
  bar: {
    height: 2,
    backgroundColor: 'orange',
    position: 'relative',
  },
  handle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'orange',
    position: 'absolute',
    boxShadow: '0 1px 1px rgba(0,0,0,.2)',
    right: -5,
    top: -4,
    visibility: 'hidden',
  }
};

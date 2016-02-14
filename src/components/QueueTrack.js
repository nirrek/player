import React, { Component } from 'react';
import cn from 'classnames';
import Hoverable from './Hoverable.js';
import Play from 'react-icons/lib/md/play-circle-outline';
import Close from 'react-icons/lib/md/highlight-off';
import Button from '../components/Button.js';

export default class Track extends Component {
  constructor(props) {
    super(props);
    this.handleHoverChange = this.handleHoverChange.bind(this);

    this.state = {
      isHovered: false
    };
  }

  handleHoverChange(isHovered) {
    this.setState({ isHovered });
  }

  render() {
    const {
      id, title, isActiveTrack, playTrack, removeTrack,
    } = this.props;

    let actionStyle = this.state.isHovered
      ? { visibility: 'visible' }
      : { visibility: 'hidden' };

    return (
      <Hoverable onHoverChange={this.handleHoverChange}
        className={cn(trackStyles.row, { [trackStyles.rowActive]: isActiveTrack })}>
        <div className={trackStyles.flex}>
          <Button className={trackStyles.action} onClick={() => playTrack(id)}>
            <Play style={actionStyle} width={20} height={20} />
          </Button>
          <span className={trackStyles.title}>{title}</span>
          <Button className={trackStyles.action} onClick={() => removeTrack(id)}>
            <Close style={actionStyle} width={20} height={20} />
          </Button>
        </div>
      </Hoverable>
    )
  }
}

const trackStyles = cssInJS({
  row: {
    fontSize: 14,
    padding: '1em 10px',
    borderBottom: '1px solid #eee',
    ':hover': {
      cursor: 'default',
    }
  },
  rowActive: {
    color: '#0097FF',
  },
  flex: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    userSelect: 'none',
    flexGrow: 1,
    margin: '0 5px',
    display: 'block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  action: {
    position: 'relative',
    top: -1,
  }
});

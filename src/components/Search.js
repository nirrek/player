import React, { Component, PropTypes } from 'react';
import Input from './Input.js';
import SearchIcon from 'react-icons/lib/md/search';
import { noop } from '../utils/utils.js';

export default class Search extends Component {
  shouldComponentUpdate(newProps) {
    // onSearch and onChange will not be updateable after mounting.
    return newProps.query !== this.props.query;
  }

  render() {
    const { query, onSearch, onChange } = this.props;
    return (
      <div style={styles.form}>
        <Input placeholder="Search #tags or artists"
               autoFocus
               icon={
                <SearchIcon width={37} height={37}
                 style={{ marginRight: 5, color: 'rgba(255, 255, 255,1)' }} />
               }
               inputStyle={styles.input}
               containerStyle={styles.inputContainer}
               value={query}
               onChange={event => onChange(event.target.value)}
               onReturn={() => onSearch() } />
      </div>
    );
  }
}

Search.propTypes = {
  query: PropTypes.string,
  onSearch: PropTypes.func,
  onChange: PropTypes.func,
};

Search.defaultProps = {
  query: '',
  onSearch: noop,
  onChange: noop,
};

const styles = {
  form: {
    backgroundColor: '#0097FF',
    boxShadow: '0 1px 3px rgba(118, 132, 142, .7)',
    padding: '1em 1.5em',
    boxShadow: '0 1px 3px rgba(0,0,0,.3)',
  },
  input: {
    padding: '.32em 0 .5em 0',
    fontSize: 25,
    fontFamily: `HelveticaNeue-Thin, 'Helvetica Neue Thin', 'Segoe UI',
    'Helvetica Neue', Helvetica, Arial`,
    color: '#fff',
  },
  inputContainer: {
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: '1px solid rgba(255, 255, 255, .3)',
  }
};

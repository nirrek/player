import React, { PropTypes } from 'react';
import Radium from 'radium';

const Search = ({ query, onSearch, onChange }) => {
  return (
    <form
      style={styles.form}
      key="input"
      onSubmit={event => {
        event.preventDefault();
        onSearch();
    }}>
      <input type="text"
             value={query}
             onChange={event => onChange(event.target.value)}
             style={styles.input}
             key="input"/>
    </form>
  );
}

Search.propTypes = {
  query: PropTypes.string,
  onSearch: PropTypes.func,
  onChange: PropTypes.func,
};

Search.defaultProps = {
  query: '',
  onSearch: () => {},
  onChange: () => {},
};

const styles = {
  form: {
    backgroundColor: '#1EA1FF',
    boxShadow: '0 1px 3px rgba(118, 132, 142, .7)',
    padding: '1em 1.5em',
    boxShadow: '0 1px 3px rgba(0,0,0,.3)',
  },
  input: {
    border: 'none',
    width: '100%',
    height: '100%',
    padding: '.5em 0',
    fontSize: 25,
    fontWeight: 600,
    color: '#fff',
    borderBottom: '1px solid rgba(255, 255, 255, .3)',
    backgroundColor: 'transparent',
    transition: 'border-bottom 100ms ease-out',
    ':focus': {
      outline: 'none',
      borderBottom: '1px solid rgba(255, 255, 255, .4)',
    }
  }
};

export default Radium(Search);

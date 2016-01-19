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
    backgroundColor: '#eee',
    padding: '1em'
  },
  input: {
    border: 'none',
    width: '100%',
    height: '100%',
    fontSize: 25,
    fontWeight: 600,
    backgroundColor: 'transparent',
    ':focus': {
      outline: 'none',
    }
  }
};

export default Radium(Search);

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
    backgroundColor: '#F5FBFF',
    boxShadow: '0 1px 3px rgba(118, 132, 142, .7)',
    padding: '1em'
  },
  input: {
    border: 'none',
    width: '100%',
    height: '100%',
    fontSize: 25,
    fontWeight: 600,
    color: '#374754',
    textShadow: '0 1px 0 #fff',
    backgroundColor: 'transparent',
    textAlign: 'center',
    ':focus': {
      outline: 'none',
    }
  }
};

export default Radium(Search);

import React, { Component } from 'react';

export default class Palette extends Component {
  render() {
    return (
      <div>
        <h1> Palette </h1>
        <div className={styles.section}>
        </div>
      </div>
      );
  }
}

const styles = cssInJS({
  section: {
    padding: '2em',
    borderBottom: '1px solid rgba(0,0,0,.2)',
  }
});

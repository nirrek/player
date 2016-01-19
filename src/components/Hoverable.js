import React from 'react';

export default ({ children, onHoverChange }) => (
  <div onMouseEnter={() => onHoverChange(true)}
       onMouseLeave={() => onHoverChange(false)}>
    {children}
  </div>
);

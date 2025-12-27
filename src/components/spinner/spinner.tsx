import React from 'react';
import styles from './spinner.module.css';

function Spinner(): JSX.Element {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };

  return (
    <div style={containerStyle}>
      <div className={styles.spinner} data-testid="spinner" />
    </div>
  );
}

export default Spinner;

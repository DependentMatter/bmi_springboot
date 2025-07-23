import React from 'react';
import BmiForm from './BmiForm';

function App() {
  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>BMI Calculator</h2>
      <BmiForm />
    </div>
  );
}

export default App;

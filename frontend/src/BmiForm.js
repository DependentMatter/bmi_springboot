import React, { useState } from 'react';
import axios from 'axios';

function BmiForm() {
  const [form, setForm] = useState({ name: '', age: '', height: '', weight: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setResult(null);
    try {
      const res = await axios.post('http://localhost:8081/bmi', {
        name: form.name,
        age: parseInt(form.age),
        height: parseFloat(form.height),
        weight: parseFloat(form.weight)
      });
      setResult(res.data);
    } catch (err) {
      setError('Error calculating BMI. Please check your input and try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Age:</label>
        <input name="age" type="number" value={form.age} onChange={handleChange} required />
      </div>
      <div>
        <label>Height (meters):</label>
        <input name="height" type="number" step="0.01" value={form.height} onChange={handleChange} required />
      </div>
      <div>
        <label>Weight (kg):</label>
        <input name="weight" type="number" step="0.1" value={form.weight} onChange={handleChange} required />
      </div>
      <button type="submit">Calculate BMI</button>
      {result && (
        <div style={{ marginTop: 20 }}>
          <strong>BMI:</strong> {result.bmi.toFixed(2)}<br />
          <strong>Name:</strong> {result.name}<br />
          <strong>Age:</strong> {result.age}
        </div>
      )}
      {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
    </form>
  );
}

export default BmiForm;

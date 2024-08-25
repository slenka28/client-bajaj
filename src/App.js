import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Select from 'react-select';

function App() {
  const [jsonData, setJsonData] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  const validateJson = (data) => {
    try {
      JSON.parse(data);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (validateJson(jsonData)) {
      setError('');
      try {
        const res = await fetch('https://bajaj-voc2.onrender.com/bfhl', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: jsonData,
        });
        const result = await res.json();
        console.log(result);
        setResponse(result);
      } catch (err) {
        setError('Failed to fetch data from the API');
      }
    } else {
      setError('Invalid JSON input');
    }
  };

  const filterOptions = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase_alphabet', label: 'Highest Lowercase Alphabet' },
  ];

  return (
    <div className="container mt-5">
      <div className="mb-3">
        <label htmlFor="jsonInput" className="form-label">API Input</label>
        <textarea
          id="jsonInput"
          className="form-control"
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
          placeholder='{"data":["A","C","Z","c","i"]}'
        />
      </div>
      <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
      {error && <p className="text-danger mt-2">{error}</p>}
      <div className="mt-3">
        <label className="form-label">Multi Filter</label>
        <Select
          isMulti
          value={selectedFilters}
          onChange={setSelectedFilters}
          options={filterOptions}
        />
      </div>
      <div className="mt-3">
        <h5>Filtered Response</h5>
        {selectedFilters.map(filter => (
          <p key={filter.value}>
            {filter.label}: {response && response[filter.value].length > 0 ? response[filter.value].join(',') : 'None'}
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;

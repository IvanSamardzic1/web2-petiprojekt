// AKDComponent.js
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import './tablicaoriginal.css';

const AKDComponent = () => {
  const [infoStat, setInfoStat] = useState(null);
  const [version, setVersion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dohvaćanje podataka sa servera "https://idissuer-api.akd.hr"
        const response1 = await fetch('idissuer-api/infostat', {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data1 = await response1.json();
        setInfoStat(data1);

        const response2 = await fetch('idissuer-api/ver', {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data2 = await response2.json();
        setVersion(data2);

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Parsiranje podataka
  const parsedCodesPerDay = JSON.parse(infoStat.codes_per_day);
  const parsedCodesPerMonth = JSON.parse(infoStat.codes_per_month);

  // Priprema podataka za grafikone
  const datesPerDay = parsedCodesPerDay.map(item => item.dat);
  //const countsPerDay = parsedCodesPerDay.map(item => item.cnt);
  const quantitiesPerDay = parsedCodesPerDay.map(item => item.qty);

  const monthsPerMonth = parsedCodesPerMonth.map(item => item.month);
  //const countsPerMonth = parsedCodesPerMonth.map(item => item.cnt);
  const quantitiesPerMonth = parsedCodesPerMonth.map(item => item.qty);

  // Konfiguracija podataka za grafikone
  const dataPerDay = {
    labels: datesPerDay,
    datasets: [
      /*{
        label: 'Count',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255, 99, 132, 0.4)',
        hoverBorderColor: 'rgba(255, 99, 132, 1)',
        data: countsPerDay
      },*/
      {
        label: 'Quantity',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(54, 162, 235, 0.4)',
        hoverBorderColor: 'rgba(54, 162, 235, 1)',
        data: quantitiesPerDay
      }
    ]
  };

  const dataPerMonth = {
    labels: monthsPerMonth,
    datasets: [
      /*{
        label: 'Count',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255, 99, 132, 0.4)',
        hoverBorderColor: 'rgba(255, 99, 132, 1)',
        data: countsPerMonth
      },*/
      {
        label: 'Quantity',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(54, 162, 235, 0.4)',
        hoverBorderColor: 'rgba(54, 162, 235, 1)',
        data: quantitiesPerMonth
      }
    ]
  };

// Provjera da li su podaci u ispravnom formatu
if (!infoStat.products_json) {
  return <div>Error: No product data available</div>;
}

// Parsiranje podataka
const productsData = JSON.parse(infoStat.products_json).products.product;

// Priprema podataka za grafikon
const countries = productsData.map(product => product.country);
const requests = productsData.map(product => product.requests);

const generateRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, 0.2)`;
};

const generateRandomBorderColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgba(${r}, ${g}, ${b}, 1)`;
};

// Konfiguracija podataka za grafikon
const dataProducts = {
  labels: countries,
  datasets: [
    {
      label: '# Requests',
      data: requests,
      backgroundColor: Array.from({ length: countries.length }, () => generateRandomColor()),
      borderColor: Array.from({ length: countries.length }, () => generateRandomBorderColor()),
      borderWidth: 1,
    },
  ],
};

// Prebrojavanje država
const uniqueCountries = productsData.reduce((accumulator, currentValue) => {
  if (!accumulator.includes(currentValue.country)) {
    accumulator.push(currentValue.country);
  }
  return accumulator;
}, []);

// Broj država
const numberOfCountries = uniqueCountries.length;

const chartStyle = {
  width: '80%',
  margin: '0 auto' // Centriranje grafikona
};

// Priprema podataka za tablicu
const tableData = parsedCodesPerDay.map(({ dat, cnt, qty }) => ({ dat, cnt, qty }));

const options = {
  indexAxis: 'y',
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: 'Horizontalni',
    },
  },
};

  return (
    <div>
      <h2>Tablični prikaz(Codes Per Day):</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Code Count</th>
            <th>Code Quantity</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map(({ dat, cnt, qty }, index) => (
            <tr key={index}>
              <td>{dat}</td>
              <td>{cnt}</td>
              <td>{qty}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>InfoStat AKD:</h2>
      <div style={chartStyle}>
        <h3>Codes Per Day(horizontalni grafikon):</h3>
        <Bar options={options} data={dataPerDay} />
        <h3>Codes per day average: {infoStat.codes_per_day_average}</h3>
        <h3>Codes Per Month(vertikalni):</h3>
        <Bar data={dataPerMonth} />
        <h3>Codes Per Month Average: {infoStat.codes_per_month_average}; Codes Total: {infoStat.codes_total}</h3>
        <h2>Requests Per Country:</h2>
        {/*<Bar data={dataProducts} />*/}
        <div className="pie-chart-container">
        <Pie data={dataProducts} />
        <h3>Requests total: {infoStat.requests_total}; Requests urgent: {infoStat.requests_urgent}</h3>
        <h3>Number of Countries: {numberOfCountries}</h3>
        </div>
        
      </div>
      <h2>InfoStat https://idissuer-api.akd.hr:</h2> 
      <pre>{JSON.stringify(infoStat, null, 2)}</pre> 
      <h2>Ver https://idissuer-api.akd.hr:</h2>
      <pre>{JSON.stringify(version, null, 2)}</pre>
    </div>
  );
};


export default AKDComponent;
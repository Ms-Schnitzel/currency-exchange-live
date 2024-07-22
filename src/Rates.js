import React from 'react';
import ReactDOM from 'react-dom/client';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Dropdown from './Dropdown.js'
import {useState, useEffect} from 'react';

export default function Rates() {

  const [base, setBase] = useState("usd");
  const [rates, setRates] = useState([]);


  useEffect(() => {
    apiPull();
    // console.log("rates in effect: ", rates);
  }, [base]);


  function Table() {
    const listElements = rates.map(item => <li className="d-flex flex-row justify-content-between border border-2 border-dark rounded-2 my-2 p-1 bg-secondary" key={item.country}><div className="col-6 border border-2 border-dark bg-light text-center">{item.country}</div><div className="col-6 border border-2 border-dark bg-light text-center">{item.rate}</div></li>);
    return (
      <ul className="">
        {listElements}
      </ul>
    )
  }


  const apiPull = async () => {
    fetch(`https://api.frankfurter.app/latest?from=${base}`).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request was either a 404 or 500');
    }).then((data) => {
      // console.log("json response: ", data);

      let rateArray = [];
      for (let [country, rate] of Object.entries(data.rates)) {
        let newRate = {
          country: country,
          rate: rate
        };
        // console.log(newRate);
        rateArray = [...rateArray, newRate];
      }
      // console.log("Array: ", rateArray);
      const newData = [...rateArray];

      setRates(newData);
      return ;

    }).catch((error) => {
      console.log(error);
    })
  }

  
  const handleBaseUpdate = () => {
    let val = document.querySelector("#table-drop select");
    apiPull();
    setBase(val.value);
    // console.log(rates);
  }

  
  return (
    <main>
      <div className="d-flex flex-column align-items-center" id="rates-table">
        <div 
          className="col-6 m-3"
          id="table-drop"
          onChange={() => handleBaseUpdate()}
        >
          <Dropdown />
        </div>
        <div 
          className="row d-flex flex-row border-test col-12 scroll pt-3 border bg-black bg-opacity-25 border-3 rounded-3 border-success" 
          id="rate-root"
        >
          <Table />
        </div>
      </div>
    </main>
  )
}
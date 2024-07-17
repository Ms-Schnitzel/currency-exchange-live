import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Dropdown from './Dropdown.js'
import {useState, useEffect} from 'react';

export default function Rates() {

  let ratesTo = {
    index: []
  };
  
  useEffect(() => {
    const apiPull = async () => {
      fetch('https://api.frankfurter.app/latest?from=USD').then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request was either a 404 or 500');
      }).then((data) => {
        // console.log("json response: ", data);
  
        ratesTo = data.rates;
        ratesTo.index = Object.keys(ratesTo);
        rateDisplay();
        return ratesTo;
  
      }).catch((error) => {
        console.log(error);
      })
    }

    apiPull();
  }, []);  

  const rateDisplay = () => {
    console.log(ratesTo.index.length);
    let rootTable = document.getElementById("rate-root");
    for (let i = 0; i < ratesTo.index.length; i++) {
      let indexName = ratesTo.index[i];
      let indexVal = ratesTo[indexName];
      let newDiv = document.createElement("div");
      let pInName = document.createElement("p");
      let nameText = document.createTextNode(`${indexName}`);
      let pInVal = document.createElement("p");
      let valText = document.createTextNode(`${indexVal}`);

      pInName.classList.add("col-6", "border", "border-2", "border-black", "bg-success", "bg-opacity-25");
      pInName.append(nameText);
      pInVal.classList.add("col-6", "border", "border-2", "border-black", "bg-success", "bg-opacity-25");
      pInVal.append(valText);
      
      newDiv.append(pInName, pInVal);
      newDiv.classList.add("col-12", "col-lg-8", "d-inline-flex", "flex-row", "mx-auto", "px-3", "py-0");

      rootTable.append(newDiv);
    }

  }

  // apiPull();
  rateDisplay();

  const rateClear = (e) => {
    let tableRoot = document.getElementById('rate-root');
    tableRoot.innerHTML = "";
  }

  const rateUpdate = () => {

    let tableSet = document.querySelector('#rates-table select');

    console.log("tableSet: ", tableSet);

    fetch(`https://api.frankfurter.app/latest?from=${tableSet.value}`).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request was either a 404 or 500');
    }).then((data) => {
      // console.log("json response: ", data);

      ratesTo = data.rates;
      ratesTo.index = Object.keys(ratesTo);

      rateClear();
      rateDisplay();
      return ratesTo;

    }).catch((error) => {
      console.log(error);
    })
  }
  
  return (
    <main>
      <div className="d-flex flex-column align-items-center" id="rates-table">
        <div 
          className="col-6 m-3"
          onChange={() => rateUpdate()}
        >
          <Dropdown />
        </div>
        <div className="row d-flex flex-row border-test col-12 scroll pt-3 border bg-black bg-opacity-25 border-3 rounded-3 border-success" id="rate-root">
        </div>
      </div>
    </main>
  )
}
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Dropdown from './Dropdown.js'
import $ from 'jquery';
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
    for (let i = 0; i < ratesTo.index.length; i++) {
      let indexName = ratesTo.index[i];
      // console.log(ratesTo.index);
      let indexVal = ratesTo[indexName];
      $("#rate-root").append(`<div></div>`).addClass("col-12 col-lg-8 d-inline-flex flex-row mx-auto p-2 border bg-black bg-opacity-25 border-3 rounded-3 border-success desk-divide").append(`<p>${indexName}</p><p>${indexVal}</p>`);
      $("#rate-root p").addClass("col-6 border border-2 border-black bg-success bg-opacity-25")
    }
  }

  // apiPull();
  rateDisplay();

  const rateClear = (e) => {
    $('#rate-root').children().remove();
  }

  const rateUpdate = () => {

    let tableSet = $('#rates-table').find('select');

    console.log("tableSet: ", tableSet);

    fetch(`https://api.frankfurter.app/latest?from=${tableSet.val()}`).then((response) => {
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
        <div className="row d-flex flex-row border-test col-12 scroll" id="rate-root">
        </div>
      </div>
    </main>
  )
}
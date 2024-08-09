import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import React from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import Dropdown from './Dropdown.js';
import Rates from './Rates.js';
import { useState, useEffect } from 'react';



function App() {

  const [input, setInput] = useState("USD");
  const [output, setOutput] = useState("USD");
  const [outbox, setOutbox] = useState(0);
  const [exchange, setExchange] = useState(3);
  const [dates, setDates] = useState({
    today: "",
    previous: ""
  });
  const [chartData, setChartData] = useState([
    {
      id: 1,
      date: "--",
      rate: 0
    }
  ]);


  useEffect(() => {
    apiHistory();
    if (input !== output) {
      apiInput();
      handleOutboxUpdate();
      return;
    } else {
      setExchange(1);
      handleOutboxUpdate();
      return;
    }
  }, [input, output, exchange, dates]);
  

  const apiInput = async () => {
    fetch(`https://api.frankfurter.app/latest?from=${input}&to=${output}`).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request was either a 404 or 500');
    }).then((data) => {
      // console.log("json response: ", data);      
      let exRate = data.rates[output];
      setExchange(exRate);

      return

    }).catch((error) => {
      console.log(error);
    })
  }


  const handleDropUpdate = () => {
    let valIn1 = document.querySelector('#input-drop select').value;
    setInput(valIn1);
    let valOut1 = document.querySelector('#output-drop select').value;
    setOutput(valOut1);
    handleOutboxUpdate();
    
    return;
  }


  const handleOutboxUpdate = () => {
    let valInbox = document.querySelector('#input-box').value;
    let valOutbox = valInbox * exchange;
    setOutbox(valOutbox);
    // console.log(input);
    return;
  }

  let timer;
  function conDelay() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      handleOutboxUpdate();
    }, 500);
    return;
  }


  const handleValSwitch = () => {
    let boxIn = document.querySelector("#input-drop select");
    let boxOut = document.querySelector("#output-drop select");
    let valIn = boxIn.value;
    let valOut = boxOut.value;

    boxIn.value = valOut;
    boxOut.value = valIn;
    
    handleDropUpdate();
  }


    //======================================================================================



  const handleDateSet = (e) => {
    let n = e.target.value;
    let today = new Date();

    let presentDate = {
      day: today.getDate(),
      month: today.getMonth() + 1,
      year: today.getFullYear()
    }
    if (presentDate.day < 10) {
      presentDate.day = '0' + presentDate.day;
    }
    if (presentDate.month < 10) {
      presentDate.month = '0' + presentDate.month;
    }

    const newPresent = {...presentDate};


    let past = new Date();
    past.setDate(past.getDate() - Math.abs(parseInt(n)));

    let pastDate = {
      day: past.getDate(),
      month: past.getMonth() + 1,
      year: past.getFullYear()
    }
    if (pastDate.day < 10) {
      pastDate.day = '0' + pastDate.day;
    }
    if (pastDate.month < 10) {
      pastDate.month = '0' + pastDate.month;
    }

    const newPast = {...pastDate};

    setDates({
      today: `${newPresent.year}-${newPresent.month}-${newPresent.day}`,
      previous: `${newPast.year}-${newPast.month}-${newPast.day}`
    })

  }

  const apiHistory = async () => {
    if (input === output) {
      console.log("please select your currencies")
    } else {
      fetch(`https://api.frankfurter.app/${dates.previous}..${dates.today}?from=${input}&to=${output}`).then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Request was either a 404 or 500');
      }).then((data) => {
        console.log("json response: ", data);  
        let historyArray = [];
        for (let [key, value] of Object.entries(data.rates)) {
          let newVal = value[output];
          let oldRate = {
            date: key,
            rate: newVal
          }
          historyArray = [...historyArray, oldRate];
        }

        console.log("history: ", historyArray);

        const newHistory = [...historyArray];
        
        setChartData(newHistory);

        return

      }).catch((error) => {
        console.log(error);
      })
    }
  }

 
  return (
    <Router basename="/currency-exchange-live">
    <main>
      
      <div className="background">
        <nav className="navbar navbar-expand-lg navbar-light mx-5 d-flex justify-content-center">
          <div className="navbar-brand fs-2 text-center fw-bold">Foreign Rates<br />and Exchanges</div>
        </nav>
        <div className="container">
          <div className="row">

            <div className="to-all col-12 col-md-4 order-2 order-md-1 p-0">
              <div className="d-flex flex-column align-items-center my-3">
                <div className="h3 text-center">Global Exchange Rates</div>
                <div className="col-10">
                  <Rates />
                </div>
              </div>
              <div className="social-align col-8 mt-3 mb-2 mx-auto p-2 border border-dark border-2 rounded-pill bg-light text-center d-block d-md-none">Check out my portfolio!<br /><a href="https://delicate-croissant-9ec4ef.netlify.app/">Zac's Portfolio</a></div>

            </div>

            <div className="to-single col-12 col-md-8 order-1 order-md-2 d-flex flex-column justify-content-center">
              <div className="h1 text-center">Focused Exchange</div>

              {/* Currency set box */}
              <div className="row mt-2 mt-md-5 px-md-3 py-5 border border-3 border-dark rounded-top-5 border-bottom-0 bg-secondary bg-gradient">
                <div className="d-flex flex-row justify-content-around">
                  <div className="col-4" id="input-drop">
                    <Dropdown onChange={handleDropUpdate} />
                  </div>
                  <div className="col-4 col-md-2 p-1 d-flex align-items-center justify-content-center border border-dark rounded bg-light">
                    <div className="align-items-center mx-1">To</div>
                    <button 
                    type="button" 
                    className="btn btn-secondary py-0 mx-1"
                    onClick={() => handleValSwitch()}>
                      <i className="fa-solid fa-arrow-right-arrow-left"></i>
                    </button>
                  </div>
                  <div className="col-4" id="output-drop">
                    <Dropdown onChange={handleDropUpdate} />
                  </div>
                </div>
              </div>

              {/* User input/convert output box */}
              <div className="row px-3 py-5 border border-3 border-dark rounded-bottom-5 bg-secondary bg-gradient">
                <div className="d-flex flex-row justify-content-around">
                  <input 
                  className="col-4 border border-2 border-dark rounded p-2" 
                  id="input-box" 
                  type="number"
                  
                  onChange={() => conDelay()}
                  />
                  <div className="col-4 col-md-2 d-flex align-items-center justify-content-center border border-2 border-dark rounded bg-light p-1">
                    <div className="align-items-center mx-2">To</div>
                  </div>
                  <input className="col-4 border border-2 border-dark rounded p-1 bg-light" id="output-box" value={outbox} disabled/>
                </div>
              </div>

              {/* Chart Add-in */}
              <div className="h1 mt-4 text-center">Historical Exchange Rate</div>
              <div className="row mt-2 mb-4 px-3 py-5 border border-dark rounded-5 ">
                <div className="d-inline-flex justify-content-center align-items-center flex-md-row flex-column">
                  <p className="mb-1 py-2 px-2 text-center">The rate history for converting {input} to {output} over the last</p> 
                  <div className="input-group days-width">
                    <select 
                      className="form-select" 
                      aria-label="Set history timeframe"
                      id="daysAddon"
                      defaultValue="--"
                      onChange={handleDateSet}
                    >
                      <option value="--" disabled>--</option>
                      <option value="30">30</option>
                      <option value="60">60</option>
                      <option value="90">90</option>
                    </select>
                    <span className="input-group-text" htmlFor="daysAddon">Days</span>
                  </div>
                </div>
                <div>From {dates.previous} to {dates.today}</div>

                <div className="line-chart">
                  <Line 
                    data={{
                      labels: chartData.map((data) => data.date),
                      datasets: [
                        {
                          label: "Rate",
                          data: chartData.map((data) => data.rate),
                        },
                      ],
                    }}
                  />
                </div>
              </div>

              <div className="social-align mt-3 p-2 border border-dark border-2 rounded-pill bg-light text-center d-none d-md-block">Check out my portfolio!<br /><a href="https://delicate-croissant-9ec4ef.netlify.app/">Zac's Portfolio</a></div>
            </div>
            
          </div>
        </div>
      </div>
    </main>
    </Router>
  );
}

export default App;




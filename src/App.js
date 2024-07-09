import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Dropdown from './Dropdown.js';
import Rates from './Rates.js';
import $ from 'jquery';
// import Rates from './Rates.js';

function App() {

  // fetch('https://api.frankfurter.app/latest').then((response) => {
  //   if (response.ok) {
  //     return response.json();
  //   }
  //   throw new Error ('Request was either a 404 or 500');
  // }).then((data) => {
  //   console.log('json data: ', data);
  // }).catch((error) => {
  //   console.log(error);
  // })

  

  let getInput = "";
  let getOutput = "";

  

  const apiInput = async () => {
    fetch(`https://api.frankfurter.app/latest?from=${getInput}&to=${getOutput}`).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request was either a 404 or 500');
    }).then((data) => {
      console.log("json response: ", data);
      let inputBox = $('#input-box');
      let outputBox = $('#output-box');
      let exRate = data.rates[getOutput];
      console.log(exRate);
      console.log("input box: ", inputBox.val());

      outputBox.val(inputBox.val() * exRate);

      return

    }).catch((error) => {
      console.log(error);
    })
  }

  const handleValUpdate = () => {
    getInput = $("#input-drop").find('select').val();
    getOutput = $("#output-drop").find('select').val();
    let inputBox = $('#input-box');
    let outputBox = $('#output-box');
    if (getInput === getOutput) {
      outputBox.val(inputBox.val());
      return outputBox;
    }
    apiInput();
  }

  let timer;
  function conDelay() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      handleValUpdate();
    }, 500);
    return;
  }

  const handleValSwitch = () => {
    let valIn = $("#input-drop").find('select').val();
    let valOut = $("#output-drop").find('select').val();

    $("#input-drop").find('select').val(valOut);
    $("#output-drop").find('select').val(valIn);

    handleValUpdate();
  }



  return (
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
                  <div 
                  className="col-4" 
                  id="input-drop"
                  onChange={() => handleValUpdate()}
                  >
                    <Dropdown />
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
                  <div 
                  className="col-4" 
                  id="output-drop"
                  onChange={() => handleValUpdate()}
                  >
                    <Dropdown />
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
                  <input className="col-4 border border-2 border-dark rounded p-1 bg-light" id="output-box" disabled/>
                </div>
              </div>
              <div className="social-align mt-3 p-2 border border-dark border-2 rounded-pill bg-light text-center d-none d-md-block">Check out my portfolio!<br /><a href="https://delicate-croissant-9ec4ef.netlify.app/">Zac's Portfolio</a></div>
            </div>

            <footer>
              {/* <div className="position-fixed end-50">Socials</div> */}
            </footer>
            
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;

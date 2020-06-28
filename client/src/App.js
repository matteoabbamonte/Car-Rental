import React from 'react';
import moment from 'moment'
import CarTable from './components/CarTable';
import InitialForm from './components/InitialForm';
import Configurator from './components/Configurator';
import PriceDashboard from './components/PriceDashboard';
import Navbar from './components/NavBar';
import API from './api/API';
import { Route, Redirect, Switch, BrowserRouter as Router } from 'react-router-dom';
import Login from './components/Login';
import PaymentForm from './components/PaymentForm';
import RentalHistory from './components/RentalHistory';
import './background.css'

const colorsVec = ["primary", "secondary", "success", "danger", "warning", "info", "dark"];
let i = 0;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cars: [],
      totCars: 0,
      carNumbers: {},
      brands: [],
      categories: [],
      colors: {},
      logged: false,
      public: true,
      currentPrice: 0,
      modifiers: [],
      modifiersVec: [],
      rentals: [],
      user: {},
      period: [],
      loading: false
    }
  }

  componentDidMount() {
    //on load/reload page: checking whether the user is already authenticated
    API.checkAuthentication().then(
      (userObj) => {
        //authenticated user: gain fundamental user and session info by using the jwt token and reload data
        this.setState({ logged: true, user: userObj, public: false, loading: false });
        this.loadInitialData();
      }
    ).catch((err) => {
      //if not, logout
      this.logout();
    });
  }

  loadInitialData = () => {
    this.setState({ cars: 'loading' });
    //getting all cars in database: same as the public table -> neither brand nor color specified
    API.getPublicCars(null, null).then((cars) => {
      var brands = [];
      var categories = [];
      var carNumbers = {};
      var colors = {};
      //listing every brand and category for the current car list
      for (const c of cars) {
        brands.push(c.brand);
        categories.push(c.category);
      }
      //brands will contain just one occurence for each car brand
      brands = [...new Set(brands)];
      //categories will contain just one occurence for each car category
      categories = [...new Set(categories)];
      //assigning random color badge to each brand
      brands.forEach((brand) => {
        colors[brand] = colorsVec[i++];
        if (i === colorsVec.length) {
          i = 0;
        }
      });
      //calculating the number of cars for each category
      categories.forEach((category) => {
        carNumbers[category] = cars.filter((c) => c.category === category).length;
      })
      this.setState({
        brands: brands,
        categories: categories,
        colors: colors,
        cars: cars,
        totCars: cars.length,
        carNumbers: carNumbers,
        currentPrice: 0,
        modifiers: [],
        modifiersVec: [],
        rentals: [],
        period: []
      });
    });
  }

  handleAuthFailure = (err) => {
    //function for handling an "unauthorised operation" due to the token expiration
    if (err) {
      if (err.status && err.status === 401) {
        this.setState({ authErr: err.errorObj });
        this.logout();
      }
    }
  }

  getFilteredCars = (category, brand) => {
    this.setState({ cars: 'loading' });
    API.getPublicCars(category, brand).then((cars) => {
      this.setState({ cars: cars, totCars: cars.length })
    })
  }

  afterLogin = (userObj) => {
    //propagation of the real login operation executed within the so-called component
    this.setState({ logged: true, user: userObj, public: false });
    this.loadInitialData();
  }

  logout = () => {
    API.logout().then(
      () => {
        this.setState({
          logged: false,
          public: true,
          user: {},
        })
        this.loadInitialData()
      }
    );
  }

  getRentals = () => {
    //getting simple rental info (extended=false)
    if (this.state.rentals.length === 0) {
      API.getRentals(false).then((rentals) => {
        this.setState({ rentals: rentals });
      }).catch((err) => this.handleAuthFailure(err))
    }
  }


  filterRental = (category, period) => {
    //function for calculating price and getting info on the available cars in real-time
    this.getRentals(false);
    this.setState({ cars: 'loading' });
    //getting info on the available cars, depending on selected category and period
    API.getPrivateCars(category, period).then((cars) => {
      var modifiers = this.state.modifiers;
      var modifiersVec = this.state.modifiersVec;
      var rentals = this.state.rentals;
      //selecting only the past rentals in order to understand whether the user is frequent or not
      rentals.filter(rental => (moment(rental.end_date).isBefore(moment())));

      //insert or update of the "Frequent customer" modifier
      if (modifiersVec.includes("freqCust")) {
        if (rentals.length >= 3) {
          //if there are >=3 past rentals for the user -> insert discount
          modifiers[modifiersVec.indexOf("freqCust")] = 0.9;
        } else {
          //if not -> remove the modifier
          modifiersVec.splice(modifiersVec.indexOf("freqCust"), 1);
          modifiers.splice(modifiersVec.indexOf("freqCust"), 1);
        }
      } else {
        if (rentals.length >= 3) {
          modifiersVec.push("freqCust");
          modifiers.push(0.9);
        }
      }

      //insert or update of the "Less than 10% of cars left" modifier
      if (modifiersVec.includes("carsNumber")) {
        if (cars.length / this.state.carNumbers[category] < 0.1) {
          //if there are less than 10% of cars left -> insert surcharcge
          modifiers[modifiersVec.indexOf("carsNumber")] = 1.1;
        } else {
          //if not -> remove the modifier
          modifiersVec.splice(modifiersVec.indexOf("carsNumber"), 1);
          modifiers.splice(modifiersVec.indexOf("carsNumber"), 1);
        }
      } else {
        if (cars.length / this.state.carNumbers[category] < 0.1) {
          modifiers.push(1.1);
          modifiersVec.push("carsNumber");
        }

      }

      var price;
      //if a category is specified the base price can be multiplied for every modifier
      if (category) {
        //if there is at least one available car select its base price and execute the multiplication
        price = cars[0] ? cars[0].price : 0;
        for (var factor of this.state.modifiers) {
          price = price * factor;
        }
        price = Math.round(price * 100) / 100;
      } else {
        price = 0;
      }
      this.setState({ currentPrice: price, cars: cars, period: period, totCars: cars.length });

    }).catch((err) => this.handleAuthFailure(err))
  }

  modifyPrice = (modifier) => {     //modifier[0]: name, modifier[1]: value 
    //this function handles the user inserted modifiers
    var modifiers = this.state.modifiers;
    var modifiersVec = this.state.modifiersVec;
    
    //insert or update of a general modifier
    if (modifiersVec.includes(modifier[0])) {
      if (modifier[1] !== 0) {
        //if the modifier has been CHANGED without deleting it -> update the modifier in the vector
        modifiers[modifiersVec.indexOf(modifier[0])] = modifier[1];
      } else {
        //if the modifier has been DELETED -> remove the modifier from the vector
        modifiers.splice(modifiersVec.indexOf(modifier[0]), 1);
        modifiersVec.splice(modifiersVec.indexOf(modifier[0]), 1);
      }
    } else {
      modifiersVec.push(modifier[0]);
      modifiers.push(modifier[1]);
    }
    //re-compute the final price for every modifier
    var price = this.state.cars[0].price
    for (var factor of modifiers) {
      price = price * factor;
    }
    this.setState({ modifiers: modifiers, modifiersVec: modifiersVec, currentPrice: Math.round(price * 100) / 100 });
  }

  checkForm = () => {
    //checking whether the form has been fully compiled
    if (this.state.currentPrice > 0 &&                    //it means that a category has been selected
      this.state.period &&                                //control over the period spec
      this.state.modifiersVec.includes("km") &&
      this.state.modifiersVec.includes("age") &&
      this.state.modifiersVec.includes("nDrivers")) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    return (<>
      <div className="background container-fluid">
        <Router>
          <Navbar logout={this.logout}
            logged={this.state.logged} />

          <Switch>


            <Route path="/login" render={() => {
              return (
                <Login afterLogin={this.afterLogin}
                  logged={this.state.logged}
                  public={this.state.public} />
              )
            }}>
            </Route>


            <Route path="/public" render={() => {
              return (<>
                <InitialForm logged={this.state.logged}
                  brands={this.state.brands}
                  getFilteredCars={this.getFilteredCars} />
                <CarTable logged={this.state.logged}
                  cars={this.state.cars}
                  colors={this.state.colors}
                  public={true} />
              </>)
            }
            } />


            <Route path="/configure" render={() => {
              return (
                <div className="row justify-content-between">
                  <Configurator logged={this.state.logged}
                    filterRental={this.filterRental}
                    modifyPrice={this.modifyPrice} />

                    {/* if there are no cars available then center the position of the price dashboard with its message */}
                  <div className={!(this.state.cars !== "loading" && this.state.totCars === 0) ?
                    "mr-4 col-5" :
                    "mx-auto col-5 d-flex align-items-center"}>
                    <PriceDashboard loadInitialData={this.loadInitialData}
                      currentPrice={this.state.currentPrice}
                      numCars={this.state.totCars}
                      checkForm={this.checkForm}
                      isStateClean={this.state.modifiersVec.length <= 2} />

                      {/* show the table only if there are available cars */}
                    {(this.state.cars !== "loading" && this.state.totCars === 0) || <CarTable logged={this.state.logged}
                      cars={this.state.cars}
                      colors={this.state.colors}
                      public={false}
                      checkForm={this.checkForm} />}
                  </div>
                </div>)
            }} />


            <Route path="/payment" render={() => {
              return (<>
                {this.state.logged && <PaymentForm modifiers={this.state.modifiers}
                  modifiersVec={this.state.modifiersVec}
                  freqCust={this.state.rentals.filter(rental => (moment(rental.end_date).isBefore(moment())))}
                  currentPrice={this.state.currentPrice}
                  colors={this.state.colors}
                  handleAuthFailure={this.handleAuthFailure}
                  rentalObj={{ car: this.state.cars[0], startDate: moment(this.state.period[0]).format('YYYY-MM-DD'), endDate: moment(this.state.period[1]).format('YYYY-MM-DD'), price: this.state.currentPrice }} />}
              </>)
            }} />


            <Route path="/history" render={() => {
              return (<>
                {this.state.logged && <RentalHistory colors={this.state.colors} handleAuthFailure={this.handleAuthFailure} />}
              </>)
            }} />


          </Switch>

          {this.state.public && !this.state.logged && <Redirect to="/public" />}

        </Router>
      </div>
    </>)
  }

}

export default App;

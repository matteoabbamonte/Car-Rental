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
      period: []
    }
  }

  componentDidMount() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.setState({cars: 'loading'});
    API.getPublicCars(null, null).then((cars) => {
      var brands = [];
      var categories = [];
      var colors = {};
      for (const c of cars) {
        brands.push(c.brand);
        categories.push(c.category);
      }
      brands = [...new Set(brands)];
      categories = [...new Set(categories)];
      brands.forEach((brand) => {
        colors[brand] = colorsVec[i++];
        if (i === colorsVec.length) {
          i = 0;
        }
      });

      this.setState({ brands: brands, categories: categories, colors: colors, cars: cars, totCars: cars.length });
    });
  }

  getFilteredCars = (category, brand) => {
    this.setState({cars: 'loading'});
    API.getPublicCars(category, brand).then((cars) => {
      this.setState({ cars: cars })
    })
  }

  afterLogin = (userObj) => {
    this.setState({ logged: true, user: userObj, public: false });
    this.loadInitialData();
  }

  logout = () => {
    API.logout().then(
      () => {
        this.setState({
          cars: [],
          totCars: 0,
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
          period: []
        })
      }
    );
  }

  getRentals = () => {
    if (this.state.rentals.length == 0) {
      API.getRentals(false).then((rentals) => {
        this.setState({ rentals: rentals });
      })
    }
  }


  filterRental = (category, period) => {
    this.getRentals(false);
    this.setState({cars: 'loading'});
    API.getPrivateCars(category, period).then((cars) => {
      var modifiers = this.state.modifiers;
      var modifiersVec = this.state.modifiersVec;
      var rentals = this.state.rentals;
      rentals.filter(rental => (moment(rental.end_date).isBefore(moment())));

      if (modifiersVec.includes("freqCust")) {
        if (rentals.length >= 3) {
          modifiers[modifiersVec.indexOf("freqCust")] = 0.9;
        } else {
          modifiersVec.splice(modifiersVec.indexOf("freqCust"), 1); // reset the field
          modifiers.splice(modifiersVec.indexOf("freqCust"), 1);
        }
      } else {
        if (rentals.length >= 3) {
          modifiersVec.push("freqCust");
          modifiers.push(0.9);
        }
      }

      if (modifiersVec.includes("carsNumber")) {
        if (cars.length / this.state.totCars < 0.1) {
          modifiers[modifiersVec.indexOf("carsNumber")] = 1.1;
        } else {
          modifiersVec.splice(modifiersVec.indexOf("carsNumber"), 1); // reset the field
          modifiers.splice(modifiersVec.indexOf("carsNumber"), 1);
        }
      } else {
        if (cars.length / this.state.totCars < 0.1) {
          modifiers.push(1.1);
          modifiersVec.push("carsNumber");
        }

      }

      if (category) {
        var price = cars[0] ? cars[0].price : 0;
        for (var factor of this.state.modifiers) {
          price = price * factor;
        }
        this.setState({ currentPrice: Math.round(price * 100) / 100, cars: cars, period: period });
      }
    })
  }

  modifyPrice = (modifier) => {
    var modifiers = this.state.modifiers;
    var modifiersVec = this.state.modifiersVec;
    if (modifiersVec.includes(modifier[0])) {
      if (modifier[1] != 0) {
        modifiers[modifiersVec.indexOf(modifier[0])] = modifier[1];
      } else {
        modifiers.splice(modifiersVec.indexOf(modifier[0]), 1);
        modifiersVec.splice(modifiersVec.indexOf(modifier[0]), 1);
      }
    } else {
      modifiersVec.push(modifier[0]);
      modifiers.push(modifier[1]);
    }
    var price = this.state.cars[0].price
    for (var factor of modifiers) {
      price = price * factor;
    }
    this.setState({ modifiers: modifiers, modifiersVec: modifiersVec, currentPrice: Math.round(price * 100) / 100 });
  }

  checkForm = () => {
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
    return (
      <div className="background container-fluid">
        <Router>
          <Navbar logged={this.state.logged} />

          <Switch>

            <Route path="/login" render={() => {
              return (
                <Login afterLogin={this.afterLogin}
                  logout={this.logout}
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
                  <div className="mr-4 col-5">
                    <PriceDashboard currentPrice={this.state.currentPrice}
                      numCars={this.state.cars.length}
                      checkForm={this.checkForm} />
                    <CarTable logged={this.state.logged}
                      cars={this.state.cars}
                      colors={this.state.colors}
                      public={false}
                      checkForm={this.checkForm} />
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
                  rentalObj={{ car: this.state.cars[0], startDate: moment(this.state.period[0]).format('YYYY-MM-DD'), endDate: moment(this.state.period[1]).format('YYYY-MM-DD'), price: this.state.currentPrice }} />}
              </>)
            }} />

            <Route path="/history" render={() => {
              return (<>
                {this.state.logged && <RentalHistory colors={this.state.colors} />}
              </>)
            }} />

          </Switch>

          <Redirect from="/" to="/public" />

        </Router>
      </div>
    )
  }

}

export default App;

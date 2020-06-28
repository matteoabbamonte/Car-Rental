import Car from "./Car.js";
import Rental from "./Rental.js";
const baseURL = "/api";

async function getPublicCars(category, brand) {
    var categories = "?categories=";
    var brands = "&brands=";
    if (category && category.length > 0) {
        for (var i = 0; i < category.length; i++) {
            if (i === 0) {
                categories = categories + category[i];
            } else {
                categories = categories + "_" + category[i];
            }
        }
    } else {
        categories = categories + "none"
    }
    if (brand && brand.length > 0) {
        for (var j = 0; j < brand.length; j++) {
            if (j === 0) {
                brands = brands + brand[j];
            } else {
                brands = brands + "_" + brand[j];
            }
        }
    } else {
        brands = brands + "none";
    }
    const response = await fetch(baseURL + "/cars" + categories + brands)
    const carsJson = await response.json();
    if (response.ok) {
        return carsJson.map((ex) => Object.assign(new Car(), ex));
    } else {
        throw carsJson;  // An object with the error coming from the server
    }
}

async function getPrivateCars(category, period) {
    var catQuery = "?category=";
    var perQuery = "&period=";
    if (category) {
        catQuery += category;
    } else {
        catQuery += "none";
    }
    if (period.length !== 0) {
        for (var i = 0; i < period.length; i++) {
            if (i === 0) {
                perQuery += period[i];
            } else {
                perQuery += "_" + period[i];
            }
        }
    } else {
        perQuery += "none";
    }
    const response = await fetch(baseURL + "/configure" + catQuery + perQuery)
    const carsJson = await response.json();
    if (response.ok) {
        return carsJson.map((ex) => Object.assign(new Car(), ex));
    } else {
        let err = {status: response.status, errObj:carsJson};
        throw err;  // An object with the error coming from the server
    }
}

async function login(email, password) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password }),
        }).then((response) => {
            if (response.ok) {
                response.json()
                    .then((obj) => { resolve(obj); })
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
            } else {
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) });
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}

async function logout() {
    return new Promise((resolve, reject) => {
        fetch(baseURL + '/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                reject(null);
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) });
    });
}

async function getRentals(extended) {
    const response = await fetch(baseURL + "/rentals?extended=" + extended)
    const rentalsJson = await response.json();
    if (response.ok) {
        if (extended) {
            return rentalsJson.map((r) => { return new Rental(r.brand, r.model, r.start_date, r.end_date, r.price) });
        } else {
            return rentalsJson.map((r) => { return new Rental(r.car_id, r.user_id, r.start_date, r.end_date) });
        }
    } else {
        let err = {status: response.status, errObj:rentalsJson};
        throw err;  // An object with the error coming from the server
    }
}

async function checkPayment(cardHolder, cardNumber, expiration, cvv) {
    var payObj = {
        cardHolder: cardHolder,
        cardNumber: cardNumber,
        expiration: expiration,
        cvv: cvv
    }
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/payment", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...payObj }),
        }).then((response) => {
            if (response.ok) {
                resolve(null)
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject({...obj, status: response.status}); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function recordRental(rental) {
    var rentalObj = {
        carId: rental.car.id,
        startDate: rental.startDate,
        endDate: rental.endDate,
        price: rental.price
    }
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/record_rental", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...rentalObj }),
        }).then((response) => {
            if (response.ok) {
                resolve(null)
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error msg in the response body
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function deleteRental(rentalObj) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/delete", {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...rentalObj }),
        }).then((response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject({...obj, status: response.status});} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
                  }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function checkAuthentication(){
    let url = "/authentication_control";
    const response = await fetch(baseURL + url);
    const userJson = await response.json();
    if(response.ok){
        return userJson;
    } else {
        let err = {status: response.status, errObj:userJson};
        throw err;  // An object with the error coming from the server
    }
}

const API = { login, logout, getPublicCars, getPrivateCars, getRentals, checkPayment, deleteRental, recordRental, checkAuthentication };
export default API;
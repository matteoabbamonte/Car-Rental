import Car from "./Car.js";
import Rental from "./Rental.js";
const baseURL = "/api";

/* async function getCars() {
    // call REST API : GET /tasks
    const response = await fetch(baseURL + "/tasks?filter=all");
    const tasksJson = await response.json();
    if (response.ok) {
        return tasksJson.map((ex) => Object.assign(new Task(), ex));
    } else {
        throw tasksJson;  // An object with the error coming from the server
    }
}

async function getFilteredTasks(filter) {
    // call REST API : GET /tasks
    const uri = "/tasks?filter=" + filter;
    const response = await fetch(baseURL + uri);
    const tasksJson = await response.json();
    if (response.ok) {
        return tasksJson.map((ex) => Object.assign(new Task(), ex));
    } else {
        throw tasksJson;  // An object with the error coming from the server
    }
}



async function markAsCompleted(id, csrfToken) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/tasks/" + id, {
            method: 'PUT',
            headers: {
                'X-CSRF-Token': csrfToken,
            },
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
                  }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function deleteTask(id, csrfToken) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/tasks/" + id, {
            method: 'DELETE',
            headers: {
                'X-CSRF-Token': csrfToken,
            },
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
                  }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

async function updateTask(task, csrfToken) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + "/tasks/" + task.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            },
            body: JSON.stringify(task),
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
                  }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
} */

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
    const tasksJson = await response.json();
    if (response.ok) {
        return tasksJson.map((ex) => Object.assign(new Car(), ex));
    } else {
        throw tasksJson;  // An object with the error coming from the server
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
    if (period.length != 0) {
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
    const tasksJson = await response.json();
    if (response.ok) {
        return tasksJson.map((ex) => Object.assign(new Car(), ex));
    } else {
        throw tasksJson;  // An object with the error coming from the server
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
            },
            body: JSON.stringify({}),
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
        throw rentalsJson;  // An object with the error coming from the server
    }
}

async function checkPayment(cardHolder, cardNumber, expiration, cvv, rental) {
    var rentalObj = {
        carId: rental.car.id,
        startDate: rental.startDate,
        endDate: rental.endDate,
        price: rental.price
    }
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
            body: JSON.stringify({ ...payObj, ...rentalObj }),
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
                .then( (obj) => {reject(obj);} ) // error msg in the response body
                .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
                  }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}


const API = { login, logout, getPublicCars, getPrivateCars, getRentals, checkPayment, deleteRental };
export default API;
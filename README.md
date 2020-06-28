# Exam #1: "Noleggio veicoli"
## Student: s277483 ABBAMONTE MATTEO 

## React client application routes

- Route `/`:
  * public form with multiple category and brand filtering function;
  * public car table with the list of the resulting cars;

- Route `/public`:
  * same as above, this is the original page path: the previous one is obtained through a Redirect;

- Route `/configure`: 
  * rental configuration form on the left;
  * price dashboard on the top-right corner: it shows the price per day and the number of vehicles available according to the current     solution; plus, it contains the button for booking with the current solution or an alert element if there are no cars available according to the same solution;
  * private car table with the list of the resulting cars in the bottom-right corner;

- Route `/payment`:
  * payment form in central position: it contains blank fields to compile with card and card holder informations; also, in the righmost area of the form there's a summary of the discounts and surcharges applied;
  * after the payment, a modal pops up with informations linked to the rented car or, if the payment process encounters problems, an hint on re-entering payment data;

- Route `/history`: 
  * rental table on the left, containing informations linked to past rentals;
  * rental table on the right, containing future or current rentals; future rentals can be deleted;
  * a modal pops up in case a future rental is selected do be deleted; the modal contains a request for a confirmation;

## REST API server

- POST `/api/login`
  - no parameters
  - request body: email, password
  - response body: userID, userName

- POST `/api/logout`
  - no parameters
  - no request body
  - no response body

- GET `/api/cars`
  - query parameters: categories, brands
  - no request body
  - response body: list of cars according to the query parameters

- GET `/api/configure`
  - query parameters: category, period
  - no request body
  - response body: list of cars according to the query parameters

- GET `/api/rentals`
  - query parameters: extended (it means: with cars brands and names or not)
  - no request body
  - response body: list of rentals related to the current user

- POST `/api/payment`
  - no query parameters
  - request body: payment object (card holder, card number, expiration date, cvv)
  - response body: confirmation

- POST `/api/record_rental`
  - no query parameters
  - request body: extended rental object (car category, start date, end date, price)
  - response body: confirmation

- DELETE `/api/delete`
  - no query parameters
  - request body: extended rental object (car category, start date, end date, price)
  - response body: confirmation

- POST `/api/authentication_control`
  - no query parameters
  - no request body
  - response body: confirmation


## Server database

- Table `car` - contains: 

|id| brand| model| category| seats| fuel| price|
|---|---|---|---|---|---|---|

- Table `rental` - contains: 

|car_id| user_id| start_date| end_date| price|
|---|---|---|---|---|

- Table `user` - contains: 

|id| email| password| name| surname| age|
|---|---|---|---|---|---|


## Main React Components

- `Navbar` (in `Navbar.js`): it is the only element to be displayed in every page of the application: it contains the name of the fake car rental agency, its logo, a symbol showing whether the user is logged or not and a navigation dropdown menu.

- `CarTable` (in `CarTable.js`): table featured with various graphic configurations, depending on its location. It can be rendered on the main public page, listing all the cars potentially available or it can be rendered in the configuration page in smaller dimensions, listing the updated cars available with the selected configurations.

- `InitialForm` (in `InitialForm.js`): form displayed at the top of the public page, it can be used to filter the listed cars based on different brands and categories.

- `Login` (in `Login.js`): this form includes two input fields in which the user can insert his/her credentials in order to gain the acces to the protected area of the application.

- `Configurator` (in `Configurator.js`): this form includes various fields that must be filled by the user in order to correctly create a rental. Changing the values of the fields will cause the application to re-render the price, the number and the list of the available cars.

- `PriceDashboard` (in `PriceDashboard.js`): it is a small window on the top right corner of the configuration page, displaying the current price of the rental solution, the number of the available cars and (only when all fundamental fields are filled) a button that will bring to the payment page.

- `PaymentForm` (in `PaymentForm.js`): it is the main element in the payment page. It contains fields that must be filled by the user in order to process the fake payment and send the request for the insertion of a new rental in the db. If everything goes well, a pop up will summarise the rental object and the booked car; if a problem occurs a similar pop up will be displayed, reporting the error.

- `RentalHistory` (in `RentalHistory.js`): it is a group of tables (defined within the overall element), displaying the list of the past and the future rentals. The rightmost table (the one showing the future and current rentals) offers the possibility to delete rentals that are not started yet.

## Screenshot

#### Empty Configurator
![Empty Configurator Screenshot](./img/emptyConfigurator.jpg)

#### Filled Configurator
![Filled Configurator Screenshot](./img/filledConfigurator.jpg)

## Test users

* matteo@email.com, passwordmatteo        (frequent customer)
* marco@email.com, passwordmarco          (frequent customer)
* luca@email.com, passwordluca
* francesco@email.com, passwordfrancesco
* valerio@email.com, passwordvalerio

#### Hint: 

If you want to try the price modifier related to the lack of cars of a specified category in a certain period you have to select Category B and a period that includes the first week of August.

import React from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import moment from 'moment'
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import API from '../api/API';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';

import { Link } from 'react-router-dom';

class PaymentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardHolder: '',
            cardNumber: '',
            expiration: '',
            cvv: '',
            paymentStatus: false,
            reservedCar: '',
            dataError: false
        }
    }

    componentDidMount() {
        this.loadInitialState();
    }

    handleClose = () => {
        this.setState({ paymentStatus: false })
    }

    loadInitialState = () => {
        this.setState({
            cardHolder: '',
            cardNumber: '',
            expiration: '',
            cvv: '',
            paymentStatus: false,
            reservedCar: '',
            dataError: false
        });
    }

    pushField(type, value) {
        switch (type) {
            case "cardHolder":
                if (value.split(" ").length >= 2) {
                    this.setState({ cardHolder: value });
                } else {
                    this.setState({ cardHolder: '' });
                }
                break;
            case "cardNumber":
                var tempCard = value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                this.setState({ tempCard: tempCard })
                if (tempCard.length === 19) {
                    this.setState({
                        cardNumber: tempCard
                    });
                } else {
                    this.setState({ cardNumber: '' });
                }
                break;
            case "month":
                if (!moment(value).isBefore(moment())) {
                    this.setState({ expiration: value })
                } else {
                    this.setState({ expiration: '' });
                }
                break;
            case "cvv":
                if (value.length === 3 && /^[0-9]+$/.test(value)) {
                    this.setState({ cvv: value });
                } else {
                    this.setState({ cvv: '' });
                }
                break;
            default:
                console.log(type)
        }
    }

    checkPayment() {
        if (this.state.cardHolder &&
            this.state.cardNumber.length === 19 &&
            this.state.expiration &&
            this.state.cvv &&
            !this.state.dataError) {
            this.setState({ paymentStatus: "loading" })
            API.checkPayment(this.state.cardHolder,
                this.state.cardNumber.replace(/\s/g, ""),
                this.state.expiration,
                this.state.cvv).then(() => {
                    API.recordRental(this.props.rentalObj).then(() => {
                        this.setState({ paymentStatus: true, reservedCar: this.props.rentalObj.car })
                    }).catch((err) => {
                        this.setState({ paymentStatus: "error" });
                        this.props.handleAuthFailure(err);
                    })
                }).catch((err) => {
                    this.setState({ paymentStatus: "error" });
                    this.props.handleAuthFailure(err);
                })
        } else {
            this.setState({ dataError: true })
        }
    }

    render() {
        if (this.state.paymentStatus === "loading") {
            return <div className="d-flex justify-content-center align-items-center">
                <Spinner animation="grow" className="my-5" />
            </div>
        } else {
            return (<>
                <SuccessPopUp paymentStatus={this.state.paymentStatus} reservedCar={this.state.reservedCar} colors={this.props.colors} handleClose={this.handleClose} />
                <ErrorPopUp paymentStatus={this.state.paymentStatus} loadInitialState={this.loadInitialState} handleClose={this.handleClose} />
                <Card
                    className="my-4 col-8 mx-auto"
                    bg="dark"
                    border="primary">
                    <Card.Header className="text-center"><span className="badge badge-light"><h6>Insert your payment card here</h6></span></Card.Header>
                    <Card.Body>
                        <Alert show={this.state.dataError}
                            className="text-center mx-auto"
                            variant="danger"
                            onClick={() => {
                                this.setState({ dataError: false });
                            }}
                            dismissible>
                            Check your payment data!
                        </Alert>
                        <div className="d-flex justify-content-between  align-items-center">
                            <div className="col-6">
                                <Form.Group controlId="cardHolder">
                                    <Form.Label><span className="badge badge-light">Card holder:</span></Form.Label>
                                    <Form.Control type="text" placeholder="Name Surname" onChange={event => { this.pushField("cardHolder", event.target.value) }} required />
                                </Form.Group>

                                <Form.Group controlId="cardNumber">
                                    <Form.Label><span className="badge badge-light">Card number:</span></Form.Label>
                                    <Form.Control type="text" placeholder="XXXX XXXX XXXX XXXX" value={this.state.tempCard || ''} onChange={event => { this.pushField("cardNumber", event.target.value) }} required/>
                                </Form.Group>

                                <Form.Row >
                                    <Form.Group controlId="month" className="col">
                                        <Form.Label><span className="badge badge-light">Month:</span></Form.Label>
                                        <Form.Control type="month" onChange={event => { this.pushField("month", event.target.value) }} required/>
                                    </Form.Group>

                                    <Form.Group controlId="cvv" className="col">
                                        <Form.Label><span className="badge badge-light">CVV</span></Form.Label>
                                        <Form.Control type="text" placeholder="CVV" onChange={event => { this.pushField("cvv", event.target.value) }} required/>
                                    </Form.Group>
                                </Form.Row>
                            </div>
                            <div className="col-6">
                                <table className={"table table-hover table-dark text-center"} id="modifiersTable">
                                    <tbody>
                                        {this.props.modifiersVec.map((m) => <ModifierRow key={m}
                                            name={m}
                                            value={this.props.modifiers[this.props.modifiersVec.indexOf(m)]} />)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Card.Body>
                    <Card.Footer>
                        <div className="d-flex justify-content-center">
                            <span className="badge badge-light mr-1 my-2">
                                <h6 className="my-0">
                                    Total:
                            </h6>
                            </span>
                            <span className="badge badge-success mr-1 my-2">
                                <h6 className="my-0">
                                    {Math.round(this.props.currentPrice * moment(this.props.rentalObj.endDate).diff(moment(this.props.rentalObj.startDate), 'days') * 100) / 100}€
                            </h6>
                            </span>
                            <Button className="ml-3" onClick={(ev) => { this.checkPayment() }}>
                                Purchase now
                        </Button>
                        </div>
                    </Card.Footer>
                </Card>

            </>)
        }
    }
}

const ModifierRow = (props) => {
    return (<>
        {props.value !== 1 &&
            <tr>
                <td>
                    <span className="badge badge-pill badge-light">
                        {props.value > 1.00 ? "+" : "-"}{Math.abs(Math.round(100 - props.value * 100)) + "%"}
                    </span>
                </td>
                <td>
                    <span><u>{getDescription(props.name, props.value)}</u></span>
                </td>
            </tr>}
    </>)
}

function getDescription(name, value) {
    switch (name) {
        case "freqCust":
            return "You are a frequent customer";
        case "insurance":
            return "Extra insurance activated";
        case "nDrivers":
            return "Additional drivers added";
        case "age":
            if (value === 1.05) {
                return "Main driver age is under 25";
            } else {
                return "Main driver age is over 65";
            }
        case "km":
            if (value === 0.85) {
                return "Declared estimated kilometers allow you to receive a discount";
            } else {
                return "Declared estimated kilometers need a surcharge";
            }
        case "carsNumber":
            return "Less than 10% of the cars left in the selected period";
        default:
            console.log(name)
    }
}

const SuccessPopUp = (props) => {
    return <Modal show={props.paymentStatus === true} onHide={props.handleClose} className="my-5" animation={false}>
        <Modal.Header >
            <Modal.Title>The following car has been successfully reserved for you:</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <table className="mx-auto col text-center">
                <thead>
                    <tr>
                        <th>
                            Brand
                                </th>
                        <th>
                            Model
                                </th>
                        <th>
                            Seats
                                </th>
                        <th>
                            Fuel
                                </th>
                        <th>
                            Car Category
                                </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <span className={"badge badge-" + props.colors[props.reservedCar.brand]}>
                                {props.reservedCar.brand}
                            </span>
                        </td>
                        <td>
                            {props.reservedCar.model}
                        </td>
                        <td>
                            {props.reservedCar.seats + " seats"}
                        </td>
                        <td>
                            {props.reservedCar.fuel}
                        </td>
                        <td>
                            {"Category " + props.reservedCar.category}
                        </td>
                    </tr>
                </tbody>
            </table>
        </Modal.Body>

        <Modal.Footer>
            <Link to="/configure" className="btn btn-secondary">Configurator</Link>
            <Link to="/history" className="btn btn-primary">My rentals</Link>
        </Modal.Footer>
    </Modal>
}

const ErrorPopUp = (props) => {
    return <Modal show={props.paymentStatus === "error"} onHide={props.handleClose} className="my-5" animation={false}>
        <Modal.Header >
            <Modal.Title>Error:</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            An error occurred during the payment process,
            please insert your data again.
        </Modal.Body>

        <Modal.Footer>
            <Link to="/configure" className="btn btn-secondary">Configurator</Link>
            <Button className="btn" onClick={(ev) => { props.loadInitialState() }}>Retry</Button>
        </Modal.Footer>
    </Modal>
}

export default PaymentForm
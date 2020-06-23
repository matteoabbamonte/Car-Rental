import React from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import moment from 'moment'

class Configurator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: '',
            period: []
        }
    }

    pushCategory(cat) {
        this.setState({ category: cat }, () => {
            this.props.filterRental(this.state.category, this.state.period)
        });

    }

    pushPeriod(type, date) {
        if (type == "start" && moment(date) > moment()) {
            if ((this.state.period.length === 2 && moment(date) >= moment(this.state.period[1])) || this.state.period.length === 0 || this.state.period.length === 1) {
                this.setState({ period: [date] });
            } else if (this.state.period.length === 2 && moment(date) < moment(this.state.period[1])) {
                this.setState({ period: [date, this.state.period[1]] }, () => {
                    this.props.filterRental(this.state.category, this.state.period)
                });
            }
        } else if (type == "end" && moment(date) > moment()) {
            if ((this.state.period.length === 2 && moment(date) <= moment(this.state.period[0])) || this.state.period.length === 0 || (this.state.period.length === 2 && !this.state.period[0])) {
                this.setState({ period: [null, date] });
            } else if (this.state.period.length === 1 && moment(date) > moment(this.state.period[0]) || (this.state.period.length === 2 && moment(date) >= moment(this.state.period[0]))) {
                this.setState({ period: [this.state.period[0], date] }, () => {
                    this.props.filterRental(this.state.category, this.state.period)
                });
            }
        }
    }

    pushModifier(type, value) {
        switch(type) {
            case "insurance":
                if (value) {
                    this.props.modifyPrice(["insurance", 1.2]);
                } else {
                    this.props.modifyPrice(["insurance", 1]);
                }
            break;
            case "nDrivers":
                if (value!=0) {
                    this.props.modifyPrice(["nDrivers", 1.15]);
                } else if (value) {
                    this.props.modifyPrice(["nDrivers", 1]);
                } else {
                    this.props.modifyPrice(["nDrivers", 0]);
                }
            break;
            case "age":
                if (value<25 && value>=18) {
                    this.props.modifyPrice(["age", 1.05]);
                } else if (value>65) {
                    this.props.modifyPrice(["age", 1.1]);
                } else if (value>=26 && value <= 65) {
                    this.props.modifyPrice(["age", 1]);
                } else {
                    this.props.modifyPrice(["age", 0]);
                }
            break;
            case "km":
                if (value<50 && value>0) {
                    this.props.modifyPrice(["km", 0.95]);
                } else if (value>150){
                    this.props.modifyPrice(["km", 1.05]);
                } else if (value){
                    this.props.modifyPrice(["km", 1]);
                } else {
                    this.props.modifyPrice(["km", 0]);
                }
            break;
        }
    }

    render() {
        return (
            <Card
                className="my-2 col-6 ml-4"
                bg="dark"
                border="primary"
                style={{height: "86vh"}}>
                <Card.Header className="text-center"><span className="badge badge-light"><h6>Configure your rental options here</h6></span></Card.Header>
                <Card.Body>

                    <Form.Row>
                        <Form.Group controlId="category" className="col">
                            <Form.Label><span className="badge badge-light">Category</span></Form.Label>
                            <Form.Control className="border-success" as="select" onChange={((event) => { this.pushCategory(event.target.value) })}>
                                <option hidden>Select a category</option>
                                <option>A</option>
                                <option>B</option>
                                <option>C</option>
                                <option>D</option>
                                <option>E</option>
                                <option>F</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="checkInsurance">
                            <Form.Label><span className="badge badge-light">Extra insurance?</span></Form.Label>
                            <Form.Check type="checkbox" className="my-1 text-center" onChange={event => { this.pushModifier("insurance", event.target.checked ? true : false) }} />
                        </Form.Group>
                    </Form.Row>

                    <Form.Group controlId="inputNumberDrivers">
                        <Form.Label><span className="badge badge-light">Number of other drivers:</span></Form.Label>
                        <Form.Control className="border-success" type="number" placeholder="drivers" onChange={event => { this.pushModifier("nDrivers", event.target.value) }} />
                    </Form.Group>

                    <Form.Row >
                        <Form.Group controlId="inputStart" className="col">
                            <Form.Label><span className="badge badge-light">Rental starts on...</span></Form.Label>
                            <Form.Control className="border-success" type="date" value={!this.state.period[0] ? "" : this.state.period[0]} onChange={event => { this.pushPeriod("start", event.target.value) }} />
                        </Form.Group>
                        <Form.Group controlId="inputEnd" className="col">
                            <Form.Label><span className="badge badge-light">...and ends on:</span></Form.Label>
                            <Form.Control className="border-success" type="date" value={!this.state.period[1] ? "" : this.state.period[1]} onChange={event => { this.pushPeriod("end", event.target.value) }} />
                        </Form.Group>
                    </Form.Row>

                    <Form.Group controlId="inputAge">
                        <Form.Label><span className="badge badge-light">Age of the main driver:</span></Form.Label>
                        <Form.Control className="border-success" type="number" placeholder="Age" onChange={event => { this.pushModifier("age", event.target.value) }} />
                    </Form.Group>

                    <Form.Group controlId="inputKm">
                        <Form.Label><span className="badge badge-light">Estimate number of km:</span></Form.Label>
                        <Form.Control className="border-success" type="number" placeholder="Km" onChange={event => { this.pushModifier("km", event.target.value) }} />
                    </Form.Group>


                </Card.Body>
            </Card>

        )
    }
}

export default Configurator
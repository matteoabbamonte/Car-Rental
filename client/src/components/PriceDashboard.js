import React from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';


class PriceDashboard extends React.Component {

    render() {
        return (
            <Card
                className="my-2"
                bg="dark"
                border="primary">
                <Card.Body>
                    <div className="d-flex justify-content-center">
                        <span className="badge badge-light mr-2">
                            <h6>
                                {this.props.currentPrice === 0 ? "Fill the form to estimate the price" : "The current price for your rental is:"}
                            </h6>
                        </span>
                        {this.props.currentPrice !== 0 && <Card bg="success">
                            <span className="mx-3">
                                {this.props.currentPrice + "€"}
                            </span>
                        </Card>}
                    </div>
                    <div className="my-2 d-flex justify-content-center">
                        <span className="badge badge-light mr-2">
                            <h6>
                                Number of cars available with these filters:
                            </h6>
                        </span>
                        <Card bg="success">
                            <span className="mx-3">
                                {this.props.numCars}
                            </span>
                        </Card>
                    </div>
                    {this.props.checkForm() && this.props.numCars > 0 ?
                        <Link to="/payment" className="btn btn-success d-flex justify-content-center" >
                            Book Now!
                    </Link> :
                        this.props.numCars === 0 && <Alert variant="danger" className="d-flex justify-content-center" >
                            No cars available
                    </Alert>}
                </Card.Body>
            </Card>

        )
    }
}

export default PriceDashboard
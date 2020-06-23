import React from 'react';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

class PriceDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            brand: [],
            category: '',
        }
    }

    pushCategory(categories) {
        var categoryVec
        if (categories) {
            categoryVec = [];
            for (var c of categories) {
                categoryVec.push(c.value);
            }
        } else {
            categoryVec = null;
        }
        this.setState({ category: categoryVec }, () => { this.props.getFilteredCars(this.state.category, this.state.brand) });

    }

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
                                The current price for your rental is:
                            </h6>
                        </span>
                        <Card bg="success">
                            <span className="mx-3">
                                {this.props.currentPrice}€
                            </span>
                        </Card>
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
                    {this.props.checkForm() && <Link to="/payment" className="btn btn-success d-flex justify-content-center">
                            Book Now!
                    </Link>}
                </Card.Body>
            </Card>

        )
    }
}

export default PriceDashboard
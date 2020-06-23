import React from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Select from 'react-select'

class InitialForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            brand: [],
            category: [],
        }
    }

    pushBrand(brands) {
        var brandVec;
        if (brands) {
            brandVec = [];
            for (var b of brands) {
                brandVec.push(b.value);
            }
        } else {
            brandVec = null;
        }
        this.setState({ brand: brandVec }, () => { this.props.getFilteredCars(this.state.category, this.state.brand) });
    }

    pushCategory(categories) {
        var categoryVec;
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

    explodeBrands() {
        var brands = [];
        for (var b of this.props.brands) {
            brands.push({ value: b, label: b });
        }
        return brands;
    }

    render() {
        return (
            <Card
                className="my-2"
                bg="dark"
                border="primary">
                <Card.Header className="text-center"><span className="badge badge-light"><h6>Choose your filters here</h6></span></Card.Header>
                <Card.Body>
                    <Form.Row>
                        <Form.Group controlId="categoryInitial" className="col">
                            <Form.Label><span className="badge badge-light">Category</span></Form.Label>
                            <Select options={[{ value: 'A', label: 'Categoria A' },
                            { value: 'B', label: 'Categoria B' },
                            { value: 'C', label: 'Categoria C' },
                            { value: 'D', label: 'Categoria D' },
                            { value: 'E', label: 'Categoria E' }]}
                                isMulti
                                onChange={((event) => { this.pushCategory(event) })} />
                        </Form.Group>
                        <Form.Group controlId="brandInitial" className="col">
                            <Form.Label><span className="badge badge-light">Brand</span></Form.Label>
                            <Select options={this.explodeBrands()}
                                isMulti
                                onChange={((event) => { this.pushBrand(event) })} />
                        </Form.Group>
                    </Form.Row>
                </Card.Body>
            </Card>

        )
    }
}

export default InitialForm
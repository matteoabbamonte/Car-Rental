import React from 'react';
import { Link } from 'react-router-dom';
import './userTable.css';
import { TextRow } from 'react-placeholder/lib/placeholders';


class CarTable extends React.Component {


    render() {
        return (<>
            {(this.props.cars !== "loading" && this.props.cars.length === 0) ?
                <span className="badge badge-danger col my-5"><h4>No cars available with these filters</h4></span> :
                <div bg="dark" className={this.props.public ?
                    "mx-auto col-8 text-dark scrollInitialTable" :
                    this.props.checkForm() ?
                        "text-dark scrollLoggedTableButton" :
                        "text-dark scrollLoggedTable"}>
                    <table className="table table-hover table-dark text-center" id="carTable">
                        <thead>
                            <tr>
                                {!this.props.logged && <th>
                                    Book your car now!
                            </th>}
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
                            {(this.props.cars === 'loading' && <FakeRows logged={this.props.logged} />) || this.props.cars.map((c) => <CarRow key={c.id}
                                car={c}
                                colors={this.props.colors}
                                logged={this.props.logged} />)
                            }
                        </tbody>
                    </table>
                </div >}
        </>)
    }

}

const FakeRows = (props) => {

    return (<>
        <SingleFakeRow logged={props.logged} />
        <SingleFakeRow logged={props.logged} />
        <SingleFakeRow logged={props.logged} />
        <SingleFakeRow logged={props.logged} />
        <SingleFakeRow logged={props.logged} />
    </>)

}

const SingleFakeRow = (props) => {
    return (<>
        <tr>
            {!props.logged && <td>
                <TextRow color="#666666" />
            </td>}
            <td>
                <TextRow color="#666666" />
            </td>
            <td>
                <TextRow color="#666666" />
            </td>
            <td>
                <TextRow color="#666666" />
            </td>
            <td>
                <TextRow color="#666666" />
            </td>
            <td>
                <TextRow color="#666666" />
            </td>
        </tr>
    </>)
}


const CarRow = (props) => {
    return (<>
        <tr>
            {!props.logged && <td>
                <Link className="btn btn-success py-0" to="/login">
                    Book now
                </Link>
            </td>}
            <td>
                <span className={"badge badge-" + props.colors[props.car.brand]}>
                    {props.car.brand}
                </span>
            </td>
            <td>
                {props.car.model}
            </td>
            <td>
                {props.car.seats + " seats"}
            </td>
            <td>
                {props.car.fuel}
            </td>
            <td>
                {"Category " + props.car.category}
            </td>
        </tr>
    </>)
}


export default CarTable;


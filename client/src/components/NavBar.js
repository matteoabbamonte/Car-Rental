import React from 'react';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import { Redirect } from 'react-router-dom';


class Navbar extends React.Component {
    constructor() {
        super()
        this.state = {
            destination: ''
        }
    }

    render() {
        return (<>
        {this.state.destination && <Redirect to={this.state.destination}/>}
            <nav className="row navbar-fluid d-flex justify-content-between navbar-dark bg-dark">
                <div className="nav-item nav-link my-auto">

                    <span className="nav-link badge badge-success"><h3>RentCar</h3></span>

                </div>
                <div className="row my-auto">
                    <Logo className="nav-item nav-link mx-auto" />
                </div>
                <ul className="navbar-nav nav-link flex-row">
                    <li className="nav-item my-auto">{this.props.logged === true ? <Login /> : <Logout />}</li>
                    <li className="nav-item my-auto">
                        <Dropdown className="float-right my-2 ">
                            <Dropdown.Toggle variant="dark" id="dropdown-basic" className="p-1">
                                {this.props.logged === true ? "Logged in" : "Logged out"}
                            </Dropdown.Toggle>

                            <Dropdown.Menu >
                                {!this.props.public &&
                                    <Dropdown.Item>
                                        <Button variant="outline-primary" size="sm" block onClick={() => this.setState({destination: "/public"})}>Our cars</Button>
                                    </Dropdown.Item>}
                                <Dropdown.Item>
                                    <Button variant="outline-primary" size="sm" block onClick={() => {
                                        this.props.logout();
                                        this.setState({destination: this.props.logged === true ? "/" : "/login"})}} >{this.props.logged === true ? "Log out" : "Log in"}</Button>
                                </Dropdown.Item>
                                {this.props.logged &&
                                    <Dropdown.Item>
                                        <Button variant="outline-primary" size="sm" block onClick={() => this.setState({destination: "/configure"})}>Configure a rental</Button>
                                    </Dropdown.Item>}
                                {this.props.logged &&
                                    <Dropdown.Item>
                                        <Button variant="outline-primary" size="sm" block onClick={() => this.setState({destination: "/history"})}>My rentals</Button>
                                    </Dropdown.Item>}
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>
                </ul>
            </nav>
        </>);
    }
}

const Logo = () => {
    return (
        <svg height="3em" viewBox="0 0 512 512" width="3em" xmlns="http://www.w3.org/2000/svg">
            <path d="m472 208-16 32h-416v-30.628a65.374 65.374 0 0 1 65.37-65.372h342.63l24 32z" fill="#f85542" />
            <path d="m328 312h-116l-29.252 9.4a27.064 27.064 0 0 0 -20.508-9.4h-2.666a27.068 27.068 0 0 0 -18.933 46.413l66.207 64.8a48 48 0 0 0 40.873 13.138l80.279-12.351h32v-112z" fill="#fad7be" />
            <path d="m407.997 311.998h64v120h-64z" fill="#4298d1" />
            <path d="m407.997 311.998h64v16h-64z" fill="#3e8cc7" />
            <path d="m463.997 311.998h-416.001l-8-48h432.001z" fill="#ebebeb" />
            <circle cx="111.997" cy="223.998" fill="#878787" r="40" />
            <circle cx="111.997" cy="223.998" fill="#ebebeb" r="16" />
            <circle cx="399.997" cy="223.998" fill="#878787" r="40" />
            <circle cx="399.997" cy="223.998" fill="#ebebeb" r="16" />
            <path d="m448 144h-304l57.057-46.683a112 112 0 0 1 70.92-25.317h57.628a112 112 0 0 1 79.2 32.8z" fill="#bef5fa" />
            <path d="m292.684 240h22.625l18.344-18.344a7.994 7.994 0 0 0 2.347-5.656v-72h-16v68.688z" fill="#de4c3b" />
            <path d="m175.997 143.998h16v96h-16z" fill="#de4c3b" />
            <path d="m319.997 71.998h16v72h-16z" fill="#b1e4e9" />
            <path d="m370.618 79.862 29.382 64.138v8l48-8-39.2-39.2a111.858 111.858 0 0 0 -38.182-24.938z" fill="#f85542" />
            <path d="m271.997 167.998h32v16h-32z" fill="#de4c3b" />
            <path d="m466 168h-18a8 8 0 0 0 0 16h24v-8z" fill="#ff9201" />
            <path d="m431.997 391.998h16v16h-16z" fill="#3474a6" />
            <path d="m359.997 311.998h48v112h-48z" fill="#ebebeb" />
            <path d="m359.997 311.998h48v16h-48z" fill="#dbdbdb" />
            <path d="m134.982 328h53.448l-5.685-6.6a27.064 27.064 0 0 0 -20.508-9.4h-2.666a26.993 26.993 0 0 0 -24.589 16z" fill="#f3d0b9" />
            <path d="m288 320h-96a24 24 0 0 0 -24 24 24 24 0 0 0 24 24h96z" fill="#eccbb4" />
            <path d="m360 312h-160a24 24 0 0 0 -24 24 24 24 0 0 0 24 24h160z" fill="#fad7be" />
            <path d="m200 312a23.932 23.932 0 0 0 -22.531 16h182.531v-16z" fill="#f3d0b9" />
        </svg>
    )
}

const Login = () => {
    return (
        <Card>
            <svg className="bi bi-unlock" width="2em" height="2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M9.655 8H2.333c-.264 0-.398.068-.471.121a.73.73 0 0 0-.224.296 1.626 1.626 0 0 0-.138.59V14c0 .342.076.531.14.635.064.106.151.18.256.237a1.122 1.122 0 0 0 .436.127l.013.001h7.322c.264 0 .398-.068.471-.121a.73.73 0 0 0 .224-.296 1.627 1.627 0 0 0 .138-.59V9c0-.342-.076-.531-.14-.635a.658.658 0 0 0-.255-.237A1.122 1.122 0 0 0 9.655 8zm.012-1H2.333C.5 7 .5 9 .5 9v5c0 2 1.833 2 1.833 2h7.334c1.833 0 1.833-2 1.833-2V9c0-2-1.833-2-1.833-2zM8.5 4a3.5 3.5 0 1 1 7 0v3h-1V4a2.5 2.5 0 0 0-5 0v3h-1V4z" />
            </svg>
        </Card>
    )
}

const Logout = () => {
    return (
        <Card>
            <svg className="bi bi-lock-fill" width="2em" height="2em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <rect width="11" height="9" x="2.5" y="7" rx="2" />
                <path fillRule="evenodd" d="M4.5 4a3.5 3.5 0 1 1 7 0v3h-1V4a2.5 2.5 0 0 0-5 0v3h-1V4z" />
            </svg>
        </Card>
    )
}

export default Navbar;
export {Logo};
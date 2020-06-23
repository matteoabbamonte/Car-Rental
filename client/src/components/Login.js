import React from 'react';
import { Logo } from "./NavBar";
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import { Redirect } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import API from '../api/API'


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'matteo@email.com',
            password: 'passwordmatteo',
            loginError: false,
            success: false
        }
    }

    componentDidMount() {
        this.props.logout();
        this.setState({email: 'matteo@email.com',
        password: 'passwordmatteo',
        loginError: false,
        success: false});
    }

    login = (ev) => {
        ev.preventDefault();
        this.setState({ success: 'loading' });
        API.login(this.state.email, this.state.password).then(
            (userObj) => {
                this.setState({ success: true, loginError: false });
                this.props.afterLogin(userObj);
            }
        ).catch(
            () => {
                this.setState({ loginError: true, success: false })
            }

        );
    }

    render() {
        if (this.state.success === true && !this.props.public) {
            return <Redirect to="/configure" />
        }
        return (<>
            {(this.state.success === "loading" && <div className="text-center"><Spinner animation="grow" className="my-5" /></div>) || <div>

                <Alert show={this.state.loginError}
                    className="text-center mx-auto"
                    variant="danger"
                    onClick={() => {
                        this.setState({ loginError: false });
                    }}
                    dismissible>
                    Wrong credentials!
                </Alert>
                <Card body className="my-5 mx-auto col-7" bg="dark" text="light" border="primary" >
                    <Card.Header className="text-center">
                        <FormLogo />
                    </Card.Header>
                    <Card.Body bg="secondary">
                        <Form >
                            <Form.Group controlId="inputUserName">
                                <Form.Label>Indirizzo email: </Form.Label>
                                <Form.Control type="email" className="border-primary" placeholder="username@mail.com" onChange={event => { this.setState({ "email": event.target.value }) }} />
                            </Form.Group>
                            <Form.Group controlId="inputPassword">
                                <Form.Label>Password:</Form.Label>
                                <Form.Control type="password" className="border-primary" placeholder="password" onChange={event => { this.setState({ "password": event.target.value }) }} />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                    <Card.Footer className="text-center">
                        <Button className='btn btn-dark border-primary' onClick={ev => {
                            this.login(ev);
                        }} >Login</Button>
                    </Card.Footer>
                </Card>
            </div>}
        </>
        )
    }

}

const FormLogo = () => {
    return (
        <>
            <label>
                <Card className="mx-auto my-2" style={{ width: '4rem' }} text="dark">
                    Log In!
                </Card>
            </label>
            <Logo className="mx-auto my-1" width="40" />
        </>
    )
}

export default Login;
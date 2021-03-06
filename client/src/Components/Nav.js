import React from 'react';

import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import Home from './Home-copy';
import About from './About';
import Login from './Login';
import Waste from './Waste';
import Footer from './Footer'
import Tips from './Tips';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav as Bnav } from 'react-bootstrap';

export default function Nav(props) {
    return (
        <Router>
            <div>
                <nav>
                    <div>
                        <Navbar bg="light" expand="lg">
                            <Navbar.Toggle aria-controls="basic-navbar-nav" className="ml-auto" />
                            <Navbar.Collapse id="basic-navbar-nav" >
                                <Bnav className="mr-auto">
                                    <Bnav.Link href="/" id="logo">WASTr</Bnav.Link>
                                    <Bnav.Link href="/waste">Log waste</Bnav.Link>
                                    <Bnav.Link href="/about">About</Bnav.Link>
                                    <Bnav.Link href="/tips">Recycling Tips</Bnav.Link>
                                </Bnav>
                                {!props.loggedIn ?
                                    <Bnav className="ml-auto">
                                        <Bnav.Link href="/login">Login</Bnav.Link>
                                    </Bnav> :
                                    <Bnav onClick={() => props.logout()}>
                                        <Bnav.Link >Logout</Bnav.Link>
                                    </Bnav>
                                }
                            </Navbar.Collapse>
                        </Navbar>
                    </div>
                </nav>
            </div>

            <Switch>
                <Route exact path='/about'>
                    <About />
                </Route>
                <Route exact path='/tips'>
                    <Tips />
                </Route>
                <Route exact path='/login'>
                    <Login login={props.login} />
                </Route>
                <Route exact path='/waste'>
                    <Waste userCookie={props.userCookie} />
                </Route>
                <Route exact path='/'>
                    <Home />
                </Route>
            </Switch>
            <Footer />
        </Router>
    )
}
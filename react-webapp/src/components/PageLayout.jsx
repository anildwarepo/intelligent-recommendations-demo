/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";
import "../styles/pagelayout.css";

/**
 * Renders the navbar component with a sign-in or sign-out button depending on whether or not a user is authenticated
 * @param props 
 */
export const PageLayout = (props) => {
    const isAuthenticated = useIsAuthenticated();
    const { accounts } = useMsal();
    return (
        <>
            <Navbar bg="dark" variant="dark">
                <a className="navbar-brand" href="/">
                    <h5  className="navbar-brand display-4 text-left ">Discover new products with popular and similar items</h5>
                </a>
                
                { isAuthenticated ? <SignOutButton accounts={accounts} /> : <SignInButton /> }
            </Navbar>
            <Container fluid className="mw-100 vh-100"  >
            <Row className="mw-100 h-100">
              
                <Col  className=''>
                   
                 
                     {props.children}
                    
                </Col>
            </Row>
            </Container>
            
        </>
    );
};

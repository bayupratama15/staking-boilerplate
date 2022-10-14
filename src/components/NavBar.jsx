import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

const NavBar = (props) => {
  return (
    <>
      <Navbar bg="light" variant="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="https://explorer.cryonetwork.net/images/cryonswap_b-873761e794a513634bbec7e5c6383e12.png?vsn=d"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {props.isConnected() ? (
                <Button variant="primary">Connected</Button>
              ) : (
                <Button onClick={() => props.connect()} variant="primary">
                  Connect Wallet
                </Button>
              )}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
    </>
  );
};

export default NavBar;

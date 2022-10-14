import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

const StakeModal = (props) => {
  const { onClose, stakingLength, stakingPercent, setAmount, stakeEther } =
    props;

  return (
    <Modal
      show={true}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header></Modal.Header>
      <Modal.Body>
        {/* INFORMATION STAKE */}
        <Container className="mb-2">
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title className="text-center">
                    Staking Information
                  </Card.Title>
                  <Card.Text>
                    <p>
                      <b>Staking Length:</b>
                      <br></br>
                      {stakingLength}
                    </p>
                    <p>
                      <b>Staking Percent:</b>
                      <br></br>
                      {stakingPercent}
                    </p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        <Form>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="0.0"
              autoFocus
              onChange={(e) => props.setAmount(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={props.onClose}>
          Close
        </Button>
        <Button onClick={props.stakeEther}>Stake</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StakeModal;

import React from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { Row, Col, Button } from 'react-bootstrap';

const Contact = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="bg-light p-4 p-md-5 rounded shadow">
            <h2 className="text-center mb-4">Get In Touch</h2>
            <p className="text-center mb-4">Have questions about HandCare? We're here to help you connect with the right service providers.</p>
            
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Your Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter your name" />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" placeholder="name@example.com" />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3" controlId="formSubject">
                <Form.Label>Subject</Form.Label>
                <Form.Control type="text" placeholder="What is this regarding?" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formMessage">
                <Form.Label>Your Message</Form.Label>
                <Form.Control as="textarea" rows={4} placeholder="How can we help you?" />
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" type="submit" size="lg">
                  Send Message
                </Button>
              </div>
              
              <div className="text-center mt-4">
                <p className="mb-0">Prefer to email us directly?</p>
                <a href="mailto:support@handcare.com">support@handcare.com</a>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Contact;
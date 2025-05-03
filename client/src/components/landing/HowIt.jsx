import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const HowItWorks = () => {
  return (
    <Container className="py-5 bg-light" id="#how-it-works">
      <h2 className="text-center mb-5">How HandCare Works</h2>
      
      <Row className="g-4">
        <Col md={6} lg={3}>
          <Card className="h-100 border-0 shadow-sm">
            <div className="text-center pt-4">
              <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto" style={{ width: '80px', height: '80px' }}>
                <span className="text-white fw-bold fs-1">1</span>
              </div>
            </div>
            <Card.Body className="text-center">
              <Card.Title>Create an Account</Card.Title>
              <Card.Text>
                Sign up as a client looking for services or as a provider offering your skills.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3}>
          <Card className="h-100 border-0 shadow-sm">
            <div className="text-center pt-4">
              <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto" style={{ width: '80px', height: '80px' }}>
                <span className="text-white fw-bold fs-1">2</span>
              </div>
            </div>
            <Card.Body className="text-center">
              <Card.Title>Browse Services</Card.Title>
              <Card.Text>
                Find the perfect service provider or list your services with clear pricing and details.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3}>
          <Card className="h-100 border-0 shadow-sm">
            <div className="text-center pt-4">
              <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto" style={{ width: '80px', height: '80px' }}>
                <span className="text-white fw-bold fs-1">3</span>
              </div>
            </div>
            <Card.Body className="text-center">
              <Card.Title>Book & Pay</Card.Title>
              <Card.Text>
                Schedule your service and pay securely through our protected payment system.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3}>
          <Card className="h-100 border-0 shadow-sm">
            <div className="text-center pt-4">
              <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center mx-auto" style={{ width: '80px', height: '80px' }}>
                <span className="text-white fw-bold fs-1">4</span>
              </div>
            </div>
            <Card.Body className="text-center">
              <Card.Title>Enjoy & Review</Card.Title>
              <Card.Text>
                Receive your service and leave feedback to help other clients find great providers.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <div className="text-center mt-5">
        <a href="/prod" className="btn btn-primary btn-lg">Get Started Today</a>
      </div>
    </Container>
  );
};

export default HowItWorks;
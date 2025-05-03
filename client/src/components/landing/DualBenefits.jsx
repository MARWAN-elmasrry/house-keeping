import React from 'react';
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap';

const DualBenefits = () => {
  return (
    <Container className="py-5" id="become-provider">
      <h2 className="text-center mb-5">HandCare Benefits</h2>
      
      <Tab.Container defaultActiveKey="clients">
        <Nav className="justify-content-center mb-4">
          <Nav.Item>
            <Nav.Link eventKey="clients" className="px-4 py-2 rounded-pill mx-2 bg-light">For Clients</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="providers" className="px-4 py-2 rounded-pill mx-2 bg-light">For Service Providers</Nav.Link>
          </Nav.Item>
        </Nav>
        
        <Tab.Content>
          <Tab.Pane eventKey="clients">
            <Row className="align-items-center">
              <Col lg={6} className="pe-lg-5">
                <h3 className="mb-4">Why Clients Love HandCare</h3>
                <div className="mb-4">
                  <h5><i className="bi bi-check-circle-fill text-primary me-2"></i> Verified Service Providers</h5>
                  <p>Every provider is vetted and verified for your safety and peace of mind.</p>
                </div>
                <div className="mb-4">
                  <h5><i className="bi bi-check-circle-fill text-primary me-2"></i> Transparent Pricing</h5>
                  <p>See exact prices upfront with no hidden fees or surprises.</p>
                </div>
                <div className="mb-4">
                  <h5><i className="bi bi-check-circle-fill text-primary me-2"></i> Secure Booking</h5>
                  <p>Our protected payment system releases funds only when you're satisfied.</p>
                </div>
                <div className="mb-4">
                  <h5><i className="bi bi-check-circle-fill text-primary me-2"></i> Reviews You Can Trust</h5>
                  <p>Read honest feedback from other clients to find the perfect provider.</p>
                </div>
                <a href="/prod" className="btn btn-primary mt-2">Find Services Now</a>
              </Col>
              <Col lg={6}>
                <img 
                  src="https://sitescdn.wearevennture.co.uk/public/franklin-fitch/mediahub/client-value-hero-800x450-622187f1af774645bd2e06dd981c69d5-8c20e78fd91d4ff1b193d69586b86499.jpg" 
                  alt="HandCare for Clients" 
                  className="img-fluid rounded shadow"
                />
              </Col>
            </Row>
          </Tab.Pane>
          
          <Tab.Pane eventKey="providers">
            <Row className="align-items-center">
              <Col lg={6} className="order-lg-2 ps-lg-5">
                <h3 className="mb-4">Why Providers Join HandCare</h3>
                <div className="mb-4">
                  <h5><i className="bi bi-check-circle-fill text-primary me-2"></i> Grow Your Business</h5>
                  <p>Reach new clients and expand your customer base with our marketing tools.</p>
                </div>
                <div className="mb-4">
                  <h5><i className="bi bi-check-circle-fill text-primary me-2"></i> Set Your Own Schedule</h5>
                  <p>Work when you want and accept only the jobs that fit your availability.</p>
                </div>
                <div className="mb-4">
                  <h5><i className="bi bi-check-circle-fill text-primary me-2"></i> Secure Payments</h5>
                  <p>Get paid on time, every time, with our reliable payment processing.</p>
                </div>
                <div className="mb-4">
                  <h5><i className="bi bi-check-circle-fill text-primary me-2"></i> Build Your Reputation</h5>
                  <p>Collect reviews and ratings to showcase your quality service.</p>
                </div>
                <a href="/sign" className="btn btn-primary mt-2">Become a Provider</a>
              </Col>
              <Col lg={6} className="order-lg-1 mb-4 mb-lg-0">
                <img 
                  src="https://lear-connectors.com/wp-content/uploads/2023/01/customer-self-service.jpg" 
                  alt="HandCare for Providers" 
                  className="img-fluid rounded shadow"
                />
              </Col>
            </Row>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default DualBenefits;
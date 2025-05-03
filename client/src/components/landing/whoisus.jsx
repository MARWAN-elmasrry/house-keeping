import React from "react";
import { Container, Row, Col } from 'react-bootstrap';

const WhoIsUs = () => {
    return (
        <Container className="py-5">
            <Row className="align-items-center">
                <Col lg={6} className="mb-4 mb-lg-0">
                    <img 
                        src="https://www.idealurologyhospital.com/images/about-us-.jpg" 
                        alt="HandCare Team" 
                        className="img-fluid rounded shadow"
                    />
                </Col>
                <Col lg={6}>
                    <h2 className="mb-4 fw-bold">About HandCare</h2>
                    <p className="lead mb-4">
                        HandCare is a marketplace platform that connects skilled service providers with clients seeking quality services.
                    </p>
                    <p className="mb-4">
                        Our mission is to create opportunities for skilled individuals to offer their services while making it easy for clients to find reliable help for their needs.
                    </p>
                    <p>
                        Whether you're looking for services or wanting to offer your skills, HandCare provides a secure, user-friendly platform with transparent pricing, verified reviews, and hassle-free booking.
                    </p>
                    <div className="d-flex gap-2 mt-4">
                        <a href="#download" className="btn btn-primary">Download App</a>
                        <a href="#learn-more" className="btn btn-outline-secondary">Learn More</a>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default WhoIsUs;



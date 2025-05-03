import React from "react";
import { Container, Row, Col } from 'react-bootstrap';

const WhatServ = () => {
    return (
        <Container className="py-5" id="services">
            <Row className="align-items-center">
                <Col lg={6} className="order-lg-1 order-2 pe-lg-5 mb-5 mb-lg-0">
                    <h2 className="mb-4 fw-bold">Services You Can Find</h2>
                    <p className="lead mb-4">
                        HandCare connects you with skilled professionals offering a wide range of services to make your life easier.
                    </p>
                    <ul className="list-unstyled mb-4">
                        <li className="mb-2">✓ Home cleaning & organization</li>
                        <li className="mb-2">✓ Handyman & repair services</li>
                        <li className="mb-2">✓ Personal assistance & errands</li>
                        <li className="mb-2">✓ Beauty & wellness at home</li>
                        <li className="mb-2">✓ Tech support & device setup</li>
                    </ul>
                    <p>
                        Every service provider on our platform is vetted and reviewed to ensure quality, reliability, and your complete satisfaction.
                    </p>
                    <a href="/prod" className="btn btn-primary mt-2">Browse All Services</a>
                </Col>
                <Col lg={6} className="mb-4 mb-lg-0 order-lg-2 order-1 ps-lg-5">
                    <img 
                        src="https://prek4sa.com/wp-content/uploads/elementor/thumbs/img-fw-community-section-qbgnxzi2igwdzkaptrbfh08wy0u7reagk3lf498nio.jpg" 
                        alt="HandCare Services" 
                        className="img-fluid rounded shadow"
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default WhatServ;




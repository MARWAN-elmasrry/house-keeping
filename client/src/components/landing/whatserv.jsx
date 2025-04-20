import React from "react";
import { Container, Row, Col } from 'react-bootstrap';

const WhatServ = () => {
    return (
        <Container className="py-5">
            <Row className="align-items-center">
                <Col lg={6} className="order-lg-1 order-2 pe-lg-5 mb-5 mb-lg-0">
                    <h2 className="mb-4 fw-bold">What We Serve</h2>
                    <p className="lead mb-4">
                        We offer a comprehensive range of solutions tailored to meet your specific needs and exceed your expectations.
                    </p>
                    <ul className="list-unstyled mb-4">
                        <li className="mb-2">✓ Custom software development</li>
                        <li className="mb-2">✓ Web application design</li>
                        <li className="mb-2">✓ Mobile solutions</li>
                        <li className="mb-2">✓ Cloud integration services</li>
                        <li className="mb-2">✓ Digital transformation consulting</li>
                    </ul>
                    <p>
                        Our team of experts uses cutting-edge technologies and industry best practices to deliver solutions that drive growth and efficiency for your business.
                    </p>
                </Col>
                <Col lg={6} className="mb-4 mb-lg-0 order-lg-2 order-1 ps-lg-5">
                    <img 
                        src="https://prek4sa.com/wp-content/uploads/elementor/thumbs/img-fw-community-section-qbgnxzi2igwdzkaptrbfh08wy0u7reagk3lf498nio.jpg" 
                        alt="Our Services" 
                        className="img-fluid rounded shadow"
                    />
                </Col>
            </Row>
        </Container>
    );
}

export default WhatServ;




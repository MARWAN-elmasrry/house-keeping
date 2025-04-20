import React from "react";
import { Container, Row, Col } from 'react-bootstrap';

const WhoIsUs = () => {
    return (
        <Container className="py-5">
            <Row className="align-items-center">
                <Col lg={6} className="mb-4 mb-lg-0">
                    <img 
                        src="https://www.idealurologyhospital.com/images/about-us-.jpg" 
                        alt="Our Team" 
                        className="img-fluid rounded shadow"
                    />
                </Col>
                <Col lg={6}>
                    <h2 className="mb-4 fw-bold">Who Is Us</h2>
                    <p className="lead mb-4">
                        We are a passionate team of professionals dedicated to excellence in everything we do.
                        Founded in 2018, our company has grown from a small startup to an industry leader.
                    </p>
                    <p className="mb-4">
                        Our mission is to provide innovative solutions that transform how our clients operate.
                        We believe in collaboration, integrity, and pushing the boundaries of what's possible.
                    </p>
                    <p>
                        With team members across three continents, we bring diverse perspectives and expertise
                        to solve complex challenges. Our commitment to quality and customer satisfaction sets
                        us apart in the industry.
                    </p>
                </Col>
            </Row>
        </Container>
    );
}

export default WhoIsUs;
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [validated, setValidated] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState(false);
  const [showError, setShowError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);
  
    if (!form.checkValidity()) {
      event.stopPropagation();
      setShowError(true);
      return;
    }
  
    const userRole = role ? "seller" : "user"; // Check role and set the appropriate value
  
    try {
      const url = userRole === "seller" 
        ? 'http://localhost:4000/api/sign-s/' 
        : 'http://localhost:4000/api/sign-u/';
  
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          role: userRole,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Registration failed');
      }
  
      const data = await response.json();

      console.log(data)
      
      // Handle remember me functionality if needed
      if (rememberMe) {
        localStorage.setItem('userToken', data.token);
      } else {
        sessionStorage.setItem('userToken', data.token);
      }


  
      navigate('/login');
      setShowError(false);
  
    } catch (error) {
      console.error('Registration error:', error);
      setShowError(true);
    }
  };
  

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center" style={{ marginTop: 240, marginBottom: 240 }}>
        <Col md={6}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Sign In</h4>
            </Card.Header>
            <Card.Body>
              {showError && (
                <Alert variant="danger">
                  Registration failed. Please check your information and try again.
                </Alert>
              )}
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <Form.Control.Feedback type="invalid">
                    Password must be at least 6 characters long.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPhone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    pattern="[0-9]{10,}"
                  />
                  <Form.Control.Feedback type="invalid">
                    Phone number must be at least 10 digits.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check
                    type="checkbox"
                    label="Remember Me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicSeller">
                  <Form.Check
                    type="checkbox"
                    label="I am a seller"
                    checked={role}
                    onChange={(e) => setRole(e.target.checked)}
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit">
                    Sign In
                  </Button>
                </div>
              </Form>
            </Card.Body>
            <Card.Footer className="text-center">
              <p className="mb-0">
                Have an account? <a href="/login">Login Here</a>
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
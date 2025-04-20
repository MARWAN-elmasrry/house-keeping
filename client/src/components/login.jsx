import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      event.stopPropagation();
      setShowError(true);
      setValidated(true);
      return;
    }

    const axiosInstance = axios.create();
    const loginData = { email, password };

    try {
      // Seller login
      const sellerConfig = {
        method: 'post',
        url: 'http://localhost:4000/api/login-s',
        data: loginData,
        headers: { 'Content-Type': 'application/json' },
      };

      const response = await axiosInstance(sellerConfig);
      console.log('Seller login data:', response.data);

      if (rememberMe) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userId', response.data.saller.id); // ✅
      } else {
        sessionStorage.setItem('authToken', response.data.token);
        sessionStorage.setItem('userId', response.data.saller.id); // ✅
      }

      navigate('/user');
      setShowError(false);
    } catch (sellerError) {
      try {
        // User login
        const userConfig = {
          method: 'post',
          url: 'http://localhost:4000/api/login-u',
          data: loginData,
          headers: { 'Content-Type': 'application/json' },
        };

        const response = await axiosInstance(userConfig);
        console.log('User login data:', response.data);

        if (rememberMe) {
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('userId', response.data.user.id); // ✅
        } else {
          sessionStorage.setItem('authToken', response.data.token);
          sessionStorage.setItem('userId', response.data.user.id); // ✅
        }

        navigate('/user');
        setShowError(false);
      } catch (userError) {
        console.error('Login error:', userError);
        setShowError(true);
      }
    }

    setValidated(true);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center" style={{ marginTop: 240, marginBottom: 240 }}>
        <Col md={6}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h4 className="mb-0">Login</h4>
            </Card.Header>
            <Card.Body>
              {showError && (
                <Alert variant="danger">
                  Invalid email or password. Please try again.
                </Alert>
              )}
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
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
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <Form.Control.Feedback type="invalid">
                    Password must be at least 6 characters.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check
                    type="checkbox"
                    label="Remember me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit">
                    Log In
                  </Button>
                </div>

                <div className="mt-3 text-center">
                  <a href="#forgot-password">Forgot Password?</a>
                </div>
              </Form>
            </Card.Body>
            <Card.Footer className="text-center">
              <p className="mb-0">
                Don't have an account? <a href="/sign">Register here</a>
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;

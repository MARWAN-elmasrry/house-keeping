import React, { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import { jwtDecode } from 'jwt-decode';

const NavBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
        setUserName(decodedToken.name || "User");
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUserRole(null);
    window.location.href = "/";
  };

  return (
    <Navbar bg="white" expand="lg" fixed="top" className="shadow-sm py-2">
      <Container>
        <Navbar.Brand href="/" className="fw-bold fs-4 text-primary">
          Hand<span className="text-dark">Care</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link href="/" className="mx-2">Home</Nav.Link>
            <Nav.Link href="/prod" className="mx-2">Services</Nav.Link>
            <Nav.Link href="#how-it-works" className="mx-2">How It Works</Nav.Link>
            <Nav.Link href="#contact" className="mx-2">Contact</Nav.Link>
            
            {isAuthenticated && userRole === "user" && (
              <Nav.Link href="/prod" className="mx-2">Find Services</Nav.Link>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <NavDropdown 
                title={
                  <span>
                    <i className="bi bi-person-circle me-1"></i> 
                    {userName}
                  </span>
                } 
                id="basic-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item href="/user">My Profile</NavDropdown.Item>
                {userRole === "user" && (
                  <>
                    <NavDropdown.Item href="/user">My Bookings</NavDropdown.Item>
                    <NavDropdown.Item href="/user">Saved Services</NavDropdown.Item>
                  </>
                )}
                <NavDropdown.Item href="/chat">Messages</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex">
                <Button variant="outline-primary" href="/login" className="me-2">Login</Button>
                <Button variant="primary" href="/sign">Sign Up</Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
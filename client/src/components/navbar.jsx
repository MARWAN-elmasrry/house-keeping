import React, { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { jwtDecode } from 'jwt-decode';

const NavBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <div>
      <Navbar bg="primary" data-bs-theme="dark" fixed="top">
        <Container>
          <Navbar.Brand href="/">Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            {userRole === "user" && (
              <Nav.Link href="/prod">Products</Nav.Link>
            )}
            {isAuthenticated ? (
              <>
                <Nav.Link href="/user">Profile</Nav.Link>
                <Nav.Link href="/chat">Chat</Nav.Link>
              </>
            ) : (
              <Nav.Link href="/login">Login</Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
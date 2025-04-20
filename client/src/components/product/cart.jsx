import React, { useState } from 'react';
import { Container, Row, Col, Table, Button, Card, Form, InputGroup } from 'react-bootstrap';

const Cart = () => {
  // Sample cart data - in a real app, this would come from state management or context
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Product 1', price: 19.99, quantity: 2, image: 'https://images.squarespace-cdn.com/content/v1/530cd931e4b0e49b19b254ec/ef572341-cfa5-48b4-823e-195af17cbcf3/final+logo++copy-1+%281%29.png' },
    { id: 2, name: 'Product 2', price: 29.99, quantity: 1, image: 'https://images.squarespace-cdn.com/content/v1/530cd931e4b0e49b19b254ec/ef572341-cfa5-48b4-823e-195af17cbcf3/final+logo++copy-1+%281%29.png' },
    { id: 3, name: 'Product 3', price: 49.99, quantity: 3, image: 'https://images.squarespace-cdn.com/content/v1/530cd931e4b0e49b19b254ec/ef572341-cfa5-48b4-823e-195af17cbcf3/final+logo++copy-1+%281%29.png' },
  ]);

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 5.99;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Remove item from cart
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center my-5">
          <h3>Your cart is empty</h3>
          <Button variant="primary" className="mt-3">Continue Shopping</Button>
        </div>
      ) : (
        <Row>
          <Col lg={8}>
            <Table responsive className="align-middle">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img src={item.image} alt={item.name} className="me-3" style={{ width: 80, height: 80, objectFit: 'cover' }} />
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>
                      <InputGroup style={{ width: 120 }}>
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <Form.Control 
                          value={item.quantity} 
                          readOnly 
                          className="text-center"
                        />
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </InputGroup>
                    </td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <Button 
                        variant="link" 
                        className="text-danger p-0" 
                        onClick={() => removeItem(item.id)}
                      >
                        ✕
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-between">
              <Button variant="outline-secondary" href='/prod'>Continue Shopping</Button>
              <Button variant="outline-secondary">Update Cart</Button>
            </div>
          </Col>
          
          <Col lg={4}>
            <Card className="mt-4 mt-lg-0">
              <Card.Header as="h5">Order Summary</Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <strong>${total.toFixed(2)}</strong>
                </div>
                
                <Form className="mb-3">
                  <Form.Group className="mb-3">
                    <Form.Label>Promo Code</Form.Label>
                    <InputGroup>
                      <Form.Control type="text" placeholder="Enter code" />
                      <Button variant="outline-secondary">Apply</Button>
                    </InputGroup>
                  </Form.Group>
                </Form>
                
                <Button variant="primary" size="lg" className="w-100">Proceed to Checkout</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Cart;
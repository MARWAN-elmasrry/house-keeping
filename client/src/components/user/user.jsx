import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Nav, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const User = () => {

  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    services: [],
    orderedServices: [], 
    createdAt: null,
    role: "", 
  });
  
  useEffect(() => {
    const token = localStorage.getItem("authToken");  
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken); 
  
        setUserData({
          name: decodedToken.name || '',
          email: decodedToken.email || '',
          phone: decodedToken.phone, 
          services: [], 
          orderedServices: decodedToken.orderedServices || [], 
          createdAt: new Date(), 
          role: decodedToken.role || '',
        });

        if (decodedToken.role !== "seller" && decodedToken.orderedServices?.length > 0) {
          fetchOrderedServices(decodedToken.orderedServices);
        }
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    }
  }, []);
  
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({...userData});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    price: "",
    category: "Home",
    image: [""]
  });
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    if (userData.role === "seller") {
      fetchServices();
    }
  }, [userData.role]);

  const fetchOrderedServices = async (serviceIds) => {
    setLoading(true);
    try {
      const servicesDetails = [];
      
      for (const serviceId of serviceIds) {
        const response = await axios.get(`http://localhost:4000/api/ser/${serviceId}`);
        if (response.data) {
          servicesDetails.push(response.data);
        }
      }
      
      setUserData(prevData => ({
        ...prevData,
        services: servicesDetails
      }));
    } catch (error) {
      console.error('Error fetching ordered services:', error);
      setMessage({ 
        type: 'danger', 
        text: `Failed to load ordered services: ${error.response?.data?.message || error.message}` 
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/ser/');
      console.log(response.data)
      if (response.data && Array.isArray(response.data)) {
        setUserData({...userData, services: response.data});
      } else if (response.data && response.data.services) {
        setUserData({...userData, services: response.data.services});
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setMessage({ 
        type: 'danger', 
        text: `Failed to load services: ${error.response?.data?.message || error.message}` 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setNewService({
      ...newService,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData({...formData});
    setMessage({ type: 'success', text: 'Profile updated successfully!' });
    setEditing(false);
    
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const handleMarkAsDone = async (serviceId) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:4000/api/ser/${serviceId}`, {
        status: "completed"
      });
  
      const response = await axios.get(`http://localhost:4000/api/ser/${serviceId}`);
      
      const updatedServices = userData.services.map(service => 
        service._id === serviceId ? response.data : service
      );
      
      setUserData({...userData, services: updatedServices});
      setMessage({ type: 'success', text: 'Service marked as completed!' });
    } catch (error) {
      console.error('Error updating service status:', error);
      setMessage({ 
        type: 'danger', 
        text: `Failed to update status: ${error.response?.data?.message || error.message}` 
      });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newService.title || !newService.description || !newService.price) {
      setMessage({ type: 'danger', text: 'All fields are required!' });
      return;
    }

    
    setLoading(true);
    try {
      const serviceData = {
        seller: "67efe63d8ed99d8148d558e9", 
        title: newService.title,
        description: newService.description,
        price: Number(newService.price),
        category: newService.category,
        image: newService.image
      };

      const response = await axios.post('http://localhost:4000/api/ser/', serviceData);
      
      if (response.data && response.data.service) {
        setUserData({
          ...userData, 
          services: [...userData.services, response.data.service]
        });
        
        setNewService({
          title: "",
          description: "",
          price: "",
          category: "Home",
          image: []
        });
        
        setMessage({ type: 'success', text: response.data.message || 'Service added successfully!' });
      }
    } catch (error) {
      console.error('Error adding service:', error);
      setMessage({ 
        type: 'danger', 
        text: `Failed to add service: ${error.response?.data?.message || error.message}` 
      });
    } finally {
      setLoading(false);
      
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  const handleDeleteService = async (serviceId) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:4000/api/ser/${serviceId}`);
      
      const updatedServices = userData.services.filter(service => service._id !== serviceId);
      setUserData({...userData, services: updatedServices});
      
      setMessage({ type: 'success', text: 'Service deleted successfully!' });
    } catch (error) {
      console.error('Error deleting service:', error);
      setMessage({ 
        type: 'danger', 
        text: `Failed to delete service: ${error.response?.data?.message || error.message}` 
      });
    } finally {
      setLoading(false);
      
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  const startEditService = (service) => {
    setEditingService({
      ...service,
      price: service.price.toString() 
    });
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const updatedServiceData = {
        title: editingService.title,
        description: editingService.description,
        price: Number(editingService.price),
        category: editingService.category || "Home",
        image: editingService.image
      };
      
      const response = await axios.put(
        `http://localhost:4000/api/ser/${editingService._id}`, 
        updatedServiceData
      );
      
      if (response.data) {
        const updatedServices = userData.services.map(service => 
          service._id === editingService._id ? response.data.service || editingService : service
        );
        
        setUserData({...userData, services: updatedServices});
        setEditingService(null);
        
        setMessage({ 
          type: 'success', 
          text: response.data.message || 'Service updated successfully!' 
        });
      }
    } catch (error) {
      console.error('Error updating service:', error);
      setMessage({ 
        type: 'danger', 
        text: `Failed to update service: ${error.response?.data?.message || error.message}` 
      });
    } finally {
      setLoading(false);
      
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const renderServiceSection = () => {
    const isSeller = userData.role === "seller";
    
    if (isSeller) {
      return (
        <div>
          <h4 className="mb-3">Your Services</h4>
          
          {loading && (
            <div className="text-center py-3">
              <p>Loading...</p>
            </div>
          )}
          
          {editingService ? (
            <Form onSubmit={handleUpdateService}>
              <h5>Update Service</h5>
              <Form.Group className="mb-3">
                <Form.Label>Service Title</Form.Label>
                <Form.Control 
                  type="text" 
                  name="title" 
                  value={editingService.title} 
                  onChange={(e) => setEditingService({...editingService, title: e.target.value})} 
                  required 
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  name="description" 
                  value={editingService.description} 
                  onChange={(e) => setEditingService({...editingService, description: e.target.value})} 
                  required 
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control 
                  type="number" 
                  name="price" 
                  value={editingService.price} 
                  onChange={(e) => setEditingService({...editingService, price: e.target.value})} 
                  required 
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control 
                  as="select"
                  name="category" 
                  value={editingService.category || "Home"} 
                  onChange={(e) => setEditingService({...editingService, category: e.target.value})}
                >
                  <option value="Home">Home</option>
                  <option value="Technology">Technology</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Other">Other</option>
                </Form.Control>
              </Form.Group>
              <div className="d-flex gap-2">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Service'}
                </Button>
                <Button variant="secondary" onClick={() => setEditingService(null)}>
                  Cancel
                </Button>
              </div>
            </Form>
          ) : (
            <Form onSubmit={handleAddService}>
              <h5>Add New Service</h5>
              <Form.Group className="mb-3">
                <Form.Label>Service Title</Form.Label>
                <Form.Control 
                  type="text" 
                  name="title" 
                  value={newService.title} 
                  onChange={handleServiceChange} 
                  required 
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  name="description" 
                  value={newService.description} 
                  onChange={handleServiceChange} 
                  required 
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control 
                  type="number" 
                  name="price" 
                  value={newService.price} 
                  onChange={handleServiceChange} 
                  required 
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control 
                  as="select"
                  name="category" 
                  value={newService.category} 
                  onChange={handleServiceChange}
                >
                  <option value="Home">Home</option>
                  <option value="Technology">Technology</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Other">Other</option>
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image url</Form.Label>
                <Form.Control 
                  type="text" 
                  name="image" 
                  value={newService.image} 
                  onChange={handleServiceChange} 
                  required 
                />
              </Form.Group>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Adding...' : 'Add Service'}
              </Button>
            </Form>
          )}
          
          <hr className="my-4" />
          
          {userData.services.length > 0 ? (
            <div>
              <h5>Your Service Listings</h5>
              <ListGroup className="mt-3">
                {userData.services.map((service) => (
                  <ListGroup.Item key={service._id} className="d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">{service.title}</div>
                      <p className="mb-1">{service.description}</p>
                      {service.status === "pending" && (
                        <span className="badge bg-warning text-dark">Status: {service.status}</span>
                      )}

                      {service.status === "in progress" && (
                        <span className="badge bg-info text-dark">Status: {service.status}</span>
                      )}

                      {service.status === "completed" && (
                        <span className="badge bg-success">Status: {service.status}</span>
                      )}

                      <p className="mb-0 text-primary">${service.price}</p>
                      {service.category && (
                        <span className="badge bg-secondary">{service.category}</span>
                      )}

                    </div>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => startEditService(service)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteService(service._id)}
                        disabled={loading}
                      >
                        {loading ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          ) : !loading && (
            <div className="text-center py-3">
              <p className="text-muted">You haven't added any services yet. Use the form above to add services.</p>
            </div>
          )}
        </div>
      );
    } else {
      // NORMAL USER VIEW - Modified to display ordered services with "Mark as Done" button
      return userData.services.length > 0 ? (
        <div>
          <h4 className="mb-3">Your Ordered Services</h4>
          <ListGroup className="mt-3">
            {userData.services.map((service) => (
              <ListGroup.Item key={service._id} className="d-flex justify-content-between align-items-start">
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{service.title}</div>
                  <p className="mb-1">{service.description}</p>
                  <p className="mb-0 text-primary">${service.price}</p>
                  {service.category && (
                    <span className="badge bg-secondary me-2">{service.category}</span>
                  )}
                  {service.status === "pending" && (
                    <span className="badge bg-warning text-dark">Status: {service.status}</span>
                  )}
                  {service.status === "in progress" && (
                    <span className="badge bg-info text-dark">Status: {service.status}</span>
                  )}
                  {service.status === "completed" && (
                    <span className="badge bg-success">Status: {service.status}</span>
                  )}
                </div>
                <div>
                {service.status !== "completed" && (  
      <Button 
        variant="success" 
        size="sm"
        onClick={() => handleMarkAsDone(service._id)}
        disabled={loading}
      >
        {loading ? 'Updating...' : 'Mark as Done'}
      </Button>
    )}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      ) : (
        <div className="text-center py-5">
          <h5>You haven't ordered any services yet</h5>
          <p className="text-muted">Browse our service catalog to find services that match your needs</p>
          <Button variant="primary" href='/prod'>Browse Services</Button>
        </div>
      );
    }
  };

  return (
    <Container style={{
      minHeight: '110vh',
      paddingTop: 20,
      paddingBottom: 20,
      boxSizing: 'border-box', 
      display: 'flex',
      flexDirection: 'column', 
      justifyContent: 'center',
      overflow: 'hidden'
  }}>
      <Row>
        <Col lg={3}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '150px', height: '150px', fontSize: '64px' }}>
                {userData.name.charAt(0).toUpperCase()}
              </div>
              <h5 className="my-3">{userData.name}</h5>
              <p className="text-muted mb-1">{userData.email}</p>
              <p className="text-muted mb-4">Member since {formatDate(userData.createdAt)}</p>
              <div className="d-flex justify-content-center mb-2">
                {!editing && (
                  <Button variant="primary" onClick={() => setEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
              {userData.role === "seller" && (
                <div className="mt-2">
                  <span className="badge bg-success">Seller Account</span>
                </div>
              )}
              <Button variant="primary" onClick={()=>{
                localStorage.removeItem('authToken');
                navigate('/login');
              }}>
                    LOG OUT
                  </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={9}>
          {message && (
            <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
              {message.text}
            </Alert>
          )}

          <Tab.Container defaultActiveKey="profile">
            <Card className="mb-4">
              <Card.Header>
                <Nav variant="tabs">
                  <Nav.Item>
                    <Nav.Link eventKey="profile">Profile Information</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="security">Security</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="services">
                      {userData.role === "seller" ? "Manage Services" : "My Services"}
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body>
                <Tab.Content>
                  <Tab.Pane eventKey="profile">
                    {editing ? (
                      <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone</Form.Label>
                          <Form.Control 
                            type="tel" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleChange} 
                          />
                        </Form.Group>
                        <div className="mt-4 d-flex gap-2">
                          <Button variant="primary" type="submit">
                            Save Changes
                          </Button>
                          <Button variant="secondary" onClick={() => {
                            setEditing(false);
                            setFormData({...userData});
                          }}>
                            Cancel
                          </Button>
                        </div>
                      </Form>
                    ) : (
                      <Row>
                        <Col md={6}>
                          <p className="mb-0"><strong>Full Name:</strong></p>
                          <p className="text-muted mb-3">{userData.name}</p>
                          <p className="mb-0"><strong>Email:</strong></p>
                          <p className="text-muted mb-3">{userData.email}</p>
                          <p className="mb-0"><strong>Phone:</strong></p>
                          <p className="text-muted mb-0">{userData.phone}</p>
                        </Col>
                        <Col md={6}>
                          <p className="mb-0"><strong>Account Created:</strong></p>
                          <p className="text-muted mb-3">{formatDate(userData.createdAt)}</p>
                          <p className="mb-0"><strong>Account Type:</strong></p>
                          <p className="text-muted mb-0">{userData.role === "seller" ? "Seller" : "Customer"}</p>
                        </Col>
                      </Row>
                    )}
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="security">
                    <Form>
                      <h4 className="mb-3">Change Password</h4>
                      <Form.Group className="mb-3">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control type="password" />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type="password" />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control type="password" />
                      </Form.Group>
                      <Button variant="primary">
                        Update Password
                      </Button>
                    </Form>
                  </Tab.Pane>
                  
                  <Tab.Pane eventKey="services">
                    {renderServiceSection()}
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
};

export default User;
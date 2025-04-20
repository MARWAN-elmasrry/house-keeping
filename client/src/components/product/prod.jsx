import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Services = () => {
  // Add navigation
  const navigate = useNavigate();
  
  // State management
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: 0, max: 10000 },
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/ser/');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        // Ensure services is always an array and each service has required fields
        const validatedServices = Array.isArray(data?.services) 
          ? data.services.map(service => ({
              _id: service._id || Math.random().toString(36).substr(2, 9),
              title: service.title || 'Untitled Service',
              description: service.description || 'No description available',
              category: service.category || 'Uncategorized',
              price: Number(service.price) || 0,
              image: Array.isArray(service.image) ? service.image : [],
              createdAt: service.createdAt || new Date().toISOString(),
              seller: service.seller || { _id: "67efe63d8ed99d8148d558e9", name: "Seller" }
            }))
          : [];
        setServices(validatedServices);
        setFilteredServices(validatedServices);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        setServices([]);
        setFilteredServices([]);
      }
    };

    fetchServices();
  }, []);

  // Contact seller handler - Create a chat directly and navigate to chat page
  const handleContactSeller = async (service) => {
    try {
      // Get the current user ID from localStorage
      const userId = localStorage.getItem('userId') || "67e92b80bda4359a5bc75b98"; // Fallback if not in localStorage
      
      // Create a new chat directly with the API
      const chatPayload = {
        service: service._id,
        user: userId,
        seller: service.seller,
        messages: [
          {
            sender: "user",
            text: "Hello, I'm interested in your service"
          }
        ]
      };

      console.log(chatPayload)
      
      const response = await axios.post('http://localhost:4000/api/chat', chatPayload);
      
      // Navigate to the chat page with the new chat ID
      navigate('/chat', { 
        state: { 
          serviceId: service._id,
          sellerId: service.seller,
          chatId: response.data._id // Pass the created chat ID
        }
      });
      console.log(navigate)
    } catch (error) {
      console.error('Failed to create chat:', error);
      alert('Unable to contact seller at this time. Please try again later.');
    }
  };

  // Extract unique categories for filter options
  const categories = services.length > 0 
    ? [...new Set(services.map(service => service.category))] 
    : [];

  // Filter services when filters change
  useEffect(() => {
    if (services.length === 0) return;

    let result = [...services];

    // Filter by category
    if (filters.categories.length > 0) {
      result = result.filter(service => service.category && filters.categories.includes(service.category))}

    // Filter by price range
    result = result.filter(
      service => service.price >= filters.priceRange.min && 
                service.price <= filters.priceRange.max
    );

    setFilteredServices(result);
  }, [filters, services]);

  // Handle category filter changes
  const handleCategoryChange = (category) => {
    if (filters.categories.includes(category)) {
      setFilters({
        ...filters,
        categories: filters.categories.filter(c => c !== category)
      });
    } else {
      setFilters({
        ...filters,
        categories: [...filters.categories, category]
      });
    }
  };

  // Handle price range changes
  const handlePriceChange = (type, value) => {
    setFilters({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: Math.max(0, parseInt(value) || 0)
      }
    });
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading services...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger" role="alert">
          Error: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container style={{
      minHeight: '90vh',
      paddingTop: 20,
      paddingBottom: 20,
      boxSizing: 'border-box', 
      display: 'flex',
      flexDirection: 'column', 
      justifyContent: 'center',
      overflow: 'hidden'
  }}>
      <h1 className="mb-4 text-center">Services Marketplace</h1>
      <Row>
        {/* Filter Sidebar */}
        <Col md={3} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Filter Services</h5>
            </Card.Header>
            <Card.Body>
              {/* Category Filter */}
              <div className="mb-4">
                <h6>Categories</h6>
                <Form>
                  {categories.map(category => (
                    <Form.Check 
                      key={category}
                      type="checkbox"
                      id={`category-${category}`}
                      label={category}
                      checked={filters.categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="mb-2"
                    />
                  ))}
                </Form>
              </div>
              
              {/* Price Range Filter */}
              <div className="mb-4">
                <h6>Price Range</h6>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Min ($)</Form.Label>
                      <Form.Control 
                        type="number" 
                        value={filters.priceRange.min}
                        onChange={(e) => handlePriceChange('min', e.target.value)}
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Max ($)</Form.Label>
                      <Form.Control 
                        type="number" 
                        value={filters.priceRange.max}
                        onChange={(e) => handlePriceChange('max', e.target.value)}
                        min="0"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
              
              {/* Clear Filters Button */}
              <Button 
                variant="outline-secondary" 
                className="w-100 mt-3"
                onClick={() => setFilters({
                  categories: [],
                  priceRange: { min: 0, max: 1000 },
                })}
              >
                Clear All Filters
              </Button>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Services Grid */}
        <Col md={9}>
          <Row className="mb-3">
            <Col>
              <p className="mb-0">{filteredServices.length} results</p>
            </Col>
            <Col xs="auto">
              <Form.Select>
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </Form.Select>
            </Col>
          </Row>
          
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredServices.map(service => (
              <Col key={service._id}>
                <Card className="h-100 service-card shadow-sm">
                  <Card.Img 
                    variant="top" 
                    src={service.image?.[0] || "/placeholder.jpg"} 
                    alt={service.title || "Service image"} 
                    onError={(e) => {
                      e.target.src = "/placeholder.jpg";
                    }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="h5">{service.title || "Untitled Service"}</Card.Title>
                    <Badge bg="info" className="mb-2 align-self-start">
                      {service.category || "Uncategorized"}
                    </Badge>
                    <Card.Text className="text-truncate mb-2">
                      {service.description || "No description available"}
                    </Card.Text>
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">${service.price?.toFixed(2) || "0.00"}</h5>
                        <small className="text-muted">
                          Posted: {formatDate(service.createdAt)}
                        </small>
                      </div>
                      <div className="d-grid gap-2">
                        <Button variant="primary">View Details</Button>
                        <Button 
                          variant="outline-success"
                          onClick={() => handleContactSeller(service)}
                        >
                          Contact Seller
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          
          {filteredServices.length === 0 && !loading && (
            <div className="text-center py-5">
              <h4>No services available</h4>
              <p>Try adjusting your filter criteria or check back later.</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Services;
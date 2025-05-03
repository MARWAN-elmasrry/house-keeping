import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Badge, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Chat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedChatMessages, setSelectedChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [tokenValid, setTokenValid] = useState(false);
  const [verifiedServiceId, setVerifiedServiceId] = useState(null);
  const [shouldVerify, setShouldVerify] = useState(false);
  
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Validate token and extract user information
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.log("No token found");
      // Handle no token scenario - could redirect to login
      // For now, keep demo user for testing
      setCurrentUser("67e92b80bda4359a5bc75b98");
      setUserRole("user");
      return;
    }
    
    try {
      // Decode the JWT token
      const decodedToken = jwtDecode(token);
      
      // Check if token is expired
      if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
        setError('Your session has expired. Please log in again.');
        localStorage.removeItem('authToken');
        // Consider redirecting to login
        return;
      }
      
      // Set user ID from token
      setCurrentUser(decodedToken.sallerId || decodedToken.userId);
      
      // Set user role from token
      setUserRole(decodedToken.role);
      setTokenValid(true);
      
    } catch (err) {
      console.error("Error decoding token:", err);
      setError("Authentication error. Please log in again.");
      // For demo purposes, set fallback user
      setCurrentUser("67e92b80bda4359a5bc75b98");
      setUserRole("user");
    }
  }, []);

  // Handle incoming service and seller information from location state
  useEffect(() => {
    if (location.state && location.state.serviceId && location.state.sellerId && currentUser) {
      // Check if we already have a chat for this service
      const existingChat = chats.find(chat => 
        chat.service._id === location.state.serviceId && 
        chat.seller._id === location.state.sellerId
      );
      
      if (existingChat) {
        // If chat exists, select it
        handleSelectChat(existingChat);
      } else if (!loading) {
        // If no existing chat and not currently loading, create a new one
        createNewChat(location.state.serviceId, location.state.sellerId);
      }
      
      // Clear the location state to prevent recreation on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location, chats, loading, currentUser]);

  // Fetch all chats
  useEffect(() => {
    if (currentUser) {
      fetchChats();
    }
  }, [currentUser]);

  const fetchChats = async () => {
    setLoading(true);
    
    const endpoint = 'http://localhost:4000/api/chats';
  
    try {
      const { data } = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      
      // For each chat, check service status
      for (const chat of data) {
        if (chat.service && chat.service._id) {
          try {
            const serviceResponse = await axios.get(
              `http://localhost:4000/api/ser/${chat.service._id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                },
              }
            );
            // Update the service details in the chat object
            chat.service = serviceResponse.data;
          } catch (serviceErr) {
            console.error(`Failed to fetch service details for ${chat.service._id}:`, serviceErr);
          }
        }
      }
      
      setChats(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };
  
  // Add abort controller for cleanup
  useEffect(() => {
    const abortController = new AbortController();

    const verifyStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token || !verifiedServiceId) return;

        const verificationRes = await axios.get(
          `http://localhost:4000/api/ser/${verifiedServiceId}`,
          { 
            headers: { Authorization: `Bearer ${token}` },
            signal: abortController.signal
          }
        );

        if (verificationRes.data.status === 'in progress') {
          setChats(prevChats => prevChats.map(chat => {
            if (chat.service?._id === verifiedServiceId) {
              return {
                ...chat,
                service: verificationRes.data
              };
            }
            return chat;
          }));
          setError('Service status updated successfully!');
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError('Verification failed: ' + err.message);
        }
      } finally {
        setShouldVerify(false);
        setVerifiedServiceId(null);
      }
    };

    if (shouldVerify && verifiedServiceId) {
      verifyStatus();
    }

    return () => abortController.abort();
  }, [shouldVerify, verifiedServiceId]);

  // Scroll to bottom of messages when new ones arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChatMessages]);

  // Select a chat and load its messages
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setSelectedChatMessages(chat.messages || []);
    // Fetch latest service status when selecting a chat
    if (chat.service && chat.service._id) {
      fetchServiceStatus(chat.service._id);
    }
    // Set service details for the service details card
    if (chat.service) {
      setServiceDetails(chat.service);
    }
  };
  
  // Fetch service status
  const fetchServiceStatus = async (serviceId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      
      const response = await axios.get(
        `http://localhost:4000/api/ser/${serviceId}`,
        { 
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Update the service status in chats state
      setChats(prevChats => prevChats.map(chat => {
        if (chat.service?._id === serviceId) {
          return {
            ...chat,
            service: {
              ...chat.service,
              ...response.data
            }
          };
        }
        return chat;
      }));
    } catch (err) {
      console.error('Failed to fetch service status:', err);
    }
  };

  // Send a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    // Validate token before sending message
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError("You must be logged in to send messages");
      return;
    }

    try {
      // Set sender explicitly based on token role
      let senderRole;
      try {
        const decodedToken = jwtDecode(token);
        senderRole = decodedToken.role;
      } catch (err) {
        setError("Authentication error. Please login again.");
        return;
      }

      const payload = {
        sender: senderRole === 'seller' ? 'seller' : 'user',
        text: newMessage
      };

      const response = await axios.post(
        `http://localhost:4000/api/chat/${selectedChat._id}/message`, 
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Update with the actual response from server (has timestamp, etc)
      if (response.data && response.data.message) {
        setSelectedChatMessages([...selectedChatMessages, response.data.message]);
      } else {
        // Fallback if server doesn't return the new message
        setSelectedChatMessages([...selectedChatMessages, {...payload, createdAt: new Date()}]);
      }
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  // Delete a chat
  const handleDeleteChat = async (chatId) => {
    try {
      await axios.delete(`http://localhost:4000/api/chat/${chatId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      setChats(chats.filter(chat => chat._id !== chatId));
      if (selectedChat && selectedChat._id === chatId) {
        setSelectedChat(null);
        setSelectedChatMessages([]);
        setServiceDetails(null);
      }
    } catch (err) {
      setError('Failed to delete chat');
      console.error(err);
    }
  };

  // Create a new chat with a service provider
  const createNewChat = async (serviceId, sellerId) => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError("You must be logged in to create a chat");
        setLoading(false);
        return;
      }

      let senderRole;
      try {
        const decodedToken = jwtDecode(token);
        senderRole = decodedToken.role;
      } catch (err) {
        setError("Authentication error. Please login again.");
        setLoading(false);
        return;
      }

      const payload = {
        service: serviceId,
        user: currentUser,
        seller: sellerId,
        messages: [
          {
            sender: senderRole === 'seller' ? 'seller' : 'user',
            text: senderRole === 'seller' 
              ? "Hello, thank you for your interest in my service. How can I help you?" 
              : "Hello, I'm interested in your service"
          }
        ]
      };

      const response = await axios.post('http://localhost:4000/api/chat', payload, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setChats(prevChats => [...prevChats, response.data]);
      setSelectedChat(response.data);
      setSelectedChatMessages(response.data.messages || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to create new chat: ' + (err.response?.data?.message || err.message));
      setLoading(false);
      console.error(err);
    }
  };

  const accepte = async (serviceId, chatId) => {
    try {
      const token = localStorage.getItem('authToken');
      
      const chat = chats.find(c => c._id === chatId);
      
      if (!chat || !chat.user || !chat.user._id) {
        setError('Could not identify the user for this service request');
        return;
      }
      
      const userId = chat.user._id;
      
      console.log(`Accepting service ${serviceId} for user ${userId}`);
      
      await axios.put(
        `http://localhost:4000/api/ser/${serviceId}`,
        { status: 'in progress' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      await axios.put(
        `http://localhost:4000/api/u/${userId}`,
        { orderedServices: serviceId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setVerifiedServiceId(serviceId);
      setShouldVerify(true);
      
      await fetchServiceStatus(serviceId);
    } catch (err) {
      console.error('Error in accepte function:', err);
      setError('Failed to update service status: ' + (err.response?.data?.message || err.message));
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return 'Invalid date';
    }
  };

  const isOwnMessage = (message) => {
    if (userRole === 'seller') {
      return message.sender === 'seller';
    } else {
      return message.sender === 'user';
    }
  };

  const getRoleLabel = (message) => {
    if (message.sender === 'system') return 'System';
    
    if (userRole === 'seller') {
      return message.sender === 'seller' ? 'You' : 'Customer';
    } else {
      return message.sender === 'user' ? 'You' : 'Seller';
    }
  };

  if (loading && chats.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading your conversations...</p>
      </Container>
    );
  }

  return (
    <Container 
    style={{
        minHeight: '91vh',
        paddingTop: 120,
        paddingBottom: 120,
        boxSizing: 'border-box', 
        display: 'flex',
        flexDirection: 'column', 
        justifyContent: 'center',
        overflow: 'hidden'
    }}>
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
          <Button 
            variant="link" 
            className="p-0 ms-2" 
            onClick={() => setError(null)}
          >
            Dismiss
          </Button>
        </Alert>
      )}
      
      <Row>
        {/* SIDEBAR: CHAT LIST AND SERVICE DETAILS */}
        <Col md={4} className="mb-3">
          {/* Role Indicator */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">
              {userRole === 'seller' ? 'Seller Dashboard' : 'Service Conversations'}
            </h4>
            <Badge 
              bg={userRole === 'seller' ? 'success' : 'info'} 
              style={{fontSize: '0.8rem'}}
            >
              {userRole === 'seller' ? 'Seller Account' : 'Buyer Account'}
            </Badge>
          </div>
          
          {/* Chat List Card */}
          <Card className="shadow-sm mb-3">
            <Card.Header className={`${userRole === 'seller' ? 'bg-success' : 'bg-primary'} text-white`}>
              <h5 className="mb-0">
                {userRole === 'seller' ? 'Customer Inquiries' : 'My Conversations'}
              </h5>
            </Card.Header>
            <ListGroup variant="flush">
              {loading && chats.length === 0 ? (
                <ListGroup.Item>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Loading conversations...
                </ListGroup.Item>
              ) : chats.length === 0 ? (
                <ListGroup.Item className="text-center py-4">
                  <i className="bi bi-chat-square-text" style={{fontSize: '2rem', color: '#ccc'}}></i>
                  <p className="mt-2 text-muted">
                    {userRole === 'seller' 
                      ? 'No customer inquiries yet' 
                      : 'No conversations started'}
                  </p>
                </ListGroup.Item>
              ) : (
                chats.map((chat) => (
                  <ListGroup.Item 
                    key={chat._id} 
                    action 
                    active={selectedChat && selectedChat._id === chat._id}
                    className="d-flex justify-content-between align-items-center"
                    onClick={() => handleSelectChat(chat)}
                  >
                    <div>
                      <div className="fw-bold">
                        {chat.service?.title || 'Service'}
                      </div>
                      <small>
                        {userRole === 'seller' 
                          ? `with ${chat.user?.name || 'Customer'}` 
                          : `with ${chat.seller?.name || 'Seller'}`}
                      </small>
                      {chat.messages && chat.messages.length > 0 && (
                        <div className="text-muted small">
                          Last message: {formatTime(chat.messages[chat.messages.length - 1].createdAt)}
                        </div>
                      )}
                    </div>
                    <div>
                      {/* Only show accept button if userRole is seller AND service status is "wait" */}
                      {userRole === 'seller' && chat.service?.status === 'pending' && (
                        <Button 
                          variant="success" 
                          size="sm" 
                          className="rounded-circle"
                          onClick={(e) => {
                            e.stopPropagation();
                            accepte(chat.service?._id, chat._id);
                          }}
                        >
                          <i className="bi bi-check-lg"></i>
                        </Button>
                      )}
                    </div>
                    <div>
                      <Badge 
                        bg={userRole === 'seller' ? 'danger' : 'secondary'} 
                        pill 
                        className="cursor-pointer"
                        style={{cursor: 'pointer'}}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Are you sure you want to delete this conversation?')) {
                            handleDeleteChat(chat._id);
                          }
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </Badge>
                    </div>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
          </Card>

          {/* Service Details Card (when a chat is selected) */}
          {serviceDetails && (
            <Card className="shadow-sm">
              <Card.Header className={`${userRole === 'seller' ? 'bg-success' : 'bg-primary'} text-white`}>
                <h5 className="mb-0">Service Details</h5>
              </Card.Header>
              <Card.Body>
                <div className="text-center mb-3">
                  <img 
                    src={serviceDetails.image?.[0] || "/placeholder.jpg"} 
                    alt={serviceDetails.title} 
                    className="img-fluid rounded" 
                    style={{ maxHeight: '150px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = "/placeholder.jpg";
                    }}
                  />
                </div>
                <h5 className="text-truncate">{serviceDetails.title}</h5>
                <Badge bg="info" className="mb-2">
                  {serviceDetails.category || "Uncategorized"}
                </Badge>
                <p className="small text-muted mb-2">
                  Posted: {formatDate(serviceDetails.createdAt)}
                </p>
                <h6 className="mb-2">${serviceDetails.price?.toFixed(2) || "0.00"}</h6>
                <p className="small">{serviceDetails.description}</p>
                
                {/* Role-specific actions */}
                <div className="mt-3">
                  {userRole === 'seller' && (
                    <>
                      <Button 
                        variant="outline-success" 
                        size="sm" 
                        className="me-2"
                        onClick={() => navigate(`/edit-service/${serviceDetails._id}`)}
                      >
                        <i className="bi bi-pencil me-1"></i> Edit Service
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => navigate(`/service/${serviceDetails._id}`)}
                      >
                        <i className="bi bi-eye me-1"></i> View Listing
                      </Button>
                    </>
                  )}
                  
                  {userRole === 'user' && (
                    <>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => navigate(`/service/${serviceDetails._id}`)}
                      >
                        <i className="bi bi-eye me-1"></i> View Service Details
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => window.open(`/checkout/${serviceDetails._id}`, '_blank')}
                      >
                        <i className="bi bi-cart me-1"></i> Purchase Service
                      </Button>
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
        
        {/* MAIN CONTENT: CHAT MESSAGES */}
        <Col md={8}>
          <Card className="shadow-sm chat-container">
            <Card.Header className={`${userRole === 'seller' ? 'bg-success' : 'bg-primary'} text-white d-flex justify-content-between align-items-center`}>
              <h5 className="mb-0">
                {selectedChat ? (
                  `${userRole === 'seller' ? 'Conversation about' : 'Chat about'} ${selectedChat.service?.title || 'Service'}`
                ) : (
                  `${userRole === 'seller' ? 'Select a customer inquiry' : 'Select a conversation'}`
                )}
              </h5>
              {userRole && (
                <Badge bg="light" text="dark">
                  {userRole === 'seller' ? 'Seller View' : 'Buyer View'}
                </Badge>
              )}
            </Card.Header>
            
            <Card.Body className="chat-messages" style={{ height: '500px', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
              {!selectedChat ? (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-chat-dots" style={{ fontSize: '3rem' }}></i>
                  <p className="mt-3">
                    {userRole === 'seller'
                      ? 'Select a customer inquiry to view messages'
                      : 'Select a conversation to view messages'}
                  </p>
                </div>
              ) : selectedChatMessages.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-chat-square" style={{ fontSize: '3rem' }}></i>
                  <p className="mt-3">No messages in this conversation yet</p>
                </div>
              ) : (
                <div className="d-flex flex-column">
                  {selectedChatMessages.map((message, index) => (
                    <div 
                      key={index}
                      className={`message-container mb-3 ${isOwnMessage(message) ? 'align-self-end' : 'align-self-start'}`}
                      style={{
                        maxWidth: '80%',
                        alignSelf: isOwnMessage(message) ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div className="d-flex align-items-center mb-1">
                        <Badge 
                          bg={message.sender === 'system' ? 'secondary' : 
                             (isOwnMessage(message) ? 
                              (userRole === 'seller' ? 'success' : 'primary') : 
                              'light')}
                          text={message.sender === 'system' || !isOwnMessage(message) ? 'dark' : 'white'}
                          className="me-2"
                        >
                          {getRoleLabel(message)}
                        </Badge>
                        <small className="text-muted">
                          {formatTime(message.createdAt)}
                        </small>
                      </div>
                      <div 
                        className="message-bubble"
                        style={{
                          backgroundColor: isOwnMessage(message) ? 
                                          (userRole === 'seller' ? '#198754' : '#0d6efd') : 
                                          '#f0f0f0',
                          color: isOwnMessage(message) ? '#fff' : '#212529',
                          borderRadius: '1rem',
                          padding: '0.75rem 1rem',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
              
              {loading && selectedChat && (
                <div className="text-center mt-3">
                  <Spinner animation="border" size="sm" />
                </div>
              )}
            </Card.Body>
            
            <Card.Footer className="bg-white">
              <Form onSubmit={handleSendMessage}>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    placeholder={userRole === 'seller' 
                      ? "Reply to customer..." 
                      : "Type a message..."}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={!selectedChat || loading}
                    className={`border-${userRole === 'seller' ? 'success' : 'primary'}`}
                  />
                  <Button 
                    type="submit" 
                    variant={userRole === 'seller' ? 'success' : 'primary'}
                    disabled={!selectedChat || !newMessage.trim() || loading}
                    className="ms-2"
                  >
                    <i className="bi bi-send"></i>
                  </Button>
                </div>
              </Form>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
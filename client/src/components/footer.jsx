import React from 'react';
import {
  CDBBox,
  CDBBtn,
  CDBIcon,
  CDBContainer,
} from 'cdbreact';

export const Footer = () => {
  return (
    <footer className="shadow" style={{ backgroundColor: '#f8f9fa' }}>
      <CDBContainer className="py-5">
        <div className="row">
          {/* Logo and About */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h5 className="text-primary fw-bold mb-3">
              Hand<span className="text-dark">Care</span>
            </h5>
            <p className="text-muted">
              Connecting skilled service providers with clients who need them, making everyday tasks easier.
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="col-md-2 offset-md-1 mb-4 mb-md-0">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <CDBBox display="flex" flex="column">
              <a href="/" className="text-decoration-none text-dark mb-2">Home</a>
              <a href="#services" className="text-decoration-none text-dark mb-2">Services</a>
              <a href="#how-it-works" className="text-decoration-none text-dark mb-2">How It Works</a>
              <a href="#contact" className="text-decoration-none text-dark mb-2">Contact</a>
            </CDBBox>
          </div>
          
          {/* For Users */}
          <div className="col-md-2 mb-4 mb-md-0">
            <h6 className="fw-bold mb-3">For Clients</h6>
            <CDBBox display="flex" flex="column">
              <a href="/find-services" className="text-decoration-none text-dark mb-2">Find Services</a>
              <a href="/register" className="text-decoration-none text-dark mb-2">Sign Up</a>
              <a href="/client-faq" className="text-decoration-none text-dark mb-2">Client FAQ</a>
              <a href="/support" className="text-decoration-none text-dark mb-2">Get Support</a>
            </CDBBox>
          </div>
          
          {/* For Providers */}
          <div className="col-md-2 mb-4 mb-md-0">
            <h6 className="fw-bold mb-3">For Providers</h6>
            <CDBBox display="flex" flex="column">
              <a href="/become-provider" className="text-decoration-none text-dark mb-2">Join as Provider</a>
              <a href="/pricing" className="text-decoration-none text-dark mb-2">Pricing & Fees</a>
              <a href="/provider-faq" className="text-decoration-none text-dark mb-2">Provider FAQ</a>
              <a href="/success-stories" className="text-decoration-none text-dark mb-2">Success Stories</a>
            </CDBBox>
          </div>
          
          {/* Download App */}
          <div className="col-md-2 mb-4 mb-md-0">
            <h6 className="fw-bold mb-3">Get The App</h6>
            <CDBBox display="flex" flex="column">
              <a href="#" className="text-decoration-none mb-2">
                <img 
                  src="/api/placeholder/140/42" 
                  alt="Download on App Store" 
                  className="img-fluid mb-2" 
                  style={{ maxWidth: '140px' }}
                />
              </a>
              <a href="#" className="text-decoration-none mb-2">
                <img 
                  src="/api/placeholder/140/42" 
                  alt="Get it on Google Play" 
                  className="img-fluid" 
                  style={{ maxWidth: '140px' }}
                />
              </a>
            </CDBBox>
          </div>
        </div>
      </CDBContainer>
      
      {/* Bottom Footer */}
      <div className="border-top">
        <CDBContainer>
          <CDBBox
            display="flex"
            justifyContent="between"
            alignItems="center"
            className="py-4"
            style={{ flexWrap: 'wrap' }}
          >
            {/* Copyright */}
            <CDBBox display="flex" alignItems="center">
              <span className="text-muted" style={{ fontSize: '14px' }}>
                © HandCare, {new Date().getFullYear()}. All rights reserved.
              </span>
            </CDBBox>
            
            {/* Terms and Privacy */}
            <CDBBox display="flex" className="mx-auto mx-md-0">
              <a href="/terms" className="text-decoration-none text-muted me-3" style={{ fontSize: '14px' }}>
                Terms of Service
              </a>
              <a href="/privacy" className="text-decoration-none text-muted me-3" style={{ fontSize: '14px' }}>
                Privacy Policy
              </a>
              <a href="/cookies" className="text-decoration-none text-muted" style={{ fontSize: '14px' }}>
                Cookie Policy
              </a>
            </CDBBox>

            {/* Social Icons */}
            <CDBBox display="flex" className="mt-3 mt-md-0">
              <CDBBtn
                flat
                color="primary"
                className="p-2"
                style={{ marginRight: '10px', borderRadius: '50%', width: '36px', height: '36px' }}
              >
                <CDBIcon fab icon="facebook-f" />
              </CDBBtn>
              <CDBBtn
                flat
                color="primary"
                className="p-2"
                style={{ marginRight: '10px', borderRadius: '50%', width: '36px', height: '36px' }}
              >
                <CDBIcon fab icon="twitter" />
              </CDBBtn>
              <CDBBtn
                flat
                color="primary"
                className="p-2"
                style={{ marginRight: '10px', borderRadius: '50%', width: '36px', height: '36px' }}
              >
                <CDBIcon fab icon="instagram" />
              </CDBBtn>
              <CDBBtn
                flat
                color="primary"
                className="p-2"
                style={{ borderRadius: '50%', width: '36px', height: '36px' }}
              >
                <CDBIcon fab icon="linkedin-in" />
              </CDBBtn>
            </CDBBox>
          </CDBBox>
        </CDBContainer>
      </div>
    </footer>
  );
};

export default Footer;
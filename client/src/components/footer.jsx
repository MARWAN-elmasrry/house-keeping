import React from 'react';
import {
  CDBBox,
  CDBBtn,
  CDBIcon,
  CDBContainer,
} from 'cdbreact';

export const Footer = () => {
  return (
    <CDBBox className="shadow" style={{ backgroundColor: '#fff' }}>
      <CDBContainer>
        <CDBBox
          display="flex"
          justifyContent="between"
          alignItems="center"
          className="py-4"
          style={{ flexWrap: 'wrap' }}
        >
          {/* Left Side */}
          <CDBBox display="flex" alignItems="center">
            <span style={{ fontWeight: '500', fontSize: '18px' }}>
              Devwares
            </span>
            <span
              style={{
                marginLeft: '10px',
                color: '#6c757d',
                fontSize: '14px',
              }}
            >
              © Devwares, 2024. All rights reserved.
            </span>
          </CDBBox>

          {/* Right Side - Social Icons */}
          <CDBBox display="flex">
            <CDBBtn
              flat
              color="dark"
              className="p-2"
              style={{ marginRight: '10px', borderRadius: '4px' }}
            >
              <CDBIcon fab icon="facebook-f" />
            </CDBBtn>
            <CDBBtn
              flat
              color="dark"
              className="p-2"
              style={{ marginRight: '10px', borderRadius: '4px' }}
            >
              <CDBIcon fab icon="twitter" />
            </CDBBtn>
            <CDBBtn
              flat
              color="dark"
              className="p-2"
              style={{ marginRight: '10px', borderRadius: '4px' }}
            >
              <CDBIcon fab icon="instagram" />
            </CDBBtn>
          </CDBBox>
        </CDBBox>
      </CDBContainer>
    </CDBBox>
  );
};

export default Footer;

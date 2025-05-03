import React from 'react';

const Hero = () => {
  return (
    <header style={{ paddingLeft: 0 }}>
      <div
        className='p-5 text-center bg-image'
        style={{ 
          backgroundImage: "url('https://mdbootstrap.com/img/new/slides/041.webp')", 
          height: 500, 
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
        <div className='mask' style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', height: 400, borderRadius: 20 }}>
          <div className='d-flex justify-content-center align-items-center h-100'>
            <div className='text-white'>
              <h1 className='mb-3 fw-bold'>HandCare</h1>
              <h4 className='mb-4'>Connecting Skilled Service Providers With Clients Who Need Them</h4>
              <div className='d-flex justify-content-center gap-3'>
                <a className='btn btn-primary btn-lg' href='/prod' role='button'>
                  Find Services
                </a>
                <a className='btn btn-outline-light btn-lg' href='/sign' role='button'>
                  Become a Provider
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Hero;
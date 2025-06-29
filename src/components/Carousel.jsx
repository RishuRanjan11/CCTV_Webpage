import React from 'react';

function Carousel() {
  return (
    <div id="carouselExample" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
      <div className="carousel-indicators">
        <button data-bs-target="#carouselExample" data-bs-slide-to="0" className="active"></button>
        <button data-bs-target="#carouselExample" data-bs-slide-to="1"></button>
        <button data-bs-target="#carouselExample" data-bs-slide-to="2"></button>
      </div>
      <div className="carousel-inner">
        <div className="carousel-item active">
            <img src="/images/eagan-hsu-0hlBlVmKSyE-unsplash.jpg" alt="CCTV 2" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Secure Your Home & Business</h5>
              <p>High-resolution CCTV cameras for total peace of mind, day and night</p>
            </div>
        </div>
        <div className="carousel-item">
            <img src="/images/jakub-zerdzicki-DUml2bEfLLg-unsplash.jpg" alt="CCTV 1" />
            <div className="carousel-caption d-none d-md-block" style={{ color: 'black' }}>
              <h5>24/7 Surveillance Solutions</h5>
              <p>Modern CCTV for every space — homes, shops, and offices</p>
            </div>
        </div>
        <div className="carousel-item">
            <img src="/images/slider 1.jpg" alt="CCTV 3" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Best Prices, Premium Quality</h5>
              <p>Protect what matters to you with trusted CCTV cameras</p>
            </div>
        </div>
      </div>
      <button className="carousel-control-prev" data-bs-target="#carouselExample" data-bs-slide="prev"><span className="carousel-control-prev-icon"></span></button>
      <button className="carousel-control-next" data-bs-target="#carouselExample" data-bs-slide="next"><span className="carousel-control-next-icon"></span></button>
    </div>
  );
}

export default Carousel;

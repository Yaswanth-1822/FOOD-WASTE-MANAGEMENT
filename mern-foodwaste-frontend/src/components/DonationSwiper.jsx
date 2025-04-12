// src/components/DonationSwiper.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import '../styles/homepage.css'; // Reuse existing card styles

const DonationSwiper = ({ items }) => {
  return (
    <div style={{ margin: '40px 0' }}>
      <h2 style={{ marginBottom: '20px' }}>Recent Donations</h2>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={3}
        navigation
        autoplay={{ delay: 3000 }}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="food-card animated-card" style={{ minHeight: '350px', padding: '15px' }}>
              <div className="donor-name">
                {item.donor && item.donor.username ? item.donor.username : "Anonymous"}
              </div>
              {item.image ? (
                <img
                  src={`data:image/jpeg;base64,${item.image}`}
                  alt={item.name}
                  className="food-image"
                  style={{ height: '200px', objectFit: 'cover', width: '100%', borderRadius: '4px' }}
                />
              ) : (
                <div className="food-image-placeholder" style={{ backgroundColor: '#ccc', width: '100%', height: '200px', borderRadius: '4px' }}></div>
              )}
              <div className="food-details">
                <h3 className="food-name">{item.name}</h3>
                <p className="food-description">{item.description}</p>
                <p className="food-quantity">
                  {item.quantity} {item.quantityUnit}
                </p>
              </div>
              <div className="food-card-buttons">
                <button className="order-btn">Order</button>
                <button className="view-btn">View More Details</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default DonationSwiper;

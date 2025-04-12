import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import HomeNavBar from './HomeNavBar';
import Footer from './Footer';
import '../styles/itemdetails.css';

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/donations`)
      .then(response => {
        let foundItem = null;
        response.data.forEach(donation => {
          donation.items.forEach(i => {
            if (i._id === id) {
              foundItem = {
                ...i,
                donor: donation.donor
              };
            }
          });
        });
        setItem(foundItem);
      })
      .catch(err => console.error('Error fetching item details:', err));
  }, [id]);

  if (!item) return <div>Loading item details...</div>;

  return (
    <>
      <HomeNavBar />
      <div className="item-details-container">
        <div className="item-details-content">
          <h2>{item.name}</h2>
          <img
            src={`data:image/jpeg;base64,${item.image}`}
            alt={item.name}
            className="item-image"
          />
          <p><strong>Description:</strong> {item.description}</p>
          <p><strong>Quantity:</strong> {item.quantity} {item.quantityUnit}</p>
          <p><strong>Donor:</strong> {item.donor?.username || "Anonymous"}</p>
        </div>

        <div className="item-details-description">
          <h3>About this item</h3>
          <p>This food item has been generously donated to reduce food waste. Make sure to place an order if you are in need and within the delivery location. All donations are free of charge.</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ItemDetails;

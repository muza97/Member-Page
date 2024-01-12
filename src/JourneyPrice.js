import React, { useEffect } from 'react';

const JourneyPrice = ({ distance }) => {
  const numericDistance = distance ? parseFloat(distance.replace(' km', '')) : 0;

  const kmPrice = 15; 
  const servicePrice = 5; 
  const upfrontPrice = 39; 

  const totalPrice = (numericDistance * kmPrice) + servicePrice + upfrontPrice;
  const formattedTotalPrice = totalPrice.toFixed(2);

  useEffect(() => {
    console.log(`Distance: ${numericDistance} km`);
    console.log(`Service price: ${servicePrice} kr`);
    console.log(`Upfront price: ${upfrontPrice} kr`);
    console.log(`Total price: ${formattedTotalPrice} kr`);
  }, [numericDistance, kmPrice, servicePrice, upfrontPrice, formattedTotalPrice]);

  return (
    <div>
      <p>Total Distance: {distance}</p>
      <p>Total Price: {formattedTotalPrice} kr</p>
    </div>
  );
};

export default JourneyPrice;

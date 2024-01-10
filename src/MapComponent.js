import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 59.61426658893306,
  lng: 17.827052991031128
};




const MapComponent = () => {
  const [startMarker, setStartMarker] = useState(null);
  const [endMarker, setEndMarker] = useState(null);
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');

 
  const apiKey =process.env.REACT_APP_ACCESS_KEY;
 

  const fetchAddress = async (lat, lng) => {
 

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data && response.data.results && response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      } else {
        console.warn('No address found for this location');
        return '';
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      return '';
    }
  };

  const handleMapClick = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    if (!startMarker) {
      setStartMarker({ lat, lng });
      const address = await fetchAddress(lat, lng);
      setStartAddress(address);
    } else if (!endMarker) {
      setEndMarker({ lat, lng });
      const address = await fetchAddress(lat, lng);
      setEndAddress(address);
    }
  };

  return (
   <LoadScript googleMapsApiKey={apiKey}>;

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onClick={handleMapClick}
      >
        {startMarker && <Marker position={startMarker} />}
        {endMarker && <Marker position={endMarker} />}
      </GoogleMap>

      {startAddress && (
        <p>Start Address: {startAddress}</p>
      )}

      {endAddress && (
        <p>End Address: {endAddress}</p>
      )}

     
    </LoadScript>
  );
};

export default React.memo(MapComponent);

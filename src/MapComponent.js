import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import Geocode from 'react-geocode';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const MapComponent = () => {
  const [mapCenter, setMapCenter] = useState(null);
  const [startMarker, setStartMarker] = useState(null);
  const [endMarker, setEndMarker] = useState(null);
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const libraries = ['places'];

  const apiKey = process.env.REACT_APP_ACCESS_KEY;

  // Refs for the Autocomplete components
  const startAutocompleteRef = useRef(null);
  const endAutocompleteRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter({ lat: latitude, lng: longitude });
        setStartMarker({ lat: latitude, lng: longitude });
        fetchAddress(latitude, longitude).then(setStartAddress);
      },
      (err) => {
        console.error(err);
        setMapCenter({ lat: 59.61426658893306, lng: 17.827052991031128 });
      }
    );
  }, []);

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

  const handleStartAddressChange = async (e) => {
    const newAddress = e.target.value;
    setStartAddress(newAddress);

    try {
      const response = await Geocode.fromAddress(newAddress);
      const { lat, lng } = response.results[0].geometry.location;
      setStartMarker({ lat, lng });
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
  };

  const handleEndAddressChange = async (e) => {
    const newAddress = e.target.value;
    setEndAddress(newAddress);

    try {
      const response = await Geocode.fromAddress(newAddress);
      const { lat, lng } = response.results[0].geometry.location;
      setEndMarker({ lat, lng });
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
  };

  const onLoadStartAutocomplete = (autocomplete) => {
    startAutocompleteRef.current = autocomplete;
  };

  const onLoadEndAutocomplete = (autocomplete) => {
    endAutocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = (isStart) => {
    const autocomplete = isStart ? startAutocompleteRef.current : endAutocompleteRef.current;
    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    const address = place.formatted_address;
    const { lat, lng } = place.geometry.location;

    if (isStart) {
      setStartAddress(address);
      setStartMarker({ lat: lat(), lng: lng() });
    } else {
      setEndAddress(address);
      setEndMarker({ lat: lat(), lng: lng() });
    }
  };

  return (
    mapCenter && (
      <LoadScript
        googleMapsApiKey={apiKey}
        libraries={libraries} 
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={14}
          onClick={handleMapClick}
        >
          {startMarker && <Marker position={startMarker} />}
          {endMarker && <Marker position={endMarker} />}
        </GoogleMap>

        <Autocomplete
          onLoad={onLoadStartAutocomplete}
          onPlaceChanged={() => onPlaceChanged(true)}
        >
          <input
            type="text"
            placeholder="Start Address"
            value={startAddress}
            onChange={handleStartAddressChange}
          />
        </Autocomplete>

        <Autocomplete
          onLoad={onLoadEndAutocomplete}
          onPlaceChanged={() => onPlaceChanged(false)}
        >
          <input
            type="text"
            placeholder="End Address"
            value={endAddress}
            onChange={handleEndAddressChange}
          />
        </Autocomplete>
      </LoadScript>
    )
  );
};

export default React.memo(MapComponent);

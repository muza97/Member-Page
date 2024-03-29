import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';
import Geocode from 'react-geocode';
import axios from 'axios';
import JourneyPrice from './JourneyPrice';
import './map.css';

const containerStyle = { width: '100%', height: '400px' };

const MapComponent = () => {
  const [mapCenter, setMapCenter] = useState(null);
  const [startMarker, setStartMarker] = useState(null);
  const [endMarker, setEndMarker] = useState(null);
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');
  const libraries = ['places'];
  const apiKey = process.env.REACT_APP_ACCESS_KEY;
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

  const calculateRoute = async () => {
    if (startMarker && endMarker) {
      const DirectionsService = new window.google.maps.DirectionsService();
      DirectionsService.route({
        origin: new window.google.maps.LatLng(startMarker.lat, startMarker.lng),
        destination: new window.google.maps.LatLng(endMarker.lat, endMarker.lng),
        travelMode: window.google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          setDistance(result.routes[0].legs[0].distance.text);
          setDuration(result.routes[0].legs[0].duration.text);
        } else {
          setError("Error fetching directions.");
        }
      });
    }
  };

  useEffect(() => {
    calculateRoute();
  }, [startMarker, endMarker]);

  return (
    mapCenter ? (
      <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
        <div className="map-container">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={mapCenter}
            zoom={14}
            onClick={handleMapClick}
          >
            {startMarker && <Marker position={startMarker} icon="/path-to-start-icon.png" />}
            {endMarker && <Marker position={endMarker} icon="/path-to-end-icon.png" />}
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
          <Autocomplete onLoad={onLoadStartAutocomplete} onPlaceChanged={() => onPlaceChanged(true)}>
            <input
              className="location-input"
              type="text"
              placeholder="Start Address"
              value={startAddress}
              onChange={handleStartAddressChange}
            />
          </Autocomplete>
          {distance && duration && (
            <div>
              <p>Distance: {distance}</p>
              <p>Duration: {duration}</p>
              <JourneyPrice distance={distance} />
              <button className="button">Book Taxi Now</button>
            </div>
          )}
          {error && <div>{error}</div>}
        </div>
      </LoadScript>
    ) : null
  );
          }
  export default React.memo(MapComponent);
  
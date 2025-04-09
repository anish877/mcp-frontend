// components/MapView.jsx
import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629
};

const MapView = ({ location, setLocation, isEditable = false }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyAjHvfEwL5ant33IemqYANYCiM5OG_RoXo'
  });

  const [map, setMap] = React.useState(null);
  const [center, setCenter] = React.useState(
    location?.coordinates?.length === 2
      ? { lat: location.coordinates[0], lng: location.coordinates[1] }
      : defaultCenter
  );

  const onLoad = React.useCallback(function callback(map: React.SetStateAction<null>) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback() {
    setMap(null);
  }, []);

  const handleMapClick = (event: { latLng: { lat: () => any; lng: () => any; }; }) => {
    if (isEditable && setLocation) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setLocation({
        ...location,
        coordinates: [lat, lng]
      });
      fetchAddressFromCoordinates(lat, lng);
    }
  };
  
  const fetchAddressFromCoordinates = async (lat: any, lng: any) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setLocation({
          ...location,
          address: data.results[0].formatted_address,
          coordinates: [lat, lng]
        });
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={isEditable ? handleMapClick : undefined}
    >
      {location?.coordinates?.length === 2 && (
        <Marker
          position={{ 
            lat: location.coordinates[0], 
            lng: location.coordinates[1] 
          }}
        />
      )}
    </GoogleMap>
  ) : <div>Loading...</div>;
};

export default MapView;
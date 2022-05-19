import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';

import axios from 'axios';
import { LoadScript, GoogleMap, StandaloneSearchBox, Marker } from '@react-google-maps/api';

import StateContext from '../utils/StateContext';
import { getError } from '../utils/error/frontend/error';
import styles from '../scss/google-map.module.scss';

const defaultLocation = { lat: 1.3, lng: 103.7 };
const libs: ('drawing' | 'geometry' | 'localContext' | 'places' | 'visualization')[] = ['places'];

const mapContainerStyle = { height: '100%', width: '100%' };

const GoogleMapPage: NextPage = () => {
  /* navigator.geolocation.getCurrentPosition(
    (position) => {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    },
    (error) => {
      // On android chrome, ...
      //   error ->  "GeolocationPositionError {code: 1, message: 'Only secure origins are allowed (see: https://goo.gl/Y0ZkNV).'}"
      //   error is obtained by
      //     1. inspecting android chrome by usb connecting mobile to desktop via usb2 cable LG Phone charger to hp usb2 port
      //     2. ref https://developer.chrome.com/docs/devtools/remote-debugging/
      // eslint-disable-next-line no-console
      console.log('err', error);
    },
    { enableHighAccuracy: false, timeout: 6000 },
  ); */
  const router = useRouter();

  const { state, dispatch } = useContext(StateContext);
  const {
    userInfo,
    cart: {
      shippingAddress: { location: locationFromState },
    },
  } = state;

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    backgroundColor: '',
  });

  const [googleApiKey, setGoogleApiKey] = useState('');

  useEffect((): void => {
    if (!navigator.geolocation) {
      setAlert({
        open: true,
        message: 'Geolocation is not supported by this browser',
        backgroundColor: '#FF3232',
      });
      return;
    }

    const fetchGoogleApiKey = async (): Promise<void> => {
      try {
        const { data } = await axios.get<string>('/api/keys/google', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        setGoogleApiKey(data);
      } catch (err: unknown) {
        setAlert({
          open: true,
          message: getError(err),
          backgroundColor: '#FF3232',
        });
      }
    };
    fetchGoogleApiKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect((): void => {
    if (googleApiKey) {
      if (locationFromState && locationFromState.lat !== 0 && locationFromState.lng !== 0) {
        setCenter({
          lat: locationFromState.lat,
          lng: locationFromState.lng,
        });
        setLocation({
          lat: locationFromState.lat,
          lng: locationFromState.lng,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleApiKey]);

  const [center, setCenter] = useState(defaultLocation);
  const [location, setLocation] = useState(center);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const placeRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);

  const onLoad = useCallback((mapInstance) => {
    mapRef.current = mapInstance;
  }, []);

  const onIdle = useCallback(() => {
    setLocation({
      lat: mapRef.current.center.lat(),
      lng: mapRef.current.center.lng(),
    });
  }, []);

  const onLoadPlaces = useCallback((place) => {
    placeRef.current = place;
  }, []);

  const onPlacesChanged = useCallback(() => {
    const place = placeRef.current.getPlaces()[0].geometry.location;
    setLocation({
      lat: place.lat(),
      lng: place.lng(),
    });
    setCenter({
      lat: place.lat(),
      lng: place.lng(),
    });
  }, []);

  const onConfirm = (): void => {
    const places = placeRef.current.getPlaces();
    if (places && places.length === 1) {
      dispatch({
        type: 'SAVE_SHIPPING_ADDRESS_MAP_LOCATION',
        payload: {
          lat: location.lat,
          lng: location.lng,
          address: places[0].formatted_address,
          name: places[0].name,
          vicinity: places[0].vicinity,
          googleAddressId: places[0].id,
        },
      });
      setAlert({
        open: true,
        message: 'location selected successfully',
        backgroundColor: '#4BB543',
      });
      router.push('/shipping');
    }
  };

  const onMarkerLoad = useCallback((marker) => {
    markerRef.current = marker;
  }, []);

  return (
    <>
      {/* https://stackoverflow.com/questions/26771549/javascript-google-maps-api-loading-in-web-browser-but-not-android-browser */}
      {googleApiKey ? (
        <div className={styles.googleMapBox}>
          <LoadScript libraries={libs} googleMapsApiKey={googleApiKey}>
            <GoogleMap
              id="sample-map"
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={15}
              onLoad={onLoad}
              onIdle={onIdle}
            >
              <StandaloneSearchBox onLoad={onLoadPlaces} onPlacesChanged={onPlacesChanged}>
                <div className={styles.googleMapBox__inputBox}>
                  <input type="text" placeholder="Enter your address" />
                  <button type="button" onClick={onConfirm}>
                    Confirm
                  </button>
                </div>
              </StandaloneSearchBox>
              <Marker position={location} onLoad={onMarkerLoad} />
            </GoogleMap>
          </LoadScript>
        </div>
      ) : (
        <CircularProgress style={{ margin: '50vh 0 0 50vw' }} />
      )}
      <Snackbar
        open={alert.open}
        message={alert.message}
        ContentProps={{ style: { backgroundColor: alert.backgroundColor } }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={(): void => setAlert({ ...alert, open: false })}
        autoHideDuration={4000}
      />
    </>
  );
};

export default dynamic(() => Promise.resolve(GoogleMapPage), { ssr: false });

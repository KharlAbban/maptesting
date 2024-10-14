import { useEffect, useRef } from "react";
import { useMapboxGl } from "../contexts/GlobalMapContext";
import { GH_GEOLOCATION } from "../utils/key_geocodes";
import { FaHamburger } from "react-icons/fa";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

const GeneralPurposeMap = () => {
  const mapboxgl = useMapboxGl();
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/khvngkharl/cm1zcijt5005t01nt7dtt7qqe",
      center: [GH_GEOLOCATION.longitude, GH_GEOLOCATION.latitude],
      minZoom: 5.9,
      zoom: 6
    });

    mapRef.current.addControl(new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: 'Search for places',
      country: 'GH',
      limit: 10,
    }));
    mapRef.current.addControl(new mapboxgl.NavigationControl());
    mapRef.current.addControl(new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: 'metric'
    }));
    mapRef.current.addControl(new mapboxgl.FullscreenControl());
    mapRef.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserLocationControl: true,
      showAccuracyCircle: true,
      showCompass: true,
      showZoom: true,
    }));
    
    new mapboxgl.Marker({
      color: "#ffffff",
      draggable: true
    }).setLngLat([GH_GEOLOCATION.longitude, GH_GEOLOCATION.latitude]).addTo(mapRef.current);
    new mapboxgl.Popup({
      className: 'general-popup'
    }).setLngLat([GH_GEOLOCATION.longitude, 8.7])
    .setHTML("<h1>Hello world!</h1>").addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    }
  }, []);

  return (
    <div className="mapContainerLayout">
      <div className="w-1/2 map-info-section">
        <h1 className="underline font-semibold text-xl">General Purpose Map</h1>
        <div className="mt-2">
          <p className="text-sm text-gray-500 flex items-center"><FaHamburger className="me-2" /> Play around with the map!</p>
          <p>This map is an overview of the very basics of using maps with Mapbox GLJS.</p>
          <p className="mt-2">It does the barest of minimums, </p>
          <ul className="list-disc ms-4">
            <li>Renders a Mapbox map using a custom style</li>
            <li>Incorporates every additional control offered by Mapbox</li>
          </ul>
        </div>
      </div>
      <div className="w-1/2 map-container" ref={mapContainerRef}></div>
    </div>
  )
}

export default GeneralPurposeMap
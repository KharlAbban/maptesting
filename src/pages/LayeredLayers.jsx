import { useEffect, useRef } from "react";
import { useMapboxGl } from "../contexts/GlobalMapContext";
import { GH_GEOLOCATION } from "../utils/key_geocodes";
import { FaHamburger } from "react-icons/fa";
import RegionsGeoData from '../geoData/gh-regions.json'
import DistrictGeoData from "../geoData/District_272.json"

const LayeredLayers = () => {
  const mapboxgl = useMapboxGl();
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [GH_GEOLOCATION.longitude, GH_GEOLOCATION.latitude],
      minZoom: 5.9,
      zoom: 6,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl());
    mapRef.current.addControl(new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: 'metric',
    }));

    mapRef.current.on("load", () => {
        mapRef.current.addSource("ghana-regions-source", {
            type: "geojson",
            data: RegionsGeoData,
            generateId: true,
        });

        mapRef.current.addSource("ghana-districts-source", {
            type: "geojson",
            data: DistrictGeoData,
            generateId: true,
        });

        mapRef.current.addLayer({
            id: "ghana-regions-layer",
            type: "fill",
            source: "ghana-regions-source",
            paint: {
              "fill-color": "#34669b",
            //   "fill-opacity": 0.7
            },
          });
      
          mapRef.current.addLayer({
            id: "ghana-districts-layer",
            type: "fill",
            source: "ghana-districts-source",
            paint: {
              "fill-color": "#5692d7",
              "fill-opacity": 0.7
            },
          });

          mapRef.current.addLayer({
            id: "ghana-districts-layer-border",
            type: "line",
            source: "ghana-districts-source",
            paint: {
              "line-color": "#FFFFFF",
              "line-width": 1,
              "line-opacity": 0.7
            },
          });
          mapRef.current.addLayer({
            id: "ghana-regions-layer-border",
            type: "line",
            source: "ghana-regions-source",
            paint: {
              "line-color": "#000000",
              "line-width": 1,
            },
          });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="mapContainerLayout">
      <div className="w-1/2 map-info-section">
        <h1 className="underline font-semibold text-xl">Mapbox Layered Layers Map</h1>
        <div className="mt-2">
          <p className="text-sm text-gray-500 flex items-center">
            <FaHamburger className="me-2" /> Play around with the map!
          </p>
          <p>See the layers stacked here</p>
        </div>
      </div>
      <div className="w-1/2 map-container" ref={mapContainerRef}></div>
    </div>
  );
};

export default LayeredLayers;

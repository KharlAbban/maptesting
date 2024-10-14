import { useEffect, useRef } from "react";
import { useMapboxGl } from "../contexts/GlobalMapContext";
import { GH_GEOLOCATION } from "../utils/key_geocodes";
import { FaHamburger } from "react-icons/fa";
import { Form } from "react-router-dom";
import RegionsGeoData from '../geoData/gh-regions.json'
import DistrictGeoData from "../geoData/District_272.json"

const MapboxLayersMap = () => {
  const mapboxgl = useMapboxGl();
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const customRegionsPopup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  useEffect(() => {
    if (mapRef.current) return;
    let hoveredFeatureId = null;

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

    // Add districts layer and set to show on zoom level > 8
    mapRef.current.on("zoom", () => {
      const zoomLevel = mapRef.current.getZoom();
    
      // Load the source slightly before zoom 8 to ensure smooth transition
      if (zoomLevel >= 7 && !mapRef.current.getSource('ghana-districts-source')) {
        mapRef.current.addSource('ghana-districts-source', {
          type: 'geojson',
          data: DistrictGeoData,
          generateId: true,
        });
      }

      // Add layer only when zoom > 8
      if (zoomLevel >= 7.5 && !mapRef.current.getLayer('ghana-districts-layer')) {
        mapRef.current.addLayer({
          id: 'ghana-districts-layer',
          type: 'fill',
          source: 'ghana-districts-source',
          paint: {
            "fill-color": [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              "#5692d7", // Color when hovered
              "#34669b" // Default color
            ],
          },
        });
        mapRef.current.addLayer({
          id: 'ghana-districts-layer-border',
          type: 'line',
          source: 'ghana-districts-source',
          paint: {
            'line-color': '#000000',
            'line-width': 1
          },
        });
      }

      // Optionally, remove layer if zoom drops below 8
      if (zoomLevel < 7.5 && mapRef.current.getLayer('ghana-districts-layer')) {
        mapRef.current.removeLayer('ghana-districts-layer');
        mapRef.current.removeLayer('ghana-districts-layer-border');
      }
    });

    // Hover handlers for Districts
    mapRef.current.on("mousemove", "ghana-districts-layer", (Event) => {
      if (Event.features.length < 1) return;

      mapRef.current.getCanvas().style.cursor = "pointer";

      // Reset the previous hover state
      if (hoveredFeatureId !== null) {
        mapRef.current.setFeatureState(
          { source: "ghana-districts-source", id: hoveredFeatureId },
          { hover: false }
        );
      }

      // Get the currently hovered feature ID
      hoveredFeatureId = Event.features[0].id;

      // Set the current feature to be hovered
      mapRef.current.setFeatureState(
        { source: "ghana-districts-source", id: hoveredFeatureId },
        { hover: true }
      );

      const districtName = Event.features[0].properties.District;
      const regionName = Event.features[0].properties.Region;
      customRegionsPopup.setLngLat(Event.lngLat).setHTML(`District: ${districtName} <br /> Region: ${regionName}`).addTo(mapRef.current);
    });

    mapRef.current.on("mouseleave", "ghana-districts-layer", () => {
      mapRef.current.getCanvas().style.cursor = "";
      
      // Reset the state for the hovered feature when leaving
      if (hoveredFeatureId !== null) {
        mapRef.current.setFeatureState(
          { source: "ghana-districts-source", id: hoveredFeatureId },
          { hover: false }
        );
      }
      
      customRegionsPopup.remove();
      hoveredFeatureId = null; // Reset the hovered feature ID
    });

    // Hover handlers for Regions
    mapRef.current.on("mousemove", "ghana-regions-layer", (Event) => {
      if (Event.features.length < 1) return;

      mapRef.current.getCanvas().style.cursor = "pointer";

      // Reset the previous hover state
      if (hoveredFeatureId !== null) {
        mapRef.current.setFeatureState(
          { source: "ghana-regions-source", id: hoveredFeatureId },
          { hover: false }
        );
      }

      // Get the currently hovered feature ID
      hoveredFeatureId = Event.features[0].id;

      // Set the current feature to be hovered
      mapRef.current.setFeatureState(
        { source: "ghana-regions-source", id: hoveredFeatureId },
        { hover: true }
      );

      const regionName = Event.features[0].properties.name;
      customRegionsPopup.setLngLat(Event.lngLat).setHTML(`${regionName} Region`).addTo(mapRef.current);
    });

    mapRef.current.on("mouseleave", "ghana-regions-layer", () => {
      mapRef.current.getCanvas().style.cursor = "";
      
      // Reset the state for the hovered feature when leaving
      if (hoveredFeatureId !== null) {
        mapRef.current.setFeatureState(
          { source: "ghana-regions-source", id: hoveredFeatureId },
          { hover: false }
        );
      }
      
      customRegionsPopup.remove();
      hoveredFeatureId = null; // Reset the hovered feature ID
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const addCustomLayer = () => {
    if (!mapRef.current) return;

    mapRef.current.addSource("ghana-regions-source", {
      type: "geojson",
      data: RegionsGeoData,
      generateId: true,
    });

    mapRef.current.addLayer({
      id: "ghana-regions-layer",
      type: "fill",
      source: "ghana-regions-source",
      maxzoom: 7.5,
      paint: {
        "fill-color": [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          "#5692d7", // Color when hovered
          "#34669b" // Default color
        ],
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
  };

  const changeCustomLayerColor = (Event) => {
    if (!mapRef.current || !mapRef.current.getLayer("ghana-regions-layer")) return;
    Event.preventDefault();

    const formData = new FormData(Event.target);
    const newColor = formData.get("color_picker");

    mapRef.current.setPaintProperty("ghana-regions-layer", "fill-color", newColor);
    mapRef.current.setPaintProperty("ghana-regions-layer", "fill-color", [
      'case',
      ['boolean', ['feature-state', 'hover'], false],
      "#5692d7", // Color when hovered
      newColor // Default color
    ],);
  };

  const layerLayers = () => {
    // Goal: Render 2 layers on top of each other
    // Note: Make the districts layer semi-transparent so the regions layer that show through it
  }

  return (
    <div className="mapContainerLayout">
      <div className="w-1/2 map-info-section">
        <h1 className="underline font-semibold text-xl">Mapbox Layers Map</h1>
        <div className="mt-2">
          <p className="text-sm text-gray-500 flex items-center">
            <FaHamburger className="me-2" /> Play around with the map!
          </p>
          <p>Learn and experiment with Layers and Sources in Mapbox GLJS. What happens here:</p>
          <ul className="list-disc ms-4">
            <li className="list-item">Add a layer from a custom source</li>
            <li className="list-item">Dynamically change layer color</li>
            <li className="list-item">Show layers at different zoom levels</li>
            <li className="list-item">Show layers based on state or props</li>
            <li className="list-item">Layer layers (😏) on top of each other</li>
          </ul>
          <div className="mt-2">
            <h2 className="font-bold text-xl underline my-1">Let's begin</h2>
            <article className="article">
              <header className="font-semibold">Layer with custom source</header>
              <p>
                Click to add a new layer to the map. The custom layer contains polygons of the regions of Ghana. It'll take a while. Be patient!
              </p>
              <button onClick={addCustomLayer} className="bg-blue-400 py-1 px-2 mt-1 ms-2 rounded hover:bg-blue-500 duration-100 ease-linear">Add new layer</button>
              <article className="sub-article">
                <header className="font-semibold">Change color for layer</header>
                <p>
                  Use the color picker below to select a new color, then click the button to change the color of the layer. <br />
                  You must first add the layer using the <code className="map-code">Add new layer</code> button above.
                </p>
                <Form method="GET" onSubmit={changeCustomLayerColor} className="flex items-center gap-4 p-1 mt-2 rounded bg-gray-300 w-max">
                  <label htmlFor="color_picker" className="text-sm font-semibold">Select a color:</label>
                  <input type="color" name="color_picker" id="color_picker" required className="bg-white" />
                  <button className="bg-teal-400 py-1 px-2 mt-1 ms-2 rounded hover:bg-teal-500 duration-100 ease-linear">Change color</button>
                </Form>
              </article>
            </article>
            <article className="article">
              <header className="font-semibold">Zoom-based layer visibility</header>
              <p>
                Zoom in and out of the map to see different layers being applied based on the zoom level. <br />
                These layers are customisable and interactive. <br />
                <span className="flex items-center gap-2">Play around with them <FaHamburger className="text-green-500 hover:text-green-700 duration-100" /></span>
              </p>
            </article>
            <article className="article">
              <header className="font-semibold">Layered layers (😏) </header>
              <p>
                Layers on layers. <br />
                Here, we combine 2 layers, one on top of the other. The districts layer is put on top of the regions layer.
                Click the button below to see it in action!
              </p>
              <button onClick={layerLayers} className="bg-cyan-400 py-1 px-2 mt-1 ms-2 rounded hover:bg-cyan-500 duration-100 ease-linear">Layer layers!</button>
            </article>
          </div>
        </div>
      </div>
      <div className="w-1/2 map-container" ref={mapContainerRef}></div>
    </div>
  );
};

export default MapboxLayersMap;

import { useEffect, useRef } from "react";
import { useMapboxGl } from "../contexts/GlobalMapContext";
import { GH_GEOLOCATION } from "../utils/key_geocodes";
import { FaHamburger } from "react-icons/fa";
import DistrictsData from "../geoData/District_272.json"

const AdvancedInteractionsMap = () => {
  const mapboxgl = useMapboxGl();
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  let quakeId = null;
  let districtId = null;


  const addLayer = () => {
        if (!mapRef.current) return;
        const districtsLayer = mapRef.current.getLayer("districtsLayer");

        if (districtsLayer) alert("The sample layer has already been added!");
        
        mapRef.current.addLayer({
            id: "districtsLayer",
            type: "fill",
            source: "districtsGeoData",
            paint: {
                "fill-color": "#EEF1BD",
                "fill-opacity": [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    1, 0.7
                ],
            }
        });

        mapRef.current.on('mousemove', 'districtsLayer', (Event) => {
            if (Event.features.length < 1) return;
            
            if (districtId) {
                mapRef.current.removeFeatureState({
                    source: 'districtsGeoData',
                    id: districtId
                })
            }

            districtId = Event.features[0].id;

            mapRef.current.setFeatureState(
                {source: 'districtsGeoData', id: districtId},
                {hover: true}
            )
        });

        mapRef.current.on('mouseleave', 'districtsLayer', (Event) => {
            if (districtId) {
                mapRef.current.setFeatureState(
                    {source: 'districtsGeoData', id: districtId},
                    {hover: false}
                )
            }

            districtId = null;
        });
    }
const removeLayer = () => {
    if (!mapRef.current) return;
    const districtsLayer = mapRef.current.getLayer("districtsLayer");
    
    if (!districtsLayer) alert("The sample layer has already been removed!");

    mapRef.current.removeLayer("districtsLayer");
  }

const fadeLayerInOut = () => {
    if (!mapRef.current) return;
    const districtsLayer = mapRef.current.getLayer("districtsLayer");
    
    if (!districtsLayer) {
        mapRef.current.addLayer({
            id: "districtsLayer",
            type: "fill",
            source: "districtsGeoData",
            paint: {
                "fill-color": "#EEF1BD",
                "fill-opacity": 0.7,
                "fill-opacity-transition": {duration: 500}
            }
        });
    } else {
        const isHidden = mapRef.current.getPaintProperty("districtsLayer", "fill-opacity");
        mapRef.current.setPaintProperty('districtsLayer', 'fill-opacity-transition', {
            duration: 500,
        });

        if (isHidden == 0.7) {
            mapRef.current.setPaintProperty('districtsLayer', 'fill-opacity', 0);
        } else {
            mapRef.current.setPaintProperty('districtsLayer', 'fill-opacity', 0.7);
        }
    }

  }

  const changeMapStyle = (styleUrl, isCustom) => {
    if (!mapRef.current) return;

    if (isCustom) {
        mapRef.current.setStyle("mapbox://styles/khvngkharl/" + styleUrl);
    } else {
        mapRef.current.setStyle('mapbox://styles/mapbox/' + styleUrl);
    }
  }

  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/khvngkharl/cm1zcijt5005t01nt7dtt7qqe",
      center: [GH_GEOLOCATION.longitude, GH_GEOLOCATION.latitude],
      minZoom: 5.9,
      zoom: 6
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl());
    mapRef.current.addControl(new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: 'metric'
    }));

    mapRef.current.on('load', () => {
        mapRef.current.addSource('earthquakes', {
            type: 'geojson',
            data: 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&eventtype=earthquake&minmagnitude=1&starttime=2024-10-01T20:15:39.814Z',
            generateId: true
        });

        mapRef.current.addSource('districtsGeoData', {
          type: 'geojson',
          data: DistrictsData,
          generateId: true
        });

        mapRef.current.addLayer({
            id: 'earthquake-layer',
            type: 'circle',
            source: 'earthquakes',
            paint: {
                'circle-radius': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    [
                        'interpolate',
                        ['linear'],
                        ['get', 'mag'],
                        1,8,
                        1.5, 10,
                        2, 12,
                        2.5, 14,
                        3, 16,
                        3.5, 18,
                        4.5, 20,
                        6.5, 22,
                        8.5, 24,
                        10.5, 26
                    ],
                    5
                ],
                'circle-stroke-color': "#000",
                'circle-stroke-width': 1,
                'circle-color': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    [
                        'interpolate',
                        ['linear'],
                        ['get', 'mag'],
                        1, '#fff73c',
                        1.5, '#fee8c8',
                        2, '#fdd49e',
                        2.5, '#fdbb84',
                        3, '#fc8d59',
                        3.5, '#ef6548',
                        4.5, '#d7301f',
                        6.5, '#b30000',
                        8.5, '#7f0000',
                        10.5, '#000000',
                    ],
                    '#000'
                ]
            }
        });

        mapRef.current.on('mousemove', 'earthquake-layer', (Event) => {
            mapRef.current.getCanvas().style.cursor = 'pointer';

            if (Event.features.length === 0) return;

            if (quakeId) {
                mapRef.current.removeFeatureState({
                    source: 'earthquakes',
                    id: quakeId
                });
            }

            quakeId = Event.features[0].id;

            mapRef.current.setFeatureState({
                source: 'earthquakes',
                id: quakeId
            }, {
                hover: true
            });
        });

        mapRef.current.on('mouseleave', 'earthquake-layer', (Event) => {
            if (quakeId) {
                mapRef.current.setFeatureState({
                    source: 'earthquakes',
                    id: quakeId
                }, {
                    hover: false
                });
            }

            quakeId = null;

            mapRef.current.getCanvas().style.cursor = '';
        });
    });

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
        <h1 className="underline font-semibold text-xl">Advanced Map Interactions</h1>
        <div className="mt-2">
          <p className="text-sm text-gray-500 flex items-center"><FaHamburger className="me-2" /> Play around with the map!</p>
          <p className="mt-2">We move from the basics! See how to creatively interact with Mapbox maps here.</p>
          <div className="mt-2">
            <h2 className="font-bold text-xl underline my-1">Interactions</h2>
            <article className="article">
                <header className="font-semibold">Add a new layer</header>
                <p>
                    To add a new layer in Mapbox, you must first add a source, which is the geodata for the layer to be displayed.
                    See <a href="https://docs.mapbox.com/mapbox-gl-js/api/sources/" className="ext-link" target="_blank">docs</a> for more info.
                </p>
                <p>
                    Then you need to add a layers to the map, specifying the id of the source in the previous paragraph.
                </p>
                <button className="my-2 bg-teal-400 hover:bg-teal-600 duration-100 p-2 rounded" onClick={addLayer}>Click to add sample layer</button>
            </article>
            <article className="article">
                <header className="font-semibold">Remove a new layer</header>
                <p>
                    Simply set an event listener on any DOM element. Then in the function execution, call 
                    <code className="map-code">map.removeLayer('layerName')</code>
                    to remove the layer.
                </p>
                <button className="my-2 bg-red-400 hover:bg-red-600 duration-100 p-2 rounded" onClick={removeLayer}>Click to remove sample layer</button>
            </article>
            <article className="article">
                <header className="font-semibold">Fade layer in and out</header>
                <p>
                    Simply set an event listener on any DOM element. Then in the function execution, call 
                    <code className="map-code">map.removeLayer('layerName')</code>
                    to remove the layer.
                </p>
                <button className="my-2 bg-blue-400 hover:bg-blue-600 duration-100 p-2 rounded" onClick={fadeLayerInOut}>Fade sample layer in and out</button>
            </article>
            <article className="article">
                <header className="font-semibold">Change map style</header>
                <p>
                    Simply set an event listener on any DOM element. Then in the function execution, call 
                    <code className="map-code">map.setStyle('mapbox://styles/mapbox/styleId')</code>
                    to change the map style.
                </p>
                <div className="flex items-center gap-3">
                    <button className="mb-2 mt-4 bg-teal-300 hover:bg-teal-500 text-sm font-semibold px-2 py-1 duration-100 rounded" onClick={() => changeMapStyle("standard")}>Standard view</button>
                    <button className="mb-2 mt-4 bg-teal-300 hover:bg-teal-500 text-sm font-semibold px-2 py-1 duration-100 rounded" onClick={() => changeMapStyle("satellite-streets-v12")}>Satellite view</button>
                    <button className="mb-2 mt-4 bg-teal-300 hover:bg-teal-500 text-sm font-semibold px-2 py-1 duration-100 rounded" onClick={() => changeMapStyle("streets-v12")}>Street view</button>
                    <button className="mb-2 mt-4 bg-teal-300 hover:bg-teal-500 text-sm font-semibold px-2 py-1 duration-100 rounded" onClick={() => changeMapStyle("light-v11")}>Light view</button>
                    <button className="mb-2 mt-4 bg-teal-300 hover:bg-teal-500 text-sm font-semibold px-2 py-1 duration-100 rounded" onClick={() => changeMapStyle("dark-v11")}>Dark view</button>
                    <button className="mb-2 mt-4 bg-teal-300 hover:bg-teal-500 text-sm font-semibold px-2 py-1 duration-100 rounded" onClick={() => changeMapStyle("outdoors-v12")}>Outdoors view</button>
                    <button className="mb-2 mt-4 bg-red-300 hover:bg-red-500 text-sm font-semibold px-2 py-1 duration-100 rounded" onClick={() => changeMapStyle("cm1zcijt5005t01nt7dtt7qqe", true)}>Reset</button>
                </div>
            </article>
            <article className="article">
                <header className="font-semibold">Style features in a layer on hover</header>
                <p>
                    To do this, you'll need to make sure that every feature in your geojson data source has a unique ID.
                    Then in defining the paint property for the layer using the source, you use expressions to set the color, 
                    or stroke, or size, etc based on a <code className="map-code">feature-state</code>
                    You will then apply event listeners to the map, eg mousemove and mouselaeve which will set the feature-state of the specific features.
                </p>
                <p className="my-1 text-fuchsia-600">✨ There's a hidden feature on this page that allows you to check it out ✨</p>
                <p>Find more on info on this <a href="https://docs.mapbox.com/help/tutorials/create-interactive-hover-effects-with-mapbox-gl-js/" target="_blank" className="ext-link">here</a></p>
            </article>
          </div>
        </div>
      </div>
      <div className="w-1/2 map-container" ref={mapContainerRef}></div>
    </div>
  )
}

export default AdvancedInteractionsMap
import { createContext, useContext } from "react"
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"

const MapboxContext = createContext(null);

export const useMapboxGl = () => {
    const mapboxGlContext = useContext(MapboxContext);
    if (mapboxGlContext == null) throw new Error("MapboxContext must be used within a GlobalMapContext Provider!");
    return mapboxGlContext;
}

const GlobalMapContext = ({children}) => {
    const mapboxglAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    mapboxgl.accessToken = mapboxglAccessToken;

    if (!mapboxgl.supported()) {
      alert("Mapbox is not supported on your browser! Sorry!");
    }

  return (
    <MapboxContext.Provider value={mapboxgl}>
        {children}
    </MapboxContext.Provider>
  )
}

export default GlobalMapContext
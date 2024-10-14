import { useEffect, useRef } from "react";
import { useMapboxGl } from "../contexts/GlobalMapContext";
import { GH_GEOLOCATION } from "../utils/key_geocodes";
import { FaHamburger } from "react-icons/fa";

const BasicInteractionsMap = () => {
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

    mapRef.current.addControl(new mapboxgl.NavigationControl());
    mapRef.current.addControl(new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: 'metric'
    }));

    // Map Interaction Handlers
    mapRef.current.on("mousedown", (e) => {
      console.log("Mousedown interaction occurred!");
    });
    mapRef.current.on("mouseup", (e) => {
      console.log("Mouseup interaction occurred!");
    });
    mapRef.current.on("mouseover", (e) => {
      console.log("Mouseover interaction occurred!");
    });
    mapRef.current.on("click", (e) => {
      console.log("Clicked at:", e.lngLat);
    });
    mapRef.current.on("dblclick", (e) => {
      console.log("Double clicked at:", e.lngLat);
    });
    mapRef.current.on("wheel", (e) => {
      console.log("A wheel interaction occurred!");
    });

    // Map Event Handlers
    mapRef.current.on("resize", (e) => {
      console.log("Map has been resized!");
    });
    mapRef.current.on("idle", (e) => {
      console.log("An idle event occurred!");
    });
    mapRef.current.on("remove", (e) => {
      console.log("The map has been removed!");
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
        <h1 className="underline font-semibold text-xl">Basic User Interactions Map</h1>
        <div className="mt-2">
          <p className="text-sm text-gray-500 flex items-center"><FaHamburger className="me-2" /> Play around with the map!</p>
          <p className="mt-2">This map focuses on helping you understand how common basic user interactions with the map work. See the sections below for more info.</p>
          <h2 className="font-bold my-3 flex items-center">Note: <FaHamburger className="mx-2 text-red-600" size={25} /> Open the console to view the results!!</h2>
          <div className="flex gap-2">
            <div className="flex-1">
              <h4 className="my-2 font-semibold underline text-xl">Interactions</h4>
              <article className="article-hover">
                <header>Mouseover</header>
              </article>
              <article className="article-hover">
                <header>Mousedown</header>
              </article>
              <article className="article-hover">
                <header>Mouseup</header>
              </article>
              <article className="article-hover">
                <header>Click</header>
              </article>
              <article className="article-hover">
                <header>Double click</header>
              </article>
              <article className="article-hover">
                <header>Wheel</header>
              </article>
            </div>
            <div className="flex-1">
              <h4 className="my-2 font-semibold underline text-xl">Events</h4>
              <article className="article-hover">
                <header>Resize</header>
              </article>
              <article className="article-hover">
                <header>Idle</header>
              </article>
              <article className="article-hover">
                <header>remove</header>
              </article>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/2 map-container" ref={mapContainerRef}></div>
    </div>
  )
}

export default BasicInteractionsMap
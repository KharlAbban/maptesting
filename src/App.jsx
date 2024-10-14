import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { AdvancedInteractionsMap, AppLayout, BasicInteractionsMap, GeneralPurposeMap, LandingPage, MapboxLayersMap } from "./pages";

const mapRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />
      },
      {
        path: "/general-map",
        element: <GeneralPurposeMap />
      },
      {
        path: "/basic-interactions-map",
        element: <BasicInteractionsMap />
      },
      {
        path: "/advanced-interactions-map",
        element: <AdvancedInteractionsMap />
      },
      {
        path: "/mapbox-layers-map",
        element: <MapboxLayersMap />
      },
    ]
  },
]);

const App = () => {
  return <RouterProvider router={mapRouter} />
}

export default App
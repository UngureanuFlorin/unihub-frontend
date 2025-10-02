import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Event from "../pages/Event.jsx";
import EventDetail from "../pages/EventDetail.jsx";
import SubmitEvent from "../pages/SubmitEvent.jsx";
import Profile from "../pages/Profile.jsx";
import Home from "../pages/Home.jsx";

const router = createBrowserRouter([
    { path: "/login", element: <Login /> },
    { path: "/events", element: <Event /> },
    { path: "/home", element: <Home /> },
    { path: "/create/event", element: <SubmitEvent /> },
    { path: "/events/:id", element: <EventDetail /> },
    { path: "/profile", element: <Profile /> },
    { path: "*", element: <Navigate to="/login" replace /> },
]);

function AppRouter() {
    return <RouterProvider router={router} />;
}

export default AppRouter;

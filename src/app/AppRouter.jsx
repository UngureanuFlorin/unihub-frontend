import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Spin } from "antd";

import Login from "../pages/AuthPage.jsx";
import Home from "../pages/Home.jsx";
import Event from "../pages/Event.jsx";
import EventDetail from "../pages/EventDetail.jsx";
import SubmitEvent from "../pages/SubmitEvent.jsx";
import Profile from "../pages/Profile.jsx";

import PublicRoute from "../layout/PublicRoute.jsx";
import useAuth from "../hooks/useAuth.js";
import Club from "../pages/Club.jsx";
import People from "../pages/People.jsx";
import UserProfile from "../pages/UserProfile.jsx";
import ClubDetail from "../pages/ClubDetail.jsx";
import UniversitaList from "../pages/UniversitaList.jsx";
import AppLayout from "../layout/AppLayout.jsx";
import ProtectedRoute from "../layout/ProtectedRoute.jsx";
import Inbox from "../pages/Inbox.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import ModerationQueue from "../pages/ModerationQueue.jsx";
import EmailHistory from "../pages/EmailHistory.jsx";
import Feed from "../pages/Feed.jsx";
import Lessons from "../pages/Lessons.jsx";

function RouteWithAuth({ children, protect = false }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div
                style={{
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Spin size="large" tip="Caricamento..." />
            </div>
        );
    }

    if (protect && !user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

const router = createBrowserRouter([
    {
        path: "/login",
        element: (
            <PublicRoute>
                <Login />
            </PublicRoute>
        ),
    },
    {
        path: "/forgot-password",
        element: (
            <PublicRoute>
                <ForgotPassword />
            </PublicRoute>
        ),
    },
    {
        path: "/",
        element: <AppLayout />,
        children: [
            { index: true, element: <Navigate to="/home" replace /> },
            {
                path: "home",
                element: (
                    <RouteWithAuth>
                        <Home />
                    </RouteWithAuth>
                ),
            },
            {
                path: "feed",
                element: (
                    <RouteWithAuth protect>
                        <Feed />
                    </RouteWithAuth>
                ),
            },
            {
                path: "lessons",
                element: (
                    <RouteWithAuth protect>
                        <Lessons />
                    </RouteWithAuth>
                ),
            },
            {
                path: "events",
                element: (
                    <RouteWithAuth>
                        <Event />
                    </RouteWithAuth>
                ),
            },
            {
                path: "messages",
                element: (
                    <RouteWithAuth>
                        <Inbox />
                    </RouteWithAuth>
                ),
            },
            {
                path: "clubs",
                element: (
                    <RouteWithAuth>
                        <Club />
                    </RouteWithAuth>
                ),
            },
            {
                path: "events/:id",
                element: (
                    <RouteWithAuth protect>
                        <EventDetail />
                    </RouteWithAuth>
                ),
            },
            {
                path: "clubs/:id",
                element: (
                    <RouteWithAuth protect>
                        <ClubDetail />
                    </RouteWithAuth>
                ),
            },
            {
                path: "create/event",
                element: (
                    <RouteWithAuth protect>
                        <SubmitEvent />
                    </RouteWithAuth>
                ),
            },
            {
                path: "profile",
                element: (
                    <RouteWithAuth protect>
                        <Profile />
                    </RouteWithAuth>
                ),
            },
            {
                path: "users",
                element: (
                    <RouteWithAuth protect>
                        <People />
                    </RouteWithAuth>
                ),
            },
            {
                path: "users/:id",
                element: (
                    <RouteWithAuth protect>
                        <UserProfile />
                    </RouteWithAuth>
                ),
            },
            {
                path: "universita",
                element: (
                    <RouteWithAuth protect>
                        <UniversitaList />
                    </RouteWithAuth>
                ),
            },
            {
                path: "moderation/queue",
                element: (
                    <RouteWithAuth protect>
                        <ProtectedRoute allow={["ADMIN"]}>
                            <ModerationQueue />
                        </ProtectedRoute>
                    </RouteWithAuth>
                ),
            },
            {
                path: "moderation/emails",
                element: (
                    <RouteWithAuth protect>
                            <ProtectedRoute allow={["ADMIN"]}>
                            <EmailHistory />
                        </ProtectedRoute>
                    </RouteWithAuth>
                ),
            },
        ],
    },
    { path: "*", element: <Navigate to="/home" replace /> },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}

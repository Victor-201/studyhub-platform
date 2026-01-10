import { BrowserRouter, Routes, Route } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";

import Home from "../pages/user/Home";
import DocumentDetail from "../pages/user/DocumentDetail";
import Group from "../pages/user/Group";
import GroupDetail from "../pages/user/GroupDetail";
import Profile from "../pages/user/Profile";
import Follow from "../pages/user/Follow";
import Message from "../pages/user/Message";

import Dashboard from "../pages/admin/Dashboard";
import UsersAdmin from "../pages/admin/UsersAdmin";
import DocumentsAdmin from "../pages/admin/DocumentsAdmin";
import GroupsAdmin from "../pages/admin/GroupsAdmin";
import CommentsAdmin from "../pages/admin/CommentsAdmin"; 

import Forbidden from "../pages/error/Forbidden";
import NotFound from "../pages/error/NotFound";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC AUTH ROUTES */}
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthLayout />
            </PublicRoute>
          }
        >
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="verify-email" element={<VerifyEmail />} />
        </Route>

        {/* MAIN LAYOUT */}
        <Route element={<MainLayout />}>
          {/* PUBLIC HOME */}
          <Route
            index
            element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            }
          />
          <Route
            path="documents/:document_id"
            element={
              <PrivateRoute roles={["user", "admin"]}>
                <DocumentDetail />
              </PrivateRoute>
            }
          />

          {/* PRIVATE USER ROUTES */}
          <Route
            path="profile/:user_id"
            element={
              <PrivateRoute roles={["user", "admin"]}>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="group"
            element={
              <PrivateRoute roles={["user", "admin"]}>
                <Group />
              </PrivateRoute>
            }
          />
          <Route
            path="group/:group_id"
            element={
              <PrivateRoute roles={["user", "admin"]}>
                <GroupDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="follow"
            element={
              <PrivateRoute roles={["user", "admin"]}>
                <Follow />
              </PrivateRoute>
            }
          />
          <Route
            path="message"
            element={
              <PrivateRoute roles={["user", "admin"]}>
                <Message />
              </PrivateRoute>
            }
          />

          {/* PRIVATE ADMIN ROUTES */}
          <Route
            path="admin/dashboard"
            element={
              <PrivateRoute roles={["admin"]}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/users"
            element={
              <PrivateRoute roles={["admin"]}>
                <UsersAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/documents"
            element={
              <PrivateRoute roles={["admin"]}>
                <DocumentsAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/groups"
            element={
              <PrivateRoute roles={["admin"]}>
                <GroupsAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/comments"
            element={
              <PrivateRoute roles={["admin"]}>
                <CommentsAdmin />
              </PrivateRoute>
            }
          />
        </Route>

        {/* ERROR ROUTES */}
        <Route path="/error/forbidden" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

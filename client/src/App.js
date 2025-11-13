// import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AddCrop from "./pages/Farmer/AddCropForm";
import ProtectedRoute from "./components/ProtectedRoute";
import FarmerDashboard from "./pages/FarmerDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import WishList from "./pages/WishList";
import Home from "./pages/Home";
import MyCrops from "./pages/MyCrops";
import EditCropForm from "./pages/EditCropForm";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import SearchCrops from "./pages/SearchCrops";
import EditProfile from "./pages/EditProfile";
import CreateRequest from "./pages/CreateRequest";
import RequestSearch from "./pages/RequestSearch";
import MyRequests from "./pages/MyRequests";
import EditRequest from "./pages/EditRequest";
import NotificationsPage from "./pages/Notifications";
import FarmerWishlist from "./pages/FarmerWishlist";



function App() 
{
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/edit" element={<ProtectedRoute allowedRoles={['customer','farmer']}><EditProfile /></ProtectedRoute>} />
        <Route path="/farmer/dashboard"element={<ProtectedRoute allowedRoles={['farmer']}><FarmerDashboard /></ProtectedRoute>}/>
        <Route path="/farmer/add-crop" element={<AddCrop />} />
        <Route path="/farmer/my-crops" element={<MyCrops />} />
        <Route path="/farmer/edit/:id" element={<EditCropForm />} />
        <Route path="/farmer/requests" element={<ProtectedRoute allowedRoles={['farmer']}><RequestSearch /></ProtectedRoute>} />
        <Route path="/farmer/wishlist" element={<FarmerWishlist />} />
        <Route path="/customer/dashboard"element={<ProtectedRoute allowedRoles={['customer']}><CustomerDashboard /></ProtectedRoute>}/>
        <Route path="/customer/search"element={<ProtectedRoute allowedRoles={['customer']}><SearchCrops /></ProtectedRoute>}/>       
        <Route path="/customer/wishlist" element={<WishList/>} />
        <Route path="/customer/create-request" element={<ProtectedRoute allowedRoles={['customer']}><CreateRequest /></ProtectedRoute>} />
        <Route path="/customer/requests" element={<MyRequests />} />
        <Route path="/customer/requests/edit/:id" element={<EditRequest />} />
        <Route path="/notifications" element={<NotificationsPage />} />

      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ShopDetails from "./pages/ShopDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import SellerDashboard from "./pages/SellerDashboard";
import Navbar from "./components/Navbar";
import MyShops from "./pages/MyShops";
import AddShop from "./pages/AddShop";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50/50 flex flex-col">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/shop/:shopId" element={<ShopDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/dashboard" element={<SellerDashboard />} />
            <Route path="/my-shops" element={<MyShops />} />
            <Route path="/add-shop" element={<AddShop />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
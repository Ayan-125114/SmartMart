import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ShoppingCart, ClipboardList, LayoutDashboard, Store, LogOut, LogIn, UserPlus, ShoppingBag } from "lucide-react";

function Navbar() {
  const { token, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-xs">
      <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-blue-600 hover:text-blue-700 transition">
        <ShoppingBag className="w-8 h-8 stroke-[2.5]" />
        <span>Smart<span className="text-gray-900">Mart</span></span>
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition flex items-center gap-1.5">
          Home
        </Link>

        {token ? (
          <>
            <Link to="/cart" className="text-gray-600 hover:text-blue-600 font-medium transition flex items-center gap-1.5">
              <ShoppingCart className="w-4.5 h-4.5" />
              <span>Cart</span>
            </Link>

            <Link to="/orders" className="text-gray-600 hover:text-blue-600 font-medium transition flex items-center gap-1.5">
              <ClipboardList className="w-4.5 h-4.5" />
              <span>Orders</span>
            </Link>

            {user?.role === "seller" && (
              <>
                <Link to="/my-shops" className="text-gray-600 hover:text-blue-600 font-medium transition flex items-center gap-1.5">
                  <Store className="w-4.5 h-4.5" />
                  <span>My Shops</span>
                </Link>

                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition flex items-center gap-1.5">
                  <LayoutDashboard className="w-4.5 h-4.5" />
                  <span>Dashboard</span>
                </Link>
              </>
            )}

            <div className="h-6 w-[1px] bg-gray-200"></div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-gray-600 hover:text-blue-600 font-semibold text-sm px-4 py-2 transition flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-1.5 shadow-sm shadow-blue-200 hover:shadow-lg hover:shadow-blue-300"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
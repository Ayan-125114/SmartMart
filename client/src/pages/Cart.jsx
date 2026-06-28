import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, ArrowRight, ShoppingCart } from "lucide-react";

function Cart() {
  const { token } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  const loadCart = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems(res.data);
    } catch (err) {
      console.error("Failed to load cart", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [token]);

  const updateQuantity = async (productId, delta) => {
    try {
      await api.post(
        "/cart",
        {
          productId,
          quantity: delta,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Reload cart to get updated quantities
      await loadCart();
    } catch (err) {
      console.error("Failed to update quantity", err);
      alert("Failed to update item quantity.");
    }
  };

  const removeItem = async (item) => {
    // Send negative of current quantity to delete it completely
    await updateQuantity(item.product._id, -item.quantity);
  };

  const placeOrder = async () => {
    if (items.length === 0) return;
    setCheckingOut(true);
    try {
      await api.post(
        "/orders",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error("Order placement failed", err);
      alert(err.response?.data?.message || "Failed to place order.");
    } finally {
      setCheckingOut(false);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="animate-spin border-4 border-blue-600 border-t-transparent rounded-full w-8 h-8"></span>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-gray-100 p-8 text-center space-y-4 shadow-sm">
        <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500">Please sign in to view and add items to your cart.</p>
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer"
        >
          <span>Sign In</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center text-gray-500 space-y-4 shadow-sm max-w-xl mx-auto">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
          <p className="text-lg font-medium">Your cart is empty.</p>
          <p className="text-sm text-gray-400">Browse nearby stores and start adding some products!</p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer"
          >
            <span>Explore Stores</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {item.product?.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-xl bg-slate-50 shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-slate-50 rounded-xl flex items-center justify-center text-gray-300 shrink-0">
                      <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{item.product?.name || "Product"}</h3>
                    <p className="text-sm text-gray-500 capitalize">{item.product?.category}</p>
                    <p className="text-base font-extrabold text-blue-600 mt-1">₹{item.product?.price}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                  <div className="flex items-center border border-gray-200 rounded-xl bg-slate-50/50 p-1">
                    <button
                      onClick={() => updateQuantity(item.product._id, -1)}
                      className="p-2 hover:bg-white text-gray-500 rounded-lg hover:text-gray-900 transition cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-bold text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product._id, 1)}
                      className="p-2 hover:bg-white text-gray-500 rounded-lg hover:text-gray-900 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item)}
                    className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary Card */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm h-fit space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
            
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-600 font-semibold">Free Delivery</span>
              </div>
              <div className="h-[1px] bg-gray-100 my-2"></div>
              <div className="flex justify-between text-base text-gray-950 font-bold">
                <span>Total Amount</span>
                <span className="text-blue-600 text-xl font-black">₹{subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              disabled={checkingOut}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3.5 px-4 rounded-xl transition shadow-md shadow-blue-100 flex items-center justify-center gap-2 cursor-pointer"
            >
              {checkingOut ? (
                <span className="inline-block animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Place Order</span>
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              By placing your order, you agree to our Terms of Use and Privacy Policy.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
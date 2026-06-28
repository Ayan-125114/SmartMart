import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { ShoppingCart, Plus, FileText, Tag, DollarSign, Package, Upload, MapPin, Store, Navigation } from "lucide-react";

function ShopDetails() {
  const { shopId } = useParams();
  const { token, user } = useContext(AuthContext);
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingProduct, setAddingProduct] = useState(false);
  
  // Product form state
  const [prodName, setProdName] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodCategory, setProdCategory] = useState("");
  const [prodStock, setProdStock] = useState("");
  const [prodImageFile, setProdImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const isOwner = shop && user && shop.owner === user._id;

  useEffect(() => {
    const fetchShopAndProducts = async () => {
      setLoading(true);
      try {
        // Fetch shop details
        const shopRes = await api.get(`/shops/${shopId}`);
        setShop(shopRes.data);

        // Fetch products in shop
        const prodRes = await api.get(`/products/shop/${shopId}`);
        setProducts(prodRes.data);
      } catch (err) {
        console.error("Failed to load shop details or products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShopAndProducts();
  }, [shopId]);

  const addToCart = async (productId) => {
    if (!token) {
      alert("Please login to add items to your cart.");
      return;
    }

    try {
      await api.post(
        "/cart",
        {
          productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Product added to cart!");
    } catch (err) {
      console.error(err);
      alert("Failed to add product to cart.");
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!prodName || !prodPrice) {
      setFormError("Product name and price are required.");
      return;
    }

    setUploadingImage(true);
    let imageUrl = "";

    try {
      // 1. Upload image if selected
      if (prodImageFile) {
        const formData = new FormData();
        formData.append("image", prodImageFile);

        const uploadRes = await api.post("/upload/product-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        imageUrl = uploadRes.data.imageUrl;
      }

      // 2. Create product
      const productRes = await api.post(
        "/products",
        {
          name: prodName,
          description: prodDesc,
          price: parseFloat(prodPrice),
          category: prodCategory,
          stock: parseInt(prodStock) || 0,
          image: imageUrl,
          shopId: shopId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Append new product to list and reset form
      setProducts([...products, productRes.data]);
      setProdName("");
      setProdDesc("");
      setProdPrice("");
      setProdCategory("");
      setProdStock("");
      setProdImageFile(null);
      setAddingProduct(false);
      setFormSuccess("Product added successfully!");
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to add product");
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="animate-spin border-4 border-blue-600 border-t-transparent rounded-full w-8 h-8"></span>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100 max-w-xl mx-auto my-10">
        Shop not found or failed to load shop details.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Shop Info Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Store className="w-3.5 h-3.5" />
              <span>Verified Store</span>
            </span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{shop.shopName}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-gray-500 flex items-start gap-1.5 text-sm md:text-base">
              <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <span>{shop.address}</span>
            </p>
            {shop.location?.coordinates && (
              <button
                onClick={() => {
                  const [lng, lat] = shop.location.coordinates;
                  window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
                }}
                className="text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition"
                title="Open location in Google Maps"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Track on Map</span>
              </button>
            )}
          </div>
        </div>

        {isOwner && (
          <button
            onClick={() => setAddingProduct(!addingProduct)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl transition shadow-md shadow-blue-100 flex items-center justify-center gap-2 cursor-pointer md:self-end"
          >
            <Plus className="w-5 h-5" />
            <span>{addingProduct ? "Close Form" : "Add Product"}</span>
          </button>
        )}
      </div>

      {/* Add Product Form */}
      {addingProduct && isOwner && (
        <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h2>
          
          {formError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 border border-red-100">
              {formError}
            </div>
          )}

          <form onSubmit={handleProductSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Store className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic Red Apples"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (INR)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <DollarSign className="w-5 h-5" />
                  </span>
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="e.g. 120.00"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Tag className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Fruits"
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock Quantity</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Package className="w-5 h-5" />
                  </span>
                  <input
                    type="number"
                    placeholder="e.g. 50"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-gray-900"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 pt-3.5 items-start pointer-events-none text-gray-400">
                  <FileText className="w-5 h-5" />
                </span>
                <textarea
                  rows="3"
                  placeholder="Tell customers about your product..."
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-gray-900"
                ></textarea>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Image</label>
              <div className="border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-2xl p-6 text-center cursor-pointer transition relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProdImageFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                {prodImageFile ? (
                  <p className="text-sm font-semibold text-blue-600">{prodImageFile.name}</p>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 font-medium">Click to upload or drag & drop</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={uploadingImage}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {uploadingImage ? (
                <>
                  <span className="inline-block animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                  <span>Uploading Image & Creating Product...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Create Product</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Products list */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>

        {products.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center text-gray-500 space-y-3 shadow-sm">
            <Package className="w-12 h-12 text-gray-300 mx-auto" />
            <p className="text-lg font-medium">No products listed in this store yet.</p>
            {isOwner && <p className="text-sm text-gray-400">Click the "Add Product" button above to list your first item.</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-gray-100 hover:border-gray-200 rounded-3xl p-5 transition shadow-sm hover:shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-2xl bg-slate-50"
                    />
                  ) : (
                    <div className="w-full h-48 bg-slate-50 rounded-2xl flex items-center justify-center text-gray-300">
                      <Package className="w-12 h-12 stroke-[1.5]" />
                    </div>
                  )}
                  
                  <div>
                    {product.category && (
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {product.category}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-gray-900 mt-2">{product.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                    <p className="text-xs text-gray-400 mt-2 font-medium">Stock: {product.stock > 0 ? `${product.stock} units` : "Out of stock"}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-2xl font-black text-gray-900">₹{product.price}</span>
                  {!isOwner && (
                    <button
                      onClick={() => addToCart(product._id)}
                      disabled={product.stock <= 0}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm hover:shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShopDetails;
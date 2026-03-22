import React, { useState, useEffect, useRef, useCallback } from "react";
import ProductCardAdmin from "./ProductCardAdmin";
import {
  Loader2,
  Plus,
  PackageOpen,
  X,
  PackagePlus,
  Upload,
  Image as ImageIcon,
  AlertCircle as AlertIcon
} from "lucide-react";
import api from "../../store/api";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

export default function ProductListAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollLoading, setScrollLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ code: "", name: "", tags: "", price: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const observer = useRef();
  const scrollContainerRef = useRef(null);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  const loadProducts = async (cursor = null) => {
    try {
      if (cursor) setScrollLoading(true);
      else setLoading(true);

      const response = await api.get("products/admin", { params: { cursor } });
      const data = response.data?.products ?? [];
      const more = response.data?.hasMore ?? false;

      const validProducts = data
        .filter(item => item && item._id && item.name)
        .map(item => ({
          ...item,
          tags: item.tags ?? [],
          image_url: item.image_url ?? "",
          archived: item.archived ?? false, // rely on backend
        }));

      if (cursor) {
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p._id));
          const newProducts = validProducts.filter(p => !existingIds.has(p._id));
          return [...prev, ...newProducts];
        });
      } else {
        setProducts(validProducts);
      }

      setNextCursor(validProducts.length > 0 ? validProducts[validProducts.length - 1]._id : null);
      setHasMore(more);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("The archive could not be reached at this time.");
      setHasMore(false);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
      setScrollLoading(false);
    }
  };

  const lastProductRef = useCallback(
    node => {
      if (scrollLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasMore && !scrollLoading) {
            loadProducts(nextCursor);
          }
        },
        { root: scrollContainerRef.current, threshold: 0.1 }
      );

      if (node) observer.current.observe(node);
    },
    [scrollLoading, hasMore, nextCursor]
  );

  const handleDelete = async (_id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to remove this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`products/admin/${_id}`);
      setProducts(prev => prev.filter(p => p._id !== _id));
      toast.success("Product deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      Swal.fire("Failed", "Action failed. Please try again.", "error");
    }
  };

  // Archive handler – relies fully on backend to persist status
  const handleArchive = async (_id) => {
    const product = products.find(p => p._id === _id);
    if (!product) return;

    const newStatus = !product.archived;

    // Optimistic update
    setProducts(prev =>
      prev.map(p => (p._id === _id ? { ...p, archived: newStatus } : p))
    );

    try {
      await api.put(`products/admin/${_id}/archive`, { archived: newStatus });
      toast.success(`Product ${newStatus ? "archived" : "unarchived"}`);
    } catch (err) {
      console.error("Archive failed:", err);
      Swal.fire("Failed", "Status update failed.", "error");
      // Revert on failure
      setProducts(prev =>
        prev.map(p => (p._id === _id ? { ...p, archived: product.archived } : p))
      );
    }
  };

  // Modal handlers
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => payload.append(key, formData[key]));
      if (file) payload.append("image", file);

      await api.post("/products", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product created successfully!");
      setFormData({ code: "", name: "", tags: "", price: "" });
      setFile(null);
      setPreview(null);

      loadProducts();
      setTimeout(() => setIsModalOpen(false), 1000);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.message || "Failed to create product", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const inputStyle = "w-full border border-stone-200 bg-stone-50/50 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all";
  const labelStyle = "block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="bg-sky-50 h-[700px] p-4 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4 pb-8">
          <div>
            <h1 className="text-2xl font-serif text-sky-900">Inventory Manager</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mt-2 font-bold">
              {products?.length ?? 0} Products in Collection
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 transition-colors text-white px-8 py-4 text-[8px] font-bold uppercase tracking-[0.2em]"
          >
            <Plus size={14} /> New Product
          </button>
        </div>

        {/* Products Table */}
        {error ? (
          <div className="bg-red-50 border-l-2 border-red-400 p-4 flex items-center gap-4 text-red-800 italic">
            <AlertIcon size={20} /> {error}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 bg-white border border-dashed border-slate-200">
            <PackageOpen size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="font-serif italic text-slate-400">The archive is currently empty.</p>
          </div>
        ) : (
          <div ref={scrollContainerRef} className="bg-white overflow-y-auto max-h-[500px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="sticky top-0 bg-sky-50 border-b border-slate-200">
                  <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Product</th>
                  <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Tags</th>
                  <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Price</th>
                  <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Status</th>
                  <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold text-right">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product, index) => (
                  <ProductCardAdmin
                    key={product._id}
                    product={product}
                    onDelete={handleDelete}
                    onToggleArchive={handleArchive}
                    ref={index === products.length - 1 ? lastProductRef : null}
                  />
                ))}
              </tbody>
            </table>

            {scrollLoading && (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin text-sky-500" size={24} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 transition-all"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <PackagePlus size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-stone-800">New Product</h2>
                <p className="text-xs text-stone-500">Add a new item to your catalog</p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-5">
                <div>
                  <label className={labelStyle}>Product Code</label>
                  <input type="text" name="code" value={formData.code} onChange={handleChange} className={inputStyle} required />
                </div>
                <div>
                  <label className={labelStyle}>Product Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputStyle} required />
                </div>
                <div>
                  <label className={labelStyle}>Price (LKR)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} className={inputStyle} min="0" step="0.01" required />
                </div>
                <div>
                  <label className={labelStyle}>Tags</label>
                  <input type="text" name="tags" value={formData.tags} onChange={handleChange} className={inputStyle} />
                  <p className="mt-1.5 text-[10px] text-stone-400">Separate tags with commas</p>
                </div>
                <div className="pt-4 border-t border-stone-100">
                  <button type="submit" disabled={formLoading} className="w-full bg-blue-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
                    {formLoading ? <Loader2 size={18} className="animate-spin" /> : "Create Product"}
                  </button>
                </div>
              </div>

              {/* Right Column: Image */}
              <div className="flex flex-col">
                <label className={labelStyle}>Product Image</label>
                <div className="relative flex-1 min-h-[240px] group">
                  {!preview ? (
                    <div className="absolute inset-0 border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center bg-stone-50/50 group-hover:bg-stone-50 group-hover:border-blue-400 transition-all">
                      <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                      <div className="p-4 rounded-full bg-white shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="text-stone-400 group-hover:text-blue-500" size={24} />
                      </div>
                      <p className="text-sm font-medium text-stone-600">Click to upload</p>
                      <p className="text-xs text-stone-400 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  ) : (
                    <div className="absolute inset-0 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100">
                      <img src={preview} alt="Preview" className="w-full h-full object-fit p-5" />
                      <button type="button" onClick={() => { setFile(null); setPreview(null); }} className="absolute top-3 right-3 p-2 bg-white/90 text-red-500 rounded-full shadow-lg">
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  {!preview && <div className="mt-2 flex items-center gap-2 text-stone-400 italic text-[11px]"><ImageIcon size={12} /> No image selected</div>}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
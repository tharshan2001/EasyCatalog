import React, { useState, useEffect, useRef, useCallback } from "react";
import ProductCardAdmin from "./ProductCardAdmin";
import {
  Loader2,
  Plus,
  PackageOpen,
  X,
  Upload,
  Image as ImageIcon,
  AlertCircle as AlertIcon
} from "lucide-react";
import api from "../../store/api";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

export default function ProductListAdmin() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollLoading, setScrollLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ code: "", name: "", tags: "", price: "", category: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const observer = useRef();
  const scrollContainerRef = useRef(null);

  const loadCategories = async () => {
    try {
      const response = await api.get("categories");
      setCategories(response.data?.categories ?? []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
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
          archived: item.archived ?? false,
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
      setError("Failed to load products.");
      setHasMore(false);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
      setScrollLoading(false);
    }
  };

  const lastProductRef = useCallback(
    node => {
      if (!node || !hasMore) return;
      
      const obs = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasMore && !scrollLoading) {
            loadProducts(nextCursor);
          }
        },
        { rootMargin: "200px" }
      );

      obs.observe(node);
      return () => obs.disconnect();
    },
    [hasMore, nextCursor]
  );

  const handleDelete = async (_id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to remove this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0a66c2",
      cancelButtonColor: "#6b7280",
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

  const handleArchive = async (_id) => {
    const product = products.find(p => p._id === _id);
    if (!product) return;

    const newStatus = !product.archived;

    setProducts(prev =>
      prev.map(p => (p._id === _id ? { ...p, archived: newStatus } : p))
    );

    try {
      await api.put(`products/admin/${_id}/archive`, { archived: newStatus });
      toast.success(`Product ${newStatus ? "archived" : "unarchived"}`);
    } catch (err) {
      console.error("Archive failed:", err);
      Swal.fire("Failed", "Status update failed.", "error");
      setProducts(prev =>
        prev.map(p => (p._id === _id ? { ...p, archived: product.archived } : p))
      );
    }
  };

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
      setFormData({ code: "", name: "", tags: "", price: "", category: "" });
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

  const inputStyle = "w-full border border-[#E0E4EB] bg-white px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-[#4A90E2]/20 focus:border-[#4A90E2] text-sm transition-all";
  const labelStyle = "block text-xs font-semibold text-[#7F8C9D] uppercase tracking-wider mb-1.5";

  return (
    <div className="bg-[#F4F6FA] h-[700px] p-4 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4 pb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#2C3E50]">Inventory Manager</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#7F8C9D] mt-2 font-bold">
              {products?.length ?? 0} Products in Collection
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#4A90E2] hover:bg-[#357ABD] text-white px-8 py-4 text-[8px] font-bold uppercase tracking-[0.2em] transition-colors"
          >
            <Plus size={14} /> New Product
          </button>
        </div>

        {error ? (
          <div className="bg-red-50 border-l-2 border-[#E74C3C] p-4 flex items-center gap-4 text-[#E74C3C]">
            <AlertIcon size={20} /> {error}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 bg-white border border-dashed border-[#E0E4EB]">
            <PackageOpen size={48} className="mx-auto text-[#7F8C9D] mb-4" />
            <p className="font-medium text-[#7F8C9D]">The archive is currently empty.</p>
          </div>
        ) : (
          <div ref={scrollContainerRef} className="bg-white overflow-y-auto max-h-[500px]">
            <table className="w-full text-left border-collapse pl-10">
              <thead>
                <tr className="sticky top-0 bg-[#F4F6FA] border-b border-[#E0E4EB]">
                  <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-[#7F8C9D] font-bold">Product</th>
                  <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-[#7F8C9D] font-bold">Tags</th>
                  <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-[#7F8C9D] font-bold">Price</th>
                  <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-[#7F8C9D] font-bold">Status</th>
                  <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-[#7F8C9D] font-bold text-right">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E4EB]">
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
                <Loader2 className="animate-spin text-[#4A90E2]" size={24} />
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#F4F6FA] transition-all"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg">
                <Plus size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#2C3E50]">New Product</h2>
                <p className="text-xs text-[#7F8C9D]">Add a new item to your catalog</p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  <p className="mt-1.5 text-[10px] text-[#7F8C9D]">Separate tags with commas</p>
                </div>
                <div>
                  <label className={labelStyle}>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={inputStyle}
                  >
                    <option value="">No Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="pt-4 border-t border-[#E0E4EB]">
                  <button type="submit" disabled={formLoading} className="w-full bg-[#4A90E2] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:bg-[#357ABD]">
                    {formLoading ? <Loader2 size={18} className="animate-spin" /> : "Create Product"}
                  </button>
                </div>
              </div>

              <div className="flex flex-col">
                <label className={labelStyle}>Product Image</label>
                <div className="relative flex-1 min-h-[240px] group">
                  {!preview ? (
                    <div className="absolute inset-0 border-2 border-dashed border-[#E0E4EB] rounded-lg flex flex-col items-center justify-center bg-[#F4F6FA] group-hover:bg-white group-hover:border-[#4A90E2] transition-all">
                      <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                      <div className="p-4 rounded-full bg-white shadow-sm mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="text-[#7F8C9D] group-hover:text-[#4A90E2]" size={24} />
                      </div>
                      <p className="text-sm font-medium text-[#2C3E50]">Click to upload</p>
                      <p className="text-xs text-[#7F8C9D] mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  ) : (
                    <div className="absolute inset-0 rounded-lg overflow-hidden border border-[#E0E4EB] bg-[#F4F6FA]">
                      <img src={preview} alt="Preview" className="w-full h-full object-contain p-5" />
                      <button type="button" onClick={() => { setFile(null); setPreview(null); }} className="absolute top-3 right-3 p-2 bg-white text-[#E74C3C] rounded-full shadow-lg">
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  {!preview && <div className="mt-2 flex items-center gap-2 text-[#7F8C9D] text-[11px]"><ImageIcon size={12} /> No image selected</div>}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
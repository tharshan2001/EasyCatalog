import React, { useState } from "react";
import api from "../store/api.js";
import { Upload, X, Loader2, CheckCircle2, AlertCircle, PackagePlus, Image as ImageIcon } from "lucide-react";

export default function CreateProductPage() {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    tags: "",
    price: "", // added price
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => payload.append(key, formData[key]));
      if (file) payload.append("image", file);

      await api.post("/products", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setFormData({ code: "", name: "", tags: "", price: "" });
      setFile(null);
      setPreview(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full border border-stone-200 bg-stone-50/50 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all";
  const labelStyle = "block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="max-w-4xl mx-auto my-10">
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
        
        {/* Header - Fixed Height */}
        <div className="px-8 py-5 border-b border-stone-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <PackagePlus size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-800">New Product</h2>
              <p className="text-xs text-stone-500">Add a new item to your catalog</p>
            </div>
          </div>

          {/* Inline Status Messages */}
          <div className="flex-1 max-w-xs ml-4">
            {error && (
              <div className="animate-in fade-in slide-in-from-top-1 px-3 py-2 bg-red-50 text-red-700 rounded-md flex items-center gap-2 text-xs border border-red-100">
                <AlertCircle size={14} /> {error}
              </div>
            )}
            {success && (
              <div className="animate-in fade-in slide-in-from-top-1 px-3 py-2 bg-green-50 text-green-700 rounded-md flex items-center gap-2 text-xs border border-green-100">
                <CheckCircle2 size={14} /> Product Created
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: Form Fields */}
          <div className="space-y-5">
            <div>
              <label className={labelStyle}>Product Code</label>
              <input type="text" name="code" value={formData.code} onChange={handleChange} className={inputStyle} placeholder="E.g. VASE-001" required />
            </div>

            <div>
              <label className={labelStyle}>Product Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputStyle} placeholder="Handcrafted Ceramic Vase" required />
            </div>

            <div>
              <label className={labelStyle}>Price (LKR)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={inputStyle}
                placeholder="E.g. 3500"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className={labelStyle}>Tags</label>
              <input type="text" name="tags" value={formData.tags} onChange={handleChange} className={inputStyle} placeholder="decor, minimalist, pottery" />
              <p className="mt-1.5 text-[10px] text-stone-400">Separate tags with commas</p>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white font-semibold py-3 rounded-xl hover:bg-blue-600 flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-slate-200 active:scale-[0.98]"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <>Create Product</>}
              </button>
            </div>
          </div>

          {/* Right Column: Image Upload */}
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
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button
                    type="button"
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-red-500 rounded-full shadow-lg transition-all transform hover:scale-110 z-30"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
            {!preview && <div className="mt-2 flex items-center gap-2 text-stone-400 italic text-[11px]">
               <ImageIcon size={12} /> No image selected
            </div>}
          </div>

        </form>
      </div>
    </div>
  );
}
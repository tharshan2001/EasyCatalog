import React, { useState, useEffect } from "react";
import {
  Loader2,
  Plus,
  Tag,
  X,
  Pencil,
  Trash2,
  AlertCircle
} from "lucide-react";
import api from "../../store/api";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

export default function CategoryListAdmin() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "" });
  const [formLoading, setFormLoading] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("categories");
      setCategories(response.data?.categories ?? []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Failed to load categories");
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ name: e.target.value });
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      if (editingCategory) {
        await api.put(`categories/${editingCategory._id}`, formData);
        toast.success("Category updated successfully");
      } else {
        await api.post("/categories", formData);
        toast.success("Category created successfully");
      }

      setFormData({ name: "" });
      setIsModalOpen(false);
      loadCategories();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.message || "Failed to save category", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this category?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4A90E2",
      cancelButtonColor: "#7F8C9D",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success("Category deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      Swal.fire("Failed", err.response?.data?.message || "Failed to delete category", "error");
    }
  };

  const inputStyle = "w-full border border-[#E0E4EB] bg-white px-3 py-2 rounded-md outline-none focus:ring-2 focus:ring-[#4A90E2]/20 focus:border-[#4A90E2] text-sm transition-all";
  const labelStyle = "block text-xs font-semibold text-[#7F8C9D] uppercase tracking-wider mb-1.5";

  return (
    <div className="bg-[#F4F6FA] h-[700px] p-4 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4 pb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#2C3E50]">Category Manager</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#7F8C9D] mt-2 font-bold">
              {categories?.length ?? 0} Categories in Collection
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-[#4A90E2] hover:bg-[#357ABD] text-white px-8 py-4 text-[8px] font-bold uppercase tracking-[0.2em] transition-colors"
          >
            <Plus size={14} /> New Category
          </button>
        </div>

        {error ? (
          <div className="bg-red-50 border-l-2 border-[#E74C3C] p-4 flex items-center gap-4 text-[#E74C3C]">
            <AlertIcon size={20} /> {error}
          </div>
        ) : loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-[#4A90E2]" size={32} />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-32 bg-white border border-dashed border-[#E0E4EB]">
            <Tag size={48} className="mx-auto text-[#7F8C9D] mb-4" />
            <p className="font-medium text-[#7F8C9D]">No categories yet.</p>
          </div>
        ) : (
          <div className="bg-white overflow-y-auto max-h-[500px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="sticky top-0 bg-[#F4F6FA] border-b border-[#E0E4EB]">
                  <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-[#7F8C9D] font-bold">Name</th>
                  <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-[#7F8C9D] font-bold">Slug</th>
                  <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-[#7F8C9D] font-bold">Created</th>
                  <th className="p-5 text-[10px] uppercase tracking-[0.2em] text-[#7F8C9D] font-bold text-right">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E4EB]">
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-[#F4F6FA] transition-colors">
                    <td className="p-5">
                      <span className="font-medium text-[#2C3E50]">{category.name}</span>
                    </td>
                    <td className="p-5">
                      <span className="text-sm text-[#7F8C9D] font-mono">{category.slug}</span>
                    </td>
                    <td className="p-5">
                      <span className="text-sm text-[#7F8C9D]">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="p-2 text-[#4A90E2] hover:bg-[#F4F6FA] rounded-lg transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          className="p-2 text-[#E74C3C] hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#F4F6FA] transition-all"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#4A90E2]/10 text-[#4A90E2] rounded-lg">
                <Tag size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#2C3E50]">
                  {editingCategory ? "Edit Category" : "New Category"}
                </h2>
                <p className="text-xs text-[#7F8C9D]">
                  {editingCategory ? "Update category details" : "Add a new category"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={labelStyle}>Category Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputStyle}
                  placeholder="e.g. Electronics"
                  required
                />
              </div>

              <div className="pt-4 border-t border-[#E0E4EB]">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-[#4A90E2] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:bg-[#357ABD]"
                >
                  {formLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : editingCategory ? (
                    "Update Category"
                  ) : (
                    "Create Category"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
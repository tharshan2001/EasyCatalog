import React from "react";
import { Trash2, Archive, ArchiveRestore, ImageOff, Edit } from "lucide-react";

const ProductCardAdmin = React.forwardRef(({ product, onDelete, onToggleArchive, onEdit, isLast }, ref) => {
  if (!product || !product._id) return null;

  const name = product.name ?? "Unnamed Product";
  const imageUrl = product.image_url ?? "";
  const tags = product.tags ?? [];
  const price = typeof product.price === "number" ? product.price.toFixed(2) : parseFloat(product.price ?? 0).toFixed(2);
  const category = product.category;

  return (
    <tr 
      ref={ref} 
      data-last-row={isLast ? "true" : undefined}
      className={`group border-b border-[#E0E4EB] transition-colors hover:bg-[#F4F6FA] ${product.archived ? 'bg-[#F4F6FA]' : 'bg-white'}`}
    >
      {/* ... rest of your JSX remains exactly the same ... */}
      <td className="py-4 pl-6 pr-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 bg-[#F4F6FA] flex-shrink-0 overflow-hidden border border-[#E0E4EB]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className={`w-full h-full object-cover ${product.archived ? "grayscale opacity-50" : ""}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#7F8C9D]">
                <ImageOff size={16} />
              </div>
            )}
          </div>
          <div>
            <h4 className={`text-sm font-medium ${product.archived ? "text-[#7F8C9D]" : "text-[#2C3E50]"}`}>
              {name}
            </h4>
            <p className="text-[10px] text-[#7F8C9D] font-mono mt-0.5">
              {product.slug ?? "no-slug"}
            </p>
            {category && (
              <span className="inline-block mt-1 text-[9px] font-medium text-[#4A90E2] bg-[#4A90E2]/10 px-2 py-0.5 rounded">
                {category.name}
              </span>
            )}
          </div>
        </div>
      </td>

      <td className="px-4 py-4">
        {tags.length > 0 ? (
          tags.map((tag, i) => (
            <span key={`${tag}-${i}`} className="text-[9px] font-medium text-[#4A90E2] bg-[#4A90E2]/10 px-2 py-1 rounded-sm mr-1">
              {tag}
            </span>
          ))
        ) : (
          <span className="text-[9px] font-mono text-[#7F8C9D]">-</span>
        )}
      </td>

      <td className="px-4 py-4">
        <span className="text-sm font-medium text-[#2C3E50]">LKR {price}</span>
      </td>

      <td className="px-4 py-4">
        {product.archived ? (
          <div className="flex items-center gap-1.5 text-[#7F8C9D]">
            <Archive size={12} />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Archived</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[#27AE60]">
            <div className="h-1 w-1 bg-[#27AE60] rounded-full animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Active</span>
          </div>
        )}
      </td>

      <td className="py-4 pl-4 pr-6 text-right">
        <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(product)}
            className="flex flex-col items-center p-2 text-[#7F8C9D] hover:text-[#4A90E2] hover:bg-white rounded-md transition-all"
            title="Edit"
          >
            <Edit size={16} strokeWidth={1.5} />
            <span className="text-[8px] mt-1 font-mono uppercase tracking-wider">Edit</span>
          </button>

          <div className="w-px h-4 bg-[#E0E4EB] mx-1" />

          <button
            onClick={() => onToggleArchive(product._id)}
            className="flex flex-col items-center p-2 text-[#7F8C9D] hover:text-[#4A90E2] hover:bg-white rounded-md transition-all"
            title={product.archived ? "Restore" : "Archive"}
          >
            {product.archived ? <ArchiveRestore size={16} strokeWidth={1.5} /> : <Archive size={16} strokeWidth={1.5} />}
            <span className="text-[8px] mt-1 font-mono uppercase tracking-wider">
              {product.archived ? "Restore" : "Archive"}
            </span>
          </button>

          <div className="w-px h-4 bg-[#E0E4EB] mx-1" />

          <button
            onClick={() => onDelete(product._id)}
            className="flex flex-col items-center p-2 text-[#7F8C9D] hover:text-[#E74C3C] hover:bg-red-50 rounded-md transition-all"
            title="Delete"
          >
            <Trash2 size={16} strokeWidth={1.5} />
            <span className="text-[8px] mt-1 font-mono uppercase tracking-wider">Delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
});

ProductCardAdmin.displayName = 'ProductCardAdmin';

export default ProductCardAdmin;
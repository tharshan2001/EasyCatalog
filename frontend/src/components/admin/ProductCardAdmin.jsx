import React from "react";
import { Trash2, Archive, ArchiveRestore, ImageOff } from "lucide-react";

const ProductCardAdmin = React.forwardRef(({ product, onDelete, onToggleArchive }, ref) => {
  if (!product || !product._id) return null; // skip invalid product

  const name = product.name ?? "Unnamed Product";
  const imageUrl = product.image_url ?? "";
  const tags = product.tags ?? [];
  const price = typeof product.price === "number" ? product.price.toFixed(2) : parseFloat(product.price ?? 0).toFixed(2);

  return (
    <tr ref={ref} className={`group border-b border-slate-100 transition-colors hover:bg-sky-50 ${product.archived ? 'bg-slate-50/50' : 'bg-white'}`}>
      {/* Product Info */}
      <td className="py-4 pl-6 pr-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200 shadow-sm">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className={`w-full h-full object-cover ${product.archived ? "grayscale opacity-50" : ""}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <ImageOff size={16} />
              </div>
            )}
          </div>
          <div>
            <h4 className={`text-sm font-serif ${product.archived ? "text-slate-400" : "text-sky-900"} font-medium`}>
              {name}
            </h4>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-tighter">
              slug: {product.slug ?? "no-slug"}
            </p>
          </div>
        </div>
      </td>

      {/* Tags */}
      <td className="px-4 py-4">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <span key={tag} className="text-[9px] font-bold uppercase tracking-[0.15em] text-sky-700 bg-sky-100 px-2 py-1 rounded-sm mr-1">
              {tag}
            </span>
          ))
        ) : (
          <span className="text-[9px] font-mono text-slate-400">No tags</span>
        )}
      </td>

      {/* Price */}
      <td className="px-4 py-4">
        <span className="text-sm font-medium text-slate-700 font-areial">LKR {price}</span>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        {product.archived ? (
          <div className="flex items-center gap-1.5 text-slate-400">
            <Archive size={12} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Archived</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-green-600">
            <div className="h-1 w-1 bg-green-600 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Live</span>
          </div>
        )}
      </td>

      {/* Management Actions */}
      <td className="py-4 pl-4 pr-6 text-right">
        <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Archive / Restore */}
          <button
            onClick={() => onToggleArchive(product._id)}
            className="flex flex-col items-center p-2 text-slate-400 hover:text-sky-600 hover:bg-white rounded-full transition-all"
            title={product.archived ? "Restore" : "Archive"}
          >
            {product.archived ? <ArchiveRestore size={16} strokeWidth={1.5} /> : <Archive size={16} strokeWidth={1.5} />}
            <span className="text-[8px] mt-1 font-mono uppercase tracking-widest">
              {product.archived ? "Restore" : "Archive"}
            </span>
          </button>

          <div className="w-px h-4 bg-slate-200 mx-1" />

          {/* Delete */}
          <button
            onClick={() => onDelete(product._id)}
            className="flex flex-col items-center p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
            title="Delete"
          >
            <Trash2 size={16} strokeWidth={1.5} />
            <span className="text-[8px] mt-1 font-mono uppercase tracking-widest">Delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
});

export default ProductCardAdmin;
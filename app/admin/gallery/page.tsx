"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, X } from "lucide-react";
import ImageUploadButton from "@/components/admin/ImageUploadButton";

export default function GalleryManagement() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ image_url: "", alt_text: "", display_order: 0 });
  // "main" = homepage carousel (gallery_main), "gallery" = full gallery page (gallery)
  const [target, setTarget] = useState<"main" | "gallery">("main");

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/gallery?target=${target}`);
      const data = await res.json();
      setImages(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/gallery?target=${target}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ image_url: "", alt_text: "", display_order: 0 });
        fetchImages();
      } else {
        const err = await res.json().catch(() => null);
        alert(err?.error || "Failed to add image");
      }
    } catch (err) {
      alert("Error adding image");
    }
  };

  const handleDelete = async (id: string | number) => {
    if (confirm("Are you sure you want to delete this image?")) {
      try {
        const res = await fetch(`/api/admin/gallery?target=${target}&id=${id}`, { method: "DELETE" });
        if (res.ok) fetchImages();
        else alert("Failed to delete");
      } catch (err) {
        alert("Error deleting");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-navy">Gallery Management</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-neon text-navy px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-neon-hover transition-colors">
          <Plus size={20} /> Add Image
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {([["main", "Homepage Carousel"], ["gallery", "Gallery Page"]] as const).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setTarget(value)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm border ${target === value ? "bg-navy text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-500 text-center py-12">Loading gallery...</div>
      ) : images.length === 0 ? (
        <div className="text-gray-500 text-center py-12 bg-white rounded-xl shadow-sm border">No images found in gallery.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div key={img.id} className="bg-white rounded-xl shadow-sm border overflow-hidden group relative">
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                <img src={img.image_url} alt={img.alt_text || "Gallery Image"} className="object-cover w-full h-full" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => handleDelete(img.id)} className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="p-3 bg-white text-xs text-gray-500 text-center border-t">
                Order: {img.display_order || 0}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-navy">Add Gallery Image</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Image URL</label>
                <div className="flex gap-2">
                  <input required type="text" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full border rounded-lg p-2" placeholder="Upload an image or paste a storage URL" />
                  <ImageUploadButton folder="gallery" onUploaded={(url) => setFormData({...formData, image_url: url})} />
                </div>
                {formData.image_url && (
                   <div className="mt-4 aspect-video rounded-lg overflow-hidden bg-gray-100">
                     <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "")} />
                   </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Alt Text (optional)</label>
                <input type="text" maxLength={255} value={formData.alt_text} onChange={e => setFormData({...formData, alt_text: e.target.value})} className="w-full border rounded-lg p-2" placeholder="Short description of the photo" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Display Order</label>
                <input type="number" value={formData.display_order} onChange={e => setFormData({...formData, display_order: parseInt(e.target.value) || 0})} className="w-full border rounded-lg p-2" />
              </div>
              <div className="flex justify-end gap-3 pt-4 mt-6 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg font-semibold hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-navy text-white rounded-lg font-semibold hover:bg-navy-light">Add Image</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

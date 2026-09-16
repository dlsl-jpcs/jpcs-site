"use client";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";

export default function ProjectsManagement() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "", org: "JPCS", date: "", description: "", facebook: "", instagram: "", image: ""
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      setProjects(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openModal = (project: any = null) => {
    if (project) {
      setEditingProject(project);
      setFormData(project);
    } else {
      setEditingProject(null);
      setFormData({
        name: "", org: "JPCS", date: "", description: "", facebook: "", instagram: "", image: ""
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingProject ? "PUT" : "POST";
    const body = editingProject ? { ...formData, id: editingProject.id } : formData;

    try {
      const res = await fetch("/api/admin/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        closeModal();
        fetchProjects();
      } else {
        alert("Failed to save project");
      }
    } catch (err) {
      alert("Error saving project");
    }
  };

  const handleDelete = async (id: string | number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
        if (res.ok) fetchProjects();
        else alert("Failed to delete");
      } catch (err) {
        alert("Error deleting");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-navy">Projects & Activities</h1>
        <button onClick={() => openModal()} className="bg-neon text-navy px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-neon-hover transition-colors">
          <Plus size={20} /> Add Project
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600">Date</th>
              <th className="p-4 font-semibold text-gray-600">Organization</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading projects...</td></tr>
            ) : projects.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">No projects found.</td></tr>
            ) : (
              projects.map((proj) => (
                <tr key={proj.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-navy">{proj.name}</td>
                  <td className="p-4 text-gray-600">{proj.date}</td>
                  <td className="p-4 text-gray-600">{proj.org}</td>
                  <td className="p-4 flex justify-end gap-2">
                    <button onClick={() => openModal(proj)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(proj.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-navy">{editingProject ? "Edit Project" : "Add New Project"}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">Project Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Date</label>
                  <input required type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border rounded-lg p-2" placeholder="e.g. November 2023" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Organization</label>
                  <input type="text" value={formData.org} onChange={e => setFormData({...formData, org: e.target.value})} className="w-full border rounded-lg p-2" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">Description</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded-lg p-2 h-24" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">Image URL</label>
                  <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full border rounded-lg p-2" placeholder="https://example.com/image.jpg" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 mt-6 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-lg font-semibold hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-navy text-white rounded-lg font-semibold hover:bg-navy-light">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

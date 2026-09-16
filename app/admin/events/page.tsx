"use client";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";

export default function EventsManagement() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "", org: "JPCS", date: "", time: "", description: "", link: "", image: "", facebook: "", instagram: ""
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/events");
      const data = await res.json();
      setEvents(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openModal = (event: any = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData(event);
    } else {
      setEditingEvent(null);
      setFormData({
        title: "", org: "JPCS", date: "", time: "", description: "", link: "", image: "", facebook: "", instagram: ""
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingEvent ? "PUT" : "POST";
    const body = editingEvent ? { ...formData, id: editingEvent.id } : formData;

    try {
      const res = await fetch("/api/admin/events", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        closeModal();
        fetchEvents();
      } else {
        alert("Failed to save event");
      }
    } catch (err) {
      alert("Error saving event");
    }
  };

  const handleDelete = async (id: string | number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        const res = await fetch(`/api/admin/events?id=${id}`, { method: "DELETE" });
        if (res.ok) fetchEvents();
        else alert("Failed to delete");
      } catch (err) {
        alert("Error deleting");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-navy">Events Management</h1>
        <button onClick={() => openModal()} className="bg-neon text-navy px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-neon-hover transition-colors">
          <Plus size={20} /> Add Event
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="p-4 font-semibold text-gray-600">Title</th>
              <th className="p-4 font-semibold text-gray-600">Date & Time</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">Loading events...</td></tr>
            ) : events.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-gray-500">No events found.</td></tr>
            ) : (
              events.map((evt) => {
                const eventDate = new Date(`${evt.date} ${evt.time}`);
                const isPast = eventDate < new Date();
                
                return (
                  <tr key={evt.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-navy">{evt.title}</td>
                    <td className="p-4 text-gray-600">{evt.date} {evt.time}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${isPast ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                        {isPast ? 'Completed' : 'Upcoming'}
                      </span>
                    </td>
                    <td className="p-4 flex justify-end gap-2">
                      <button onClick={() => openModal(evt)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(evt.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-navy">{editingEvent ? "Edit Event" : "Add New Event"}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">Event Title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Date (YYYY-MM-DD)</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Time</label>
                  <input required type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full border rounded-lg p-2" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">Description</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded-lg p-2 h-24" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">Image URL</label>
                  <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full border rounded-lg p-2" placeholder="https://example.com/image.jpg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Registration Link</label>
                  <input type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full border rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Organization</label>
                  <input type="text" value={formData.org} onChange={e => setFormData({...formData, org: e.target.value})} className="w-full border rounded-lg p-2" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 mt-6 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-lg font-semibold hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-navy text-white rounded-lg font-semibold hover:bg-navy-light">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

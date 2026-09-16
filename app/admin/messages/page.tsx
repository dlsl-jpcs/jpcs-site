"use client";
import { useState, useEffect } from "react";
import { Trash2, MailOpen, Mail } from "lucide-react";

export default function MessagesManagement() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      setMessages(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string | number) => {
    if (confirm("Are you sure you want to delete this message?")) {
      try {
        const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
        if (res.ok) {
          fetchMessages();
          setSelectedMessage(null);
        } else alert("Failed to delete");
      } catch (err) {
        alert("Error deleting");
      }
    }
  };

  const markAsRead = async (id: string | number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/messages`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_read: !currentStatus }),
      });
      if (res.ok) fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h1 className="text-3xl font-extrabold text-navy">Messages & Queries</h1>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Messages List */}
        <div className="w-1/3 bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-gray-50 font-semibold text-gray-700">Inbox</div>
          <div className="overflow-y-auto flex-1 p-2">
            {loading ? (
              <div className="text-center text-gray-500 py-8">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No messages.</div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.form_id} 
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (!msg.is_read) markAsRead(msg.form_id, false);
                  }}
                  className={`p-4 mb-2 rounded-lg cursor-pointer transition-colors border-l-4 ${selectedMessage?.form_id === msg.form_id ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50 border-transparent'} ${!msg.is_read ? 'bg-gray-100 font-semibold' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-gray-900 truncate pr-4">{msg.fullname}</h3>
                    {!msg.is_read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5"></span>}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{msg.subject}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col">
          {selectedMessage ? (
            <>
              <div className="p-6 border-b flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-navy mb-2">{selectedMessage.subject}</h2>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <span className="font-semibold text-gray-900">{selectedMessage.fullname}</span>
                    <span>&lt;{selectedMessage.email}&gt;</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    ID: {selectedMessage.form_id}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => markAsRead(selectedMessage.form_id, selectedMessage.is_read)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg tooltip"
                    title="Toggle Read Status"
                  >
                    {selectedMessage.is_read ? <Mail size={20} /> : <MailOpen size={20} />}
                  </button>
                  <button 
                    onClick={() => handleDelete(selectedMessage.form_id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    title="Delete Message"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              <div className="p-8 overflow-y-auto whitespace-pre-wrap text-gray-800 leading-relaxed text-lg flex-1">
                {selectedMessage.message}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-4">
              <Mail size={48} className="opacity-20" />
              <p>Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

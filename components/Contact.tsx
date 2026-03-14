"use client";
import { motion } from "framer-motion";
import { FormEvent, useState } from "react";

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialForm: ContactForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const Contact = () => {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "ok" | "error"; message: string } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      setStatus({ type: "error", message: "Please complete all fields." });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(payload.email)) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { message?: string };

      if (!res.ok) {
        throw new Error(data.message || "Unable to send your message.");
      }

      setForm(initialForm);
      setStatus({ type: "ok", message: "Message sent successfully. We'll get back to you soon." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong while sending your message.";
      setStatus({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-20 min-[401px]:py-28 md:py-32 px-4 min-[401px]:px-6 md:px-16 overflow-hidden bg-white z-30 rounded-t-[3rem] -mt-10 shadow-[0_-20px_50px_rgba(0,0,0,0.05)]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 min-[401px]:gap-14 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl min-[401px]:text-5xl md:text-6xl lg:text-[4.5rem] font-extrabold text-navy tracking-tight leading-[1.05] mb-4 min-[401px]:mb-6">
              Let&apos;s build <br />
              something <br />
              <span className="inline-block bg-charcoal text-neon px-4 min-[401px]:px-5 py-1.5 min-[401px]:py-2 mt-2 min-[401px]:mt-3 rounded-full transform -rotate-2 shadow-2xl text-2xl min-[401px]:text-4xl md:text-7xl">
                extraordinary.
              </span>
            </h2>

            <p className="text-charcoal/60 text-base min-[401px]:text-lg md:text-xl font-medium max-w-md mb-8 min-[401px]:mb-12 leading-relaxed">
              Whether you have a partnership proposal, an event inquiry, or just
              want to say hi, our inbox is always open.
            </p>

            <div className="flex flex-col gap-5 min-[401px]:gap-6">
              <div className="group flex items-start gap-4 min-[401px]:gap-5 w-fit cursor-default">
                <div className="w-10 h-10 min-[401px]:w-12 min-[401px]:h-12 rounded-2xl bg-navy/5 border border-navy/10 flex items-center justify-center text-navy group-hover:bg-neon group-hover:border-neon group-hover:text-navy transition-all duration-300">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-navy/40 uppercase tracking-widest mb-1">
                    Email Us
                  </p>
                  <p className="text-navy font-bold text-base min-[401px]:text-lg tracking-tight group-hover:text-neon transition-colors duration-300">
                    jpcs@dlsl.edu.ph
                  </p>
                </div>
              </div>

              <div className="group flex items-start gap-4 min-[401px]:gap-5 w-fit cursor-default">
                <div className="w-10 h-10 min-[401px]:w-12 min-[401px]:h-12 rounded-2xl bg-navy/5 border border-navy/10 flex items-center justify-center text-navy group-hover:bg-neon group-hover:border-neon group-hover:text-navy transition-all duration-300">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-navy/40 uppercase tracking-widest mb-1">
                    Location
                  </p>
                  <p className="text-navy font-bold text-base min-[401px]:text-lg tracking-tight">
                    De La Salle Lipa
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative bg-charcoal rounded-[2rem] min-[401px]:rounded-[2.5rem] p-5 min-[401px]:p-7 md:p-12 overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] border border-white/10"
          >
            <div className="absolute top-0 left-10 right-10 h-1.5 bg-neon rounded-b-full opacity-80" />

            <div className="absolute -top-24 -right-24 w-64 h-64 bg-neon/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="mb-6 min-[401px]:mb-8 relative z-10">
              <h3 className="text-2xl min-[401px]:text-3xl font-extrabold text-white tracking-tight">
                Send a Message
              </h3>
              <p className="text-white/50 text-xs min-[401px]:text-sm md:text-base mt-2 font-medium">
                Fill out the form below and we&apos;ll get back to you shortly.
              </p>
            </div>

            <form
              className="relative z-10 flex flex-col gap-4 min-[401px]:gap-5"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-[401px]:gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-white/50 uppercase tracking-widest ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="John Doe"
                    required
                    className="w-full bg-white/5 text-white px-4 min-[401px]:px-5 py-3 min-[401px]:py-4 rounded-2xl border border-white/10 focus:border-neon focus:bg-white/10 outline-none transition-all placeholder:text-white/20 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-white/50 uppercase tracking-widest ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="john@example.com"
                    required
                    className="w-full bg-white/5 text-white px-4 min-[401px]:px-5 py-3 min-[401px]:py-4 rounded-2xl border border-white/10 focus:border-neon focus:bg-white/10 outline-none transition-all placeholder:text-white/20 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2 mt-2">
                <label className="text-[11px] font-extrabold text-white/50 uppercase tracking-widest ml-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, subject: e.target.value }))
                  }
                  placeholder="How can we help?"
                  required
                  className="w-full bg-white/5 text-white px-4 min-[401px]:px-5 py-3 min-[401px]:py-4 rounded-2xl border border-white/10 focus:border-neon focus:bg-white/10 outline-none transition-all placeholder:text-white/20 font-medium"
                />
              </div>

              <div className="space-y-2 mt-2">
                <label className="text-[11px] font-extrabold text-white/50 uppercase tracking-widest ml-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, message: e.target.value }))
                  }
                  placeholder="Tell us about your inquiry..."
                  rows={4}
                  required
                  className="w-full bg-white/5 text-white px-4 min-[401px]:px-5 py-3 min-[401px]:py-4 rounded-2xl border border-white/10 focus:border-neon focus:bg-white/10 outline-none transition-all placeholder:text-white/20 font-medium resize-none"
                ></textarea>
              </div>

              {status && (
                <p
                  className={`text-sm font-semibold mt-2 ${
                    status.type === "ok" ? "text-neon" : "text-red-300"
                  }`}
                >
                  {status.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full bg-neon text-navy font-extrabold text-base min-[401px]:text-lg py-3 min-[401px]:py-4 mt-4 min-[401px]:mt-6 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(196,255,71,0.3)] hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? "Sending..." : "Send"}
                </span>
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

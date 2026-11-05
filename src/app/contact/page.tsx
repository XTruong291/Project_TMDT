"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertCircle,
  Building2,
  Check,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import { submitContactForm } from "@/lib/api";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Vui lòng điền Họ tên, Email và Nội dung tin nhắn.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await submitContactForm({
        fullName: formData.fullName.trim(),
        address: formData.address.trim() || undefined,
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject: formData.subject.trim() || "Thư liên hệ từ website",
        message: formData.message.trim(),
      });

      setSuccess(true);
      setFormData({
        fullName: "",
        address: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Không thể gửi thư liên hệ lúc này. Vui lòng thử lại sau.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-navy/5 bg-white">
        <div className="raycon-container py-3">
          <nav className="flex items-center gap-1.5 text-xs text-navy/60 font-medium">
            <Link href="/" className="hover:text-royal transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="size-3.5 text-navy/40" />
            <span className="text-navy font-semibold">Liên hệ & Hỗ trợ</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[linear-gradient(115deg,#0d1163_0%,#1a1db6_50%,#2d50ed_100%)] text-white py-12 md:py-16">
        <div className="raycon-container relative z-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold tracking-wider uppercase backdrop-blur-xs mb-3">
            <Sparkles className="size-3.5 text-[#ffb13b]" />
            <span>Trung tâm Trợ giúp Raycon</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="mt-3 text-sm md:text-base text-white/85 leading-relaxed">
            Bạn có câu hỏi về sản phẩm, chính sách bảo hành hoặc mong muốn hợp tác? Đội ngũ Raycon luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7.
          </p>
        </div>
      </section>

      {/* Main Grid: Form + Contact Info + Google Maps */}
      <div className="raycon-container py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Left Column (7 cols): Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-navy/10 p-6 md:p-10 shadow-xs">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-navy">
                Gửi Tin Nhắn Cho Raycon
              </h2>
              <p className="text-xs text-navy/60 mt-1">
                Điền đầy đủ thông tin bên dưới, chúng tôi sẽ phản hồi qua email trong vòng 24 giờ làm việc.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-600 flex items-center gap-2.5">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center space-y-3">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="size-6" />
                </div>
                <h3 className="text-base font-bold text-emerald-800">
                  Gửi Tin Nhắn Thành Công!
                </h3>
                <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                  Cảm ơn bạn đã liên hệ với Raycon. Chuyên viên chăm sóc khách hàng của chúng tôi sẽ sớm liên lạc lại với bạn.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
                >
                  Gửi thêm tin nhắn khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full name & Email */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      placeholder="Nguyễn Văn A"
                      className="w-full rounded-xl border border-navy/15 bg-white py-2.5 px-3.5 text-xs text-navy outline-none focus:border-royal focus:ring-1 focus:ring-royal/30 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                      Địa chỉ Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="email@example.com"
                      className="w-full rounded-xl border border-navy/15 bg-white py-2.5 px-3.5 text-xs text-navy outline-none focus:border-royal focus:ring-1 focus:ring-royal/30 transition"
                    />
                  </div>
                </div>

                {/* Phone & Address (Bắt buộc theo đề cương: Họ tên, Địa chỉ, Email, Nội dung) */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="0912 345 678"
                      className="w-full rounded-xl border border-navy/15 bg-white py-2.5 px-3.5 text-xs text-navy outline-none focus:border-royal focus:ring-1 focus:ring-royal/30 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                      Địa chỉ cư trú / Doanh nghiệp
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="Ví dụ: Ba Đình, Hà Nội"
                      className="w-full rounded-xl border border-navy/15 bg-white py-2.5 px-3.5 text-xs text-navy outline-none focus:border-royal focus:ring-1 focus:ring-royal/30 transition"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                    Chủ đề liên hệ
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder="Ví dụ: Tư vấn chọn mua tai nghe / Hợp tác đại lý / Đổi trả"
                    className="w-full rounded-xl border border-navy/15 bg-white py-2.5 px-3.5 text-xs text-navy outline-none focus:border-royal focus:ring-1 focus:ring-royal/30 transition"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-navy/70 mb-1.5">
                    Nội dung tin nhắn *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Hãy chia sẻ chi tiết câu hỏi hoặc yêu cầu hỗ trợ của bạn..."
                    className="w-full rounded-xl border border-navy/15 bg-white p-3.5 text-xs text-navy outline-none focus:border-royal focus:ring-1 focus:ring-royal/30 resize-none leading-relaxed transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-royal px-8 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#2827cd] transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="size-3.5" />
                  <span>{submitting ? "Đang gửi tin..." : "Gửi Tin Nhắn Ngay"}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column (5 cols): Quick Info & Interactive Google Maps */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Contact Card */}
            <div className="bg-white rounded-3xl border border-navy/10 p-6 md:p-8 shadow-xs space-y-5">
              <h3 className="text-lg font-bold text-navy border-b border-navy/10 pb-3">
                Thông Tin Trụ Sở & Hotline
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-royal/10 text-royal mt-0.5">
                    <Phone className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-navy">Hotline Hỗ Trợ 24/7</p>
                    <p className="text-sm font-extrabold text-royal mt-0.5">1-800-RAYCON (1800 729 266)</p>
                    <p className="text-[11px] text-navy/50">Miễn cước cho toàn bộ khách hàng</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mt-0.5">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-navy">Email CSKH & Khiếu Nại</p>
                    <p className="text-sm font-bold text-navy mt-0.5">support@rayconglobal.com</p>
                    <p className="text-[11px] text-navy/50">Phản hồi cam kết trong 24 giờ</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 mt-0.5">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-navy">Trụ Sở Chính (Global HQ)</p>
                    <p className="text-xs text-navy/80 mt-0.5 leading-snug">
                      1115 Broadway, Suite 1200, New York, NY 10010, USA
                    </p>
                    <p className="text-[11px] text-navy/50 mt-1">
                      Chi nhánh VN: 128 Hai Bà Trưng, Phường Đa Kao, Quận 1, TP. HCM
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mt-0.5">
                    <Clock className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-navy">Thời Gian Làm Việc</p>
                    <p className="text-xs text-navy/80 mt-0.5">
                      Thứ 2 – Thứ 7: 8:00 – 21:00
                    </p>
                    <p className="text-[11px] text-navy/50">Chủ nhật & Ngày lễ: 9:00 – 18:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Interactive Embed Card */}
            <div className="bg-white rounded-3xl border border-navy/10 p-4 shadow-xs overflow-hidden">
              <div className="flex items-center justify-between mb-3 px-2 pt-1">
                <span className="text-xs font-bold text-navy uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="size-3.5 text-royal" />
                  Vị trí Văn phòng trên Bản đồ
                </span>
                <span className="text-[10px] text-navy/50 font-semibold">Google Maps Live</span>
              </div>
              <div className="aspect-16/10 w-full overflow-hidden rounded-2xl border border-navy/10">
                <iframe
                  title="Raycon Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.6174786417786!2d-73.99124442347312!3d40.74189537138865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a3f81d509f%3A0xa1b92ffcb613e54b!2s1115%20Broadway%2C%20New%20York%2C%20NY%2010010%2C%20USA!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="size-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bot,
  HelpCircle,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  X,
  Headphones,
  RotateCcw,
  Truck,
  ExternalLink,
} from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}

const FAQ_PROMPTS = [
  {
    icon: Headphones,
    label: "Kết nối Bluetooth",
    reply:
      "Để kết nối tai nghe RYVO: Hãy lấy cả 2 tai nghe ra khỏi hộp sạc, bật Bluetooth trên điện thoại/máy tính của bạn, tìm và chọn tên thiết bị (ví dụ 'The Everyday Earbuds') trong danh sách để ghép nối ngay lập tức!",
  },
  {
    icon: RotateCcw,
    label: "Bảo hành & Đổi trả",
    reply:
      "RYVO cam kết chính sách dùng thử 30 ngày 100% rủi ro bằng 0 (hoàn tiền không cần lý do) và bảo hành nhà sản xuất 1 năm 1 đổi 1 đối với mọi lỗi kỹ thuật.",
  },
  {
    icon: Truck,
    label: "Thời gian giao hàng",
    reply:
      "Đơn hàng đặt trước 14:00 được xử lý cùng ngày. Thời gian giao hàng tiêu chuẩn từ 2 – 4 ngày làm việc trên toàn quốc, miễn phí vận chuyển cho đơn hàng từ 500.000₫.",
  },
];

export function FloatingChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "channels">("chat");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Xin chào! 👋 Tôi là trợ lý ảo RYVO. Tôi có thể giúp gì cho bạn hôm nay?",
      time: "Vừa xong",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = useCallback(
    (textToSend?: string) => {
      const text = (textToSend || inputMessage).trim();
      if (!text) return;

      const userMsg: Message = {
        id: `${Date.now()}-user`,
        sender: "user",
        text,
        time: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, userMsg]);
      if (!textToSend) setInputMessage("");

      // Bot automated intelligent reply
      setTimeout(() => {
        let botResponse =
          "Cảm ơn bạn đã liên hệ! Yêu cầu của bạn đã được ghi nhận. Để được hỗ trợ trực tiếp từ chuyên viên kỹ thuật, bạn có thể gọi hotline 1-800-RYVO (1800 7986) hoặc để lại lời nhắn tại trang Liên hệ (/contact).";

        const lower = text.toLowerCase();
        if (
          lower.includes("bluetooth") ||
          lower.includes("kết nối") ||
          lower.includes("pairing")
        ) {
          botResponse =
            "Hướng dẫn kết nối: Lấy cả 2 tai nghe ra khỏi hộp sạc để tự động ghép đôi (đèn LED nhấp nháy), sau đó mở cài đặt Bluetooth trên máy và chọn thiết bị RYVO.";
        } else if (
          lower.includes("bảo hành") ||
          lower.includes("đổi trả") ||
          lower.includes("warranty")
        ) {
          botResponse =
            "Chính sách RYVO: Đổi trả trong vòng 30 ngày miễn phí hoàn tiền và bảo hành chính hãng 1 đổi 1 trong 1 năm.";
        } else if (
          lower.includes("giá") ||
          lower.includes("khuyến mãi") ||
          lower.includes("coupon") ||
          lower.includes("mã")
        ) {
          botResponse =
            "RYVO đang có các mã giảm giá hấp dẫn: Nhập mã 'RYVO10' (giảm 10%), 'RYVO20' (giảm 20% cho đơn từ 1.000.000₫) hoặc 'FREESHIP' ngay tại Giỏ hàng!";
        } else if (
          lower.includes("chống ồn") ||
          lower.includes("anc") ||
          lower.includes("headphones")
        ) {
          botResponse =
            "Dòng Everyday Headphones ANC sở hữu công nghệ Hybrid ANC 35dB, pin 45 giờ và đệm tai thoáng khí. Đang có sẵn trên hệ thống với giá ưu đãi 2.290.000₫.";
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-bot`,
            sender: "bot",
            text: botResponse,
            time: new Date().toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }, 600);
    },
    [inputMessage],
  );

  // Do not show widget inside admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Mở hộp thoại hỗ trợ trực tuyến"
          className="group relative flex size-14 items-center justify-center rounded-full bg-royal text-white shadow-xl hover:bg-[#2827cd] hover:scale-105 transition-all cursor-pointer animate-in zoom-in-75 duration-200"
        >
          <MessageCircle className="size-6 transition-transform group-hover:scale-110" />
          <span className="absolute -top-1 -right-1 flex size-4">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-4 rounded-full bg-emerald-500 border-2 border-white" />
          </span>
        </button>
      )}

      {/* Interactive Chat Dialog Box */}
      {isOpen && (
        <div className="flex flex-col w-[350px] sm:w-[380px] h-[520px] rounded-3xl bg-white shadow-2xl border border-navy/10 overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-[linear-gradient(135deg,#0d1163_0%,#1a1db6_100%)] p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative flex size-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
                  <Bot className="size-5 text-white" />
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-400 border-2 border-navy" />
                </div>
                <div>
                  <h4 className="text-sm font-bold leading-tight flex items-center gap-1.5">
                    <span>Hỗ Trợ RYVO</span>
                    <Sparkles className="size-3 text-[#ffb13b]" />
                  </h4>
                  <p className="text-[10px] text-white/70">Đang trực tuyến · Sẵn sàng trợ giúp</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex size-8 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="mt-3 flex rounded-xl bg-navy/40 p-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("chat")}
                className={`flex-1 py-1 text-center font-bold rounded-lg transition cursor-pointer ${
                  activeTab === "chat"
                    ? "bg-white text-navy shadow-xs"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Trợ Lý Trực Tuyến
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("channels")}
                className={`flex-1 py-1 text-center font-bold rounded-lg transition cursor-pointer ${
                  activeTab === "channels"
                    ? "bg-white text-navy shadow-xs"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Kênh Hotline & Khác
              </button>
            </div>
          </div>

          {/* Body Content */}
          {activeTab === "chat" ? (
            <div className="flex flex-1 flex-col justify-between overflow-hidden bg-[#fafbfc]">
              {/* Messages Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${
                      m.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                        m.sender === "user"
                          ? "bg-royal text-white rounded-br-xs"
                          : "bg-white text-navy border border-navy/10 rounded-bl-xs shadow-2xs"
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[9px] text-navy/40 px-1 mt-0.5">
                      {m.time}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick FAQ Prompts */}
              <div className="border-t border-navy/5 bg-white p-2">
                <p className="text-[10px] font-bold text-navy/50 px-2 mb-1.5 uppercase tracking-wider">
                  Gợi ý câu hỏi nhanh:
                </p>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {FAQ_PROMPTS.map((faq, i) => {
                    const Icon = faq.icon;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSend(faq.label)}
                        className="inline-flex items-center gap-1 shrink-0 rounded-full border border-navy/15 bg-gray-50/70 px-2.5 py-1 text-[11px] font-semibold text-navy hover:border-royal hover:text-royal hover:bg-white transition cursor-pointer"
                      >
                        <Icon className="size-3 text-royal" />
                        <span>{faq.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2 border-t border-navy/10 bg-white p-2.5"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Nhập câu hỏi của bạn..."
                  className="flex-1 rounded-full border border-navy/15 bg-gray-50 px-3.5 py-1.5 text-xs text-navy outline-none focus:border-royal focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-royal text-white hover:bg-[#2827cd] transition disabled:opacity-40 cursor-pointer"
                >
                  <Send className="size-3.5" />
                </button>
              </form>
            </div>
          ) : (
            /* Channels Tab */
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fafbfc]">
              <p className="text-xs text-navy/70 leading-relaxed">
                Chúng tôi luôn sẵn sàng hỗ trợ bạn qua nhiều phương thức liên lạc trực tiếp:
              </p>

              {/* Call Hotline */}
              <a
                href="tel:1800729266"
                className="flex items-center gap-3.5 rounded-2xl bg-white p-3.5 border border-navy/10 hover:border-royal transition-all group"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-royal/10 text-royal group-hover:bg-royal group-hover:text-white transition">
                  <Phone className="size-5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-navy block">
                    Hotline Miễn Cước 24/7
                  </span>
                  <span className="text-sm font-extrabold text-royal">
                    1-800-RYVO (1800 7986)
                  </span>
                </div>
              </a>

              {/* Contact Form Link */}
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3.5 rounded-2xl bg-white p-3.5 border border-navy/10 hover:border-royal transition-all group"
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <HelpCircle className="size-5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-navy block">
                    Gửi Thư Liên Hệ & Yêu Cầu
                  </span>
                  <span className="text-[11px] text-navy/60">
                    Phản hồi qua email trong vòng 24 giờ
                  </span>
                </div>
                <ExternalLink className="size-4 text-navy/40" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


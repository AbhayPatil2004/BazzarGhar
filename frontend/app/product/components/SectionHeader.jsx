"use client";

import Link from "next/link";

const colorMap = {
  "text-rose-500":    { border: "border-rose-200/50",   bg: "bg-rose-50/50",   hoverBorder: "hover:border-rose-300",   text: "text-rose-600",   hoverText: "hover:text-rose-700",   fill: "bg-rose-100/40",   ring: "focus:ring-rose-100/50" },
  "text-purple-500":  { border: "border-purple-200/50", bg: "bg-purple-50/50", hoverBorder: "hover:border-purple-300", text: "text-purple-600", hoverText: "hover:text-purple-700", fill: "bg-purple-100/40", ring: "focus:ring-purple-100/50" },
  "text-emerald-500": { border: "border-emerald-200/50",bg: "bg-emerald-50/50",hoverBorder: "hover:border-emerald-300",text: "text-emerald-600",hoverText: "hover:text-emerald-700",fill: "bg-emerald-100/40",ring: "focus:ring-emerald-100/50" },
  "text-red-500":     { border: "border-red-200/50",    bg: "bg-red-50/50",    hoverBorder: "hover:border-red-300",    text: "text-red-600",    hoverText: "hover:text-red-700",    fill: "bg-red-100/40",    ring: "focus:ring-red-100/50" },
  "text-indigo-500":  { border: "border-indigo-200/50", bg: "bg-indigo-50/50", hoverBorder: "hover:border-indigo-300", text: "text-indigo-600", hoverText: "hover:text-indigo-700", fill: "bg-indigo-100/40", ring: "focus:ring-indigo-100/50" },
};

const defaultColors = { border: "border-blue-200/50", bg: "bg-blue-50/50", hoverBorder: "hover:border-blue-300", text: "text-blue-600", hoverText: "hover:text-blue-700", fill: "bg-blue-100/40", ring: "focus:ring-blue-100/50" };

export default function SectionHeader({ badge, badgeIcon: Icon, badgeColor, title, seeAllHref, rightSlot }) {
  const c = colorMap[badgeColor] || defaultColors;

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {/* Accent icon circle */}
        {Icon && (
          <div className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-xl ${c.bg} border ${c.border}`}>
            <Icon size={18} className={badgeColor} />
          </div>
        )}
        <div>
          <p className={`text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-0.5 flex items-center gap-1 ${badgeColor}`}>
            {Icon && <span className="sm:hidden"><Icon size={10} /></span>} {badge}
          </p>
          <h2
            className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-500 leading-tight tracking-tight"
            style={{ fontSize: "clamp(1.15rem, 3vw, 1.7rem)" }}
          >
            {title}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Right slot for arrows etc. */}
        {rightSlot}
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className={`relative group text-[11px] sm:text-xs font-bold ${c.text} border ${c.border} ${c.bg} px-3 sm:px-4 py-1.5 sm:py-2 rounded-full whitespace-nowrap overflow-hidden transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md ${c.hoverBorder} ${c.hoverText} active:scale-95 ${c.ring}`}
          >
            <span className="relative z-10 flex items-center gap-1">See all <span className="group-hover:translate-x-1 transition-transform duration-300">→</span></span>
            <div className={`absolute inset-0 ${c.fill} translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out`} />
          </Link>
        )}
      </div>
    </div>
  );
}

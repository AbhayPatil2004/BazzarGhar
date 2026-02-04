"use client";

import { ImageIcon, Tag, FileText, Layers } from "lucide-react";

const guidelines = [
  {
    icon: ImageIcon,
    title: "High Quality Images",
    desc: "Upload clear, well-lit product images for better visibility",
  },
  {
    icon: Tag,
    title: "Correct Pricing",
    desc: "Set accurate price and stock to avoid order issues",
  },
  {
    icon: FileText,
    title: "Clear Description",
    desc: "Write short and honest product details",
  },
  {
    icon: Layers,
    title: "Right Category",
    desc: "Choose the most relevant category for your product",
  },
];

export default function QuickGuidelines() {
  return (
    <div className="mb-8 mx-4 md:mx-10 rounded-2xl border bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm">
      {/* Header */}
      <h3 className="mb-6 text-xl font-semibold text-gray-900">
        Quick Guidelines
      </h3>

      {/* Guidelines Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {guidelines.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-3 rounded-xl border bg-white p-4 transition hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
                <Icon size={18} />
              </div>

              <div>
                <p className="font-medium text-gray-900">
                  {item.title}
                </p>
                <p className="text-sm text-gray-600">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

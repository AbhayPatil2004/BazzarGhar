"use client";

import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-16">
            <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">

                {/* ---------- About ---------- */}
                <div>
                    <h3 className="text-white font-semibold text-lg mb-3">
                        AURAstore
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                        AURAstore is a multi-vendor ecommerce platform where users can
                        buy products and sellers can open their own online stores.
                    </p>

                    <ul className="space-y-2 text-sm">
                        <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                        <li><Link href="/how-it-works" className="hover:text-white">How It Works</Link></li>
                        <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                        <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                    </ul>
                </div>

                {/* ---------- Support ---------- */}
                <div>
                    <h3 className="text-white font-semibold text-lg mb-3">
                        Support
                    </h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                        <li><Link href="/contact" className="hover:text-white">Contact Support</Link></li>
                        <li><Link href="/faq" className="hover:text-white">FAQs</Link></li>
                        <li><Link href="/returns" className="hover:text-white">Returns & Refunds</Link></li>
                        <li><Link href="/report" className="hover:text-white">Report a Product</Link></li>
                    </ul>
                </div>

                {/* ---------- Legal ---------- */}
                <div>
                    <h3 className="text-white font-semibold text-lg mb-3">
                        Legal
                    </h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/terms" className="hover:text-white">Terms & Conditions</Link></li>
                        <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                        <li><Link href="/cookies" className="hover:text-white">Cookie Policy</Link></li>
                        <li><Link href="/seller-policy" className="hover:text-white">Seller Policy</Link></li>
                        <li><Link href="/buyer-protection" className="hover:text-white">Buyer Protection</Link></li>
                    </ul>
                </div>

                {/* ---------- Social & Trust ---------- */}
                <div>
                    <h3 className="text-white font-semibold text-lg mb-3">
                        Connect With Us
                    </h3>

                    <div className="flex gap-4 mb-4">
                        <a href="#" className="hover:text-white">Twitter</a>
                        <a href="#" className="hover:text-white">Instagram</a>
                        <a href="#" className="hover:text-white">LinkedIn</a>
                    </div>

                    <div className="text-sm text-gray-400 space-y-2">
                        <p>🔒 Secure Payments</p>
                        <p>🛡 Buyer Protection Guaranteed</p>
                        <p>🏪 Trusted Sellers Platform</p>
                    </div>
                </div>

            </div>
            {/* ---------- Creator Credit ---------- */}
            <div className="border-t border-gray-800 py-8 text-center text-gray-400">
                <p className="mb-3 text-base sm:text-lg">
                    Built by{" "}
                    <span className="text-white font-semibold">
                        Abhay
                    </span>
                </p>

                <div className="flex justify-center gap-8">
                    <a
                        href="https://github.com/AbhayPatil2004"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-white transition text-sm sm:text-base"
                    >
                        <Github size={20} />
                        GitHub
                    </a>

                    <a
                        href="https://www.linkedin.com/in/abhay-patil-0857a93a3/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-white transition text-sm sm:text-base"
                    >
                        <Linkedin size={20} />
                        LinkedIn
                    </a>
                </div>
            </div>
            {/* ---------- Bottom Bar ---------- */}
            <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} AURAstore. All rights reserved.
            </div>
        </footer>
    );
}

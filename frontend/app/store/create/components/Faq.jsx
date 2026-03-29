"use client";

import { useState } from "react";

function Faq() {
    const faqs = [
        {
            question: "Is it free to open a store on  BazzarGhar?",
            answer:
                "Yes. Opening a store on  Store is completely free. There are no joining fees or hidden charges.",
        },
        {
            question: "How long does store verification take?",
            answer:
                "Our admin team usually verifies stores within 24–48 hours after you submit the required details.",
        },
        {
            question: "Do I need GST to sell on  Bazzarghar?",
            answer:
                "GST is not mandatory for all sellers. It depends on the type of products you sell and applicable government regulations.",
        },
        {
            question: "How do I receive my payments?",
            answer:
                "All earnings are transferred directly to your registered bank account through secure payment systems.",
        },
        {
            question: "Can I sell only to nearby customers?",
            answer:
                "Yes.  Store allows you to focus on local customers first, with the option to expand your reach later.",
        },
        {
            question: "What products are not allowed to sell?",
            answer:
                "Illegal, counterfeit, or restricted items are not allowed. All products must comply with local laws and platform policies.",
        },
    ];

    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section className="bg-gradient-to-b from-white to-blue-50 py-16 px-6 sm:px-10">
            <div className="max-w-4xl mx-auto">

                {/* Heading */}
                <div className="mb-12">
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                        Frequently Asked <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">Questions</span>
                    </h2>
                    <p className="mt-4 text-gray-600 text-base">
                        Everything you need to know before opening your store on BazzarGhar.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div
                                key={index}
                                className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-white hover:shadow-md hover:border-blue-300 transition-all duration-300"
                            >
                                <button
                                    onClick={() =>
                                        setOpenIndex(isOpen ? null : index)
                                    }
                                    className="w-full flex justify-between items-center px-8 py-5 text-left hover:bg-blue-50 transition-colors"
                                >
                                    <span className="font-bold text-gray-900 text-lg">
                                        {faq.question}
                                    </span>
                                    <span className={`text-2xl text-blue-600 font-bold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                        {isOpen ? "−" : "+"}
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="px-8 pb-5 text-sm text-gray-700 leading-relaxed border-t border-blue-200 bg-white bg-opacity-50">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}

export default Faq;

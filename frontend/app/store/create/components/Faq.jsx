"use client";

import { useState } from "react";

function Faq() {
    const faqs = [
        {
            question: "Is it free to open a store on Aura Store?",
            answer:
                "Yes. Opening a store on Aura Store is completely free. There are no joining fees or hidden charges.",
        },
        {
            question: "How long does store verification take?",
            answer:
                "Our admin team usually verifies stores within 24–48 hours after you submit the required details.",
        },
        {
            question: "Do I need GST to sell on Aura Store?",
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
                "Yes. Aura Store allows you to focus on local customers first, with the option to expand your reach later.",
        },
        {
            question: "What products are not allowed to sell?",
            answer:
                "Illegal, counterfeit, or restricted items are not allowed. All products must comply with local laws and platform policies.",
        },
    ];

    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section className="bg-gray-50 py-14 px-6 sm:px-10">
            <div className="max-w-4xl mx-auto">

                {/* Heading */}
                <div className="mb-10">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                        Frequently Asked Questions
                    </h2>
                    <p className="mt-3 text-gray-600">
                        Everything you need to know before opening your store on Aura Store.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div
                                key={index}
                                className="rounded-2xl border border-gray-200 bg-white"
                            >
                                <button
                                    onClick={() =>
                                        setOpenIndex(isOpen ? null : index)
                                    }
                                    className="w-full flex justify-between items-center 
                                    px-6 py-4 text-left"
                                >
                                    <span className="font-medium text-gray-900">
                                        {faq.question}
                                    </span>
                                    <span className="text-xl text-purple-700">
                                        {isOpen ? "−" : "+"}
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">
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

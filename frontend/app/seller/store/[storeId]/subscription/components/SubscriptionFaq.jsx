import React from "react";

export function SubscriptionFAQ() {
  const faqs = [
    {
      q: "Can I cancel my subscription anytime?",
      a: "Yes, you can cancel your subscription anytime from your dashboard without any extra charges.",
    },
    {
      q: "Can I upgrade my plan later?",
      a: "Yes, you can upgrade or downgrade your subscription at any time based on your needs.",
    },
    {
      q: "What happens when my subscription expires?",
      a: "Your store will continue to exist, but premium features will be disabled until you renew your plan.",
    },
    {
      q: "Are payments secure?",
      a: "Yes, all payments are securely processed through Razorpay with industry-standard encryption.",
    },
  ];

  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

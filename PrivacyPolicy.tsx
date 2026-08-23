export default function PrivacyPolicy() {
  const sections = [
    {
      title: 'Information We Collect',
      content:
        'We collect information you provide directly to us when you create an account, submit a loan application, or contact our support team. This includes your name, email address, phone number, employment and income details, financial information, and loan-related information.',
    },
    {
      title: 'How We Use Your Information',
      content:
        'We use the information we collect to process your loan applications, verify your identity, assess your eligibility, communicate with you about your applications, and provide you with the services available through our platform.',
    },
    {
      title: 'How We Protect Your Information',
      content:
        'We take reasonable measures to protect your personal information from unauthorized access, alteration, or disclosure. Your data is stored securely and access is restricted to authorized personnel only.',
    },
    {
      title: 'Information Sharing',
      content:
        'We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted partners who assist us in operating our platform, conducting our business, or serving you, so long as those parties agree to keep this information confidential.',
    },
    {
      title: 'Cookies and Tracking Technologies',
      content:
        'We may use cookies and similar tracking technologies to enhance your experience on our platform, analyze usage patterns, and improve our services. You can control the use of cookies through your browser settings.',
    },
    {
      title: 'Your Rights',
      content:
        'You have the right to access, update, or delete your personal information. You may also request that we restrict or stop certain processing of your data. To exercise these rights, please contact our support team.',
    },
    {
      title: 'Changes to This Policy',
      content:
        'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this page periodically.',
    },
  ];

  return (
    <div className="animate-fade-in">
      <section className="border-b border-slate-200 bg-white py-16">
        <div className="section-container">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Your privacy is important to us. This policy explains how we collect, use, and protect
              your personal information when you use LoanEase.
            </p>
            <p className="mt-4 text-sm text-slate-400">Last updated: August 2026</p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="section-container">
          <div className="mx-auto max-w-3xl space-y-6">
            {sections.map((section, i) => (
              <div key={section.title} className="card p-6 sm:p-8">
                <h2 className="font-display text-lg font-semibold text-slate-900">
                  {i + 1}. {section.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

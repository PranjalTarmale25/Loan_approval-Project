export default function TermsConditions() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content:
        'By accessing and using LoanEase, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform.',
    },
    {
      title: 'Use of Our Services',
      content:
        'You may use our platform to create an account, submit loan applications, and track the status of your applications. You agree to provide accurate and complete information when submitting an application and to update your information as needed.',
    },
    {
      title: 'Eligibility',
      content:
        'To use our services, you must be at least 18 years of age and have the legal capacity to enter into a binding agreement. By submitting an application, you confirm that you meet these requirements.',
    },
    {
      title: 'Account Responsibilities',
      content:
        'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.',
    },
    {
      title: 'Loan Applications',
      content:
        'Submitting a loan application through our platform does not guarantee approval. All applications are reviewed based on the information provided. We reserve the right to approve or reject applications at our discretion.',
    },
    {
      title: 'Accuracy of Information',
      content:
        'You agree that all information you provide through our platform is accurate, current, and complete. Providing false or misleading information may result in the rejection of your application or the suspension of your account.',
    },
    {
      title: 'Limitation of Liability',
      content:
        'LoanEase is not liable for any indirect, incidental, or consequential damages arising from the use of our platform. Our services are provided on an "as is" basis without warranties of any kind.',
    },
    {
      title: 'Changes to These Terms',
      content:
        'We may revise these Terms and Conditions at any time. Updates will be posted on this page with an updated revision date. Your continued use of the platform after changes are posted constitutes acceptance of the revised terms.',
    },
  ];

  return (
    <div className="animate-fade-in">
      <section className="border-b border-slate-200 bg-white py-16">
        <div className="section-container">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Terms &amp; Conditions
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Please read these terms carefully before using LoanEase. These terms govern your use of
              our platform and services.
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

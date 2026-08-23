import { Link } from 'react-router-dom';
import Logo from './Logo';

const footerSections = [
  {
    heading: 'Company',
    links: [
      { label: 'Home', to: '/' },
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    heading: 'Loans',
    links: [
      { label: 'Personal Loan', to: '/dashboard/apply' },
      { label: 'Home Loan', to: '/dashboard/apply' },
      { label: 'Car Loan', to: '/dashboard/apply' },
      { label: 'Education Loan', to: '/dashboard/apply' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'Login', to: '/login' },
      { label: 'Register', to: '/register' },
      { label: 'Dashboard', to: '/dashboard' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms & Conditions', to: '/terms-conditions' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="section-container py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm font-medium text-slate-600">
              Simple. Secure. Convenient.
            </p>
          </div>
          {footerSections.map((section) => (
            <div key={section.heading}>
              <h3 className="text-sm font-semibold text-slate-900">{section.heading}</h3>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-500 transition-colors hover:text-sky-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} LoanEase. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

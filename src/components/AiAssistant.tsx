import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const suggestedQuestions = [
  'What types of loans can I apply for?',
  'How do I check my application status?',
  'What information do I need to apply?',
  'How long does the process take?',
];

const knowledgeBase: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'greet'],
    answer:
      "Hello! I'm the LoanEase assistant. I can help you with questions about loans, the application process, your account, and more. What would you like to know?",
  },
  {
    keywords: ['type', 'types', 'kind', 'kinds', 'loan', 'loans', 'available', 'offer', 'offer'],
    answer:
      'LoanEase offers four types of loans:\n\n1. Personal Loan - Flexible financing for your personal needs.\n2. Home Loan - Financing options for your home purchase.\n3. Car Loan - Get closer to owning your next vehicle.\n4. Education Loan - Financial support for your education.\n\nYou can apply for any of these by clicking "Apply Now" or visiting the Apply for a Loan page.',
  },
  {
    keywords: ['apply', 'application', 'how do i', 'start', 'begin', 'register', 'sign up'],
    answer:
      'To apply for a loan:\n\n1. Click "Apply Now" or go to the Apply for a Loan page.\n2. Create an account if you don\'t have one, or log in.\n3. Complete the multi-step application form with your personal, employment, financial, loan, credit, and property details.\n4. Review and submit your application.\n\nThe form is broken into 6 simple steps to make it easy to complete.',
  },
  {
    keywords: ['status', 'track', 'check', 'where', 'my application', 'dashboard'],
    answer:
      'You can check your application status anytime by:\n\n1. Logging into your account.\n2. Going to your Dashboard or the My Applications page.\n3. There you will see all your applications with their current status (Pending, Approved, or Rejected).\n\nYou can also filter by status, loan type, and date.',
  },
  {
    keywords: ['information', 'need', 'required', 'documents', 'details', 'what do i need'],
    answer:
      'To complete your loan application, you will need:\n\n- Personal Information: Full name, gender, age, marital status, number of dependents.\n- Employment & Income: Employment type, annual income.\n- Financial Information: Monthly obligations, savings, investment portfolio value.\n- Loan Details: Loan amount, term, and purpose.\n- Credit Information: Previous loan experience, credit history, CIBIL score (300-900).\n- Property Information: Property ownership status.\n\nHaving this information ready before you start will make the process faster.',
  },
  {
    keywords: ['long', 'time', 'how long', 'process', 'take', 'duration', 'wait'],
    answer:
      'The time it takes to review an application varies depending on the loan type and the information provided. You can track the progress of your application from your dashboard throughout the entire process. Typically, you will see status updates as your application moves through each stage of review.',
  },
  {
    keywords: ['cibil', 'credit score', 'score', 'credit'],
    answer:
      'Your CIBIL score is a 3-digit number ranging from 300 to 900 that reflects your creditworthiness. A higher score generally improves your chances of loan approval. You can enter your CIBIL score in the Credit Information step of the application. If you don\'t know your score, you can check it through any credit bureau website.',
  },
  {
    keywords: ['pending', 'approved', 'rejected', 'review', 'status mean'],
    answer:
      'Application statuses on LoanEase:\n\n- Pending: Your application has been submitted and is waiting to be reviewed.\n- Under Review: Your application is currently being assessed by our team.\n- Approved: Your application has been approved.\n- Rejected: Your application was not approved at this time.\n\nYou can track all statuses from your dashboard.',
  },
  {
    keywords: ['contact', 'support', 'help', 'email', 'phone', 'reach'],
    answer:
      'You can reach our support team through the Contact page. We offer:\n\n- Email: support@loanease.com (responses within 24 hours)\n- Phone: +1 (800) 555-0190 (Mon-Fri, 9am-6pm)\n- Support hours: Monday to Friday, 9:00 AM - 6:00 PM EST\n\nWe\'re here to help with any questions about your loan application or account.',
  },
  {
    keywords: ['account', 'profile', 'edit', 'update', 'change'],
    answer:
      'You can manage your account from the Profile page after logging in. From there you can view and edit your full name, email, and gender. Click the "Edit Profile" button to make changes, then save when you\'re done.',
  },
  {
    keywords: ['secure', 'safe', 'privacy', 'data', 'security', 'protect'],
    answer:
      'At LoanEase, we take your security seriously. Your personal and application information is handled securely, and access to your data is restricted to authorized personnel only. You can read our full Privacy Policy on the Privacy Policy page for more details.',
  },
  {
    keywords: ['previous', 'past', 'history', 'old application', 'view all'],
    answer:
      'Yes, you can view all your past and current applications on the My Applications page. Simply log in and navigate to My Applications, where you can see a complete list with filters for status, loan type, and date.',
  },
  {
    keywords: ['eligibility', 'eligible', 'qualify', 'criteria', 'requirements'],
    answer:
      'Eligibility for a loan depends on several factors including your income, employment type, credit score, financial profile, and the loan amount you are requesting. Our team reviews each application individually. To improve your chances, make sure to provide accurate and complete information.',
  },
  {
    keywords: ['thank', 'thanks', 'great', 'awesome', 'good'],
    answer:
      "You're welcome! If you have any more questions, feel free to ask. I'm here to help with anything related to loans, your application, or the LoanEase platform.",
  },
];

function findAnswer(question: string): string {
  const lower = question.toLowerCase();
  for (const entry of knowledgeBase) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.answer;
    }
  }
  return "I'm not sure I have the exact answer to that, but I can help with questions about loan types, the application process, checking your application status, required information, eligibility, your account, and contacting support. Try asking about one of those topics, or visit our Contact page to reach our support team directly.";
}

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm the LoanEase AI Assistant. I can answer questions about loans, the application process, your account, and more. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  function handleSend(text?: string) {
    const question = (text ?? input).trim();
    if (!question) return;

    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const answer = findAnswer(question);
      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
      setTyping(false);
    }, 700);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg shadow-sky-600/30 transition-all hover:bg-sky-700 hover:shadow-xl"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
            AI
          </span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[32rem] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-sky-600 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-white">LoanEase Assistant</p>
                <p className="text-xs text-sky-100">Ask me anything about loans</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-sky-600 text-white'
                      : 'bg-white text-slate-700 shadow-sm ring-1 ring-slate-200'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {/* Suggested questions (shown only at start) */}
            {messages.length === 1 && !typing && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-medium text-slate-400">Suggested questions:</p>
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-left text-sm text-slate-600 transition-colors hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 bg-white p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white transition-colors hover:bg-sky-700 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

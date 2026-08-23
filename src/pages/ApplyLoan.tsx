import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Briefcase,
  Wallet,
  Landmark,
  CreditCard,
  Home,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Send,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

type FormState = {
  fullName: string;
  gender: string;
  age: string;
  maritalStatus: string;
  dependents: string;
  employmentType: string;
  annualIncome: string;
  monthlyObligations: string;
  savings: string;
  investmentValue: string;
  loanAmount: string;
  loanTerm: string;
  loanPurpose: string;
  previousLoan: string;
  creditHistory: string;
  cibilScore: string;
  propertyOwnership: string;
};

const initialForm: FormState = {
  fullName: '',
  gender: '',
  age: '',
  maritalStatus: '',
  dependents: '0',
  employmentType: '',
  annualIncome: '',
  monthlyObligations: '',
  savings: '',
  investmentValue: '',
  loanAmount: '',
  loanTerm: '',
  loanPurpose: '',
  previousLoan: '',
  creditHistory: '',
  cibilScore: '',
  propertyOwnership: '',
};

const selectOptions = {
  gender: ['Male', 'Female', 'Other'],
  maritalStatus: ['Single', 'Married', 'Divorced', 'Widowed'],
  dependents: ['0', '1', '2', '3', '4+'],
  employmentType: [
    'Salaried',
    'Self-Employed',
    'Business Owner',
    'Freelancer',
    'Unemployed',
  ],
  loanTerm: ['12', '24', '36', '48', '60', '84', '120', '180', '240'],
  loanPurpose: [
    'Personal',
    'Home Purchase',
    'Home Construction',
    'Vehicle Loan',
    'Education',
    'Business Expansion',
    'Debt Consolidation',
    'Medical',
  ],
  previousLoan: [
    'None',
    '1 Previous Loan',
    '2 Previous Loans',
    '3+ Previous Loans',
  ],
  creditHistory: [
    'Excellent',
    'Good',
    'Fair',
    'Poor',
    'No History',
  ],
  propertyOwnership: ['Owned', 'Mortgaged', 'Rented', 'None'],
};

const steps = [
  { title: 'Personal Information', icon: User },
  { title: 'Employment & Income', icon: Briefcase },
  { title: 'Financial Information', icon: Wallet },
  { title: 'Loan Details', icon: Landmark },
  { title: 'Credit Information', icon: CreditCard },
  { title: 'Property Information', icon: Home },
];

function FormField({
  label,
  children,
  error,
  htmlFor,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  htmlFor?: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="label-field">
        {label}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

function loanPurposeToType(purpose: string) {
  const map: Record<string, string> = {
    Personal: 'Personal Loan',
    'Home Purchase': 'Home Loan',
    'Home Construction': 'Home Loan',
    'Vehicle Loan': 'Car Loan',
    Education: 'Education Loan',
    'Business Expansion': 'Business Loan',
    'Debt Consolidation': 'Personal Loan',
    Medical: 'Personal Loan',
  };

  return map[purpose] || purpose;
}

/*
  AUTOMATIC LOAN APPROVAL RULES

  This is NOT Machine Learning.

  The application is approved/rejected using
  fixed business rules.
*/
function calculateApprovalStatus(
  form: FormState
): 'approved' | 'rejected' {
  const age = Number(form.age);
  const income = Number(form.annualIncome);
  const obligations = Number(form.monthlyObligations) || 0;
  const loanAmount = Number(form.loanAmount);
  const cibil = Number(form.cibilScore);

  // Rule 1: Minimum age
  if (age < 21) {
    return 'rejected';
  }

  // Rule 2: Maximum age
  if (age > 65) {
    return 'rejected';
  }

  // Rule 3: Minimum annual income
  if (income < 300000) {
    return 'rejected';
  }

  // Rule 4: Minimum CIBIL score
  if (cibil < 650) {
    return 'rejected';
  }

  // Rule 5: Loan amount should not exceed
  // 5 times annual income
  if (loanAmount > income * 5) {
    return 'rejected';
  }

  // Rule 6: Monthly obligations should not
  // exceed 50% of monthly income
  const monthlyIncome = income / 12;

  if (obligations > monthlyIncome * 0.5) {
    return 'rejected';
  }

  // Rule 7: Poor credit history is rejected
  if (
    form.creditHistory === 'Poor' ||
    form.creditHistory === 'No History'
  ) {
    return 'rejected';
  }

  // If all rules pass
  return 'approved';
}

export default function ApplyLoan() {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [form, setForm] = useState<FormState>(initialForm);

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [appId, setAppId] = useState('');
  const [appDate, setAppDate] = useState('');

  // NEW: Store automatically calculated result
  const [approvalStatus, setApprovalStatus] = useState<
    'approved' | 'rejected' | ''
  >('');

  function handleChange(
    field: keyof FormState,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  }

  function validateStep(
    currentStep: number
  ): Partial<Record<keyof FormState, string>> {
    const next: Partial<Record<keyof FormState, string>> = {};

    // Step 0
    if (currentStep === 0) {
      if (!form.fullName.trim()) {
        next.fullName = 'Please enter your full name.';
      }

      if (!form.gender) {
        next.gender = 'Please select your gender.';
      }

      if (!form.age) {
        next.age = 'Please enter your age.';
      } else if (
        Number(form.age) < 18 ||
        Number(form.age) > 100
      ) {
        next.age = 'Age must be between 18 and 100.';
      }

      if (!form.maritalStatus) {
        next.maritalStatus =
          'Please select marital status.';
      }
    }

    // Step 1
    if (currentStep === 1) {
      if (!form.employmentType) {
        next.employmentType =
          'Please select employment type.';
      }

      if (!form.annualIncome) {
        next.annualIncome =
          'Please enter your annual income.';
      } else if (Number(form.annualIncome) <= 0) {
        next.annualIncome =
          'Income must be greater than 0.';
      }
    }

    // Step 3
    if (currentStep === 3) {
      if (!form.loanAmount) {
        next.loanAmount =
          'Please enter the loan amount.';
      } else if (Number(form.loanAmount) <= 0) {
        next.loanAmount =
          'Loan amount must be greater than 0.';
      }

      if (!form.loanTerm) {
        next.loanTerm =
          'Please select a loan term.';
      }

      if (!form.loanPurpose) {
        next.loanPurpose =
          'Please select a loan purpose.';
      }
    }

    // Step 4
    if (currentStep === 4) {
      if (!form.cibilScore) {
        next.cibilScore =
          'Please enter your CIBIL score.';
      } else if (
        Number(form.cibilScore) < 300 ||
        Number(form.cibilScore) > 900
      ) {
        next.cibilScore =
          'CIBIL score must be between 300 and 900.';
      }
    }

    // Step 5
    if (currentStep === 5) {
      if (!form.propertyOwnership) {
        next.propertyOwnership =
          'Please select property ownership.';
      }
    }

    return next;
  }

  function handleNext() {
    const next = validateStep(step);

    setErrors(next);

    if (Object.keys(next).length === 0) {
      setStep((s) =>
        Math.min(s + 1, steps.length - 1)
      );

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }

  function handleBack() {
    setErrors({});

    setStep((s) => Math.max(s - 1, 0));

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const next = validateStep(step);

    setErrors(next);

    if (Object.keys(next).length > 0) {
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      // Get logged-in user
      const { data: userData } =
        await supabase.auth.getUser();

      if (!userData.user) {
        setSubmitError(
          'You must be signed in to submit an application.'
        );

        setSubmitting(false);
        return;
      }

      // Find customer
      const { data: customer } = await supabase
        .from('customers')
        .select('customer_id')
        .eq('user_id', userData.user.id)
        .maybeSingle();

      if (!customer) {
        setSubmitError(
          'Customer profile not found. Please complete your profile first.'
        );

        setSubmitting(false);
        return;
      }

      const loanType = loanPurposeToType(
        form.loanPurpose
      );

      /*
        AUTOMATIC APPROVAL/REJECTION

        No ML is used here.
      */
      const calculatedStatus =
        calculateApprovalStatus(form);

      // Save result for success screen
      setApprovalStatus(calculatedStatus);

      // Insert application into Supabase
      const { data, error: insertError } =
        await supabase
          .from('loan_applications')
          .insert({
            customer_id: customer.customer_id,

            full_name: form.fullName.trim(),
            gender: form.gender,
            age: Number(form.age),
            marital_status: form.maritalStatus,

            no_of_dependents: form.dependents,

            employment_type: form.employmentType,
            annual_income: Number(form.annualIncome),

            monthly_obligations:
              Number(form.monthlyObligations) || 0,

            savings:
              Number(form.savings) || 0,

            investment_portfolio_value:
              Number(form.investmentValue) || 0,

            loan_amount: Number(form.loanAmount),
            loan_term: Number(form.loanTerm),

            loan_purpose: form.loanPurpose,
            loan_type: loanType,

            previous_loan_experience:
              form.previousLoan || null,

            credit_history:
              form.creditHistory || null,

            cibil_score: Number(form.cibilScore),

            property_ownership:
              form.propertyOwnership,

            // IMPORTANT:
            // Automatically approved/rejected
            approval_status: calculatedStatus,
          })
          .select(
            'application_id, application_date'
          )
          .single();

      if (insertError) {
        setSubmitError(insertError.message);
        setSubmitting(false);
        return;
      }

      setAppId(
        data.application_id
          .slice(0, 8)
          .toUpperCase()
      );

      setAppDate(
        data.application_date ||
          new Date()
            .toISOString()
            .split('T')[0]
      );

      setSubmitted(true);

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = (
    field: keyof FormState
  ) =>
    `input-field ${
      errors[field]
        ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20'
        : ''
    }`;

  /*
    SUCCESS SCREEN
  */
  if (submitted) {
    const isApproved =
      approvalStatus === 'approved';

    return (
      <div className="animate-fade-in p-6 lg:p-8">
        <div className="mx-auto max-w-xl">

          {submitError && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />

              <p className="text-sm text-rose-700">
                {submitError}
              </p>
            </div>
          )}

          <div className="card p-8 text-center">

            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                isApproved
                  ? 'bg-emerald-50'
                  : 'bg-rose-50'
              }`}
            >
              <CheckCircle2
                className={`h-8 w-8 ${
                  isApproved
                    ? 'text-emerald-600'
                    : 'text-rose-600'
                }`}
              />
            </div>

            <h2 className="mt-5 font-display text-2xl font-bold text-slate-900">
              Application Submitted Successfully
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your loan application has been processed
              automatically based on the eligibility
              rules.
            </p>

            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5 text-left">
              <dl className="space-y-3">

                <div className="flex justify-between text-sm">
                  <dt className="text-slate-500">
                    Application ID
                  </dt>

                  <dd className="font-semibold text-slate-900">
                    {appId}
                  </dd>
                </div>

                <div className="flex justify-between text-sm">
                  <dt className="text-slate-500">
                    Application Date
                  </dt>

                  <dd className="font-semibold text-slate-900">
                    {appDate}
                  </dd>
                </div>

                <div className="flex justify-between text-sm">
                  <dt className="text-slate-500">
                    Loan Type
                  </dt>

                  <dd className="font-semibold text-slate-900">
                    {loanPurposeToType(
                      form.loanPurpose
                    )}
                  </dd>
                </div>

                <div className="flex justify-between text-sm">
                  <dt className="text-slate-500">
                    Loan Amount
                  </dt>

                  <dd className="font-semibold text-slate-900">
                    {new Intl.NumberFormat(
                      'en-IN',
                      {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0,
                      }
                    ).format(
                      Number(form.loanAmount) || 0
                    )}
                  </dd>
                </div>

                <div className="flex justify-between text-sm">
                  <dt className="text-slate-500">
                    Current Status
                  </dt>

                  <dd>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                        isApproved
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                          : 'bg-rose-50 text-rose-700 ring-rose-600/20'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isApproved
                            ? 'bg-emerald-500'
                            : 'bg-rose-500'
                        }`}
                      />

                      {isApproved
                        ? 'Approved'
                        : 'Rejected'}
                    </span>
                  </dd>
                </div>

              </dl>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">

              <button
                onClick={() =>
                  navigate(
                    '/dashboard/applications'
                  )
                }
                className="btn-primary"
              >
                <Eye className="h-4 w-4" />
                View Application
              </button>

              <button
                onClick={() => {
                  setForm(initialForm);
                  setSubmitted(false);
                  setStep(0);
                  setApprovalStatus('');
                  setErrors({});
                  setSubmitError('');
                }}
                className="btn-secondary"
              >
                Submit Another
              </button>

            </div>

          </div>
        </div>
      </div>
    );
  }

  const CurrentIcon = steps[step].icon;

  return (
    <div className="animate-fade-in">

      {/* Top bar */}
      <div className="border-b border-slate-200 bg-white px-6 py-5 lg:px-8">

        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
          Apply for a Loan
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Complete the form below to submit your
          application.
        </p>

      </div>

      {/* Stepper */}
      <div className="border-b border-slate-200 bg-white px-6 py-5 lg:px-8">

        <div className="mx-auto max-w-4xl">

          <div className="flex items-center justify-between">

            {steps.map((s, i) => {

              const StepIcon = s.icon;

              const isComplete = i < step;
              const isActive = i === step;

              return (
                <div
                  key={s.title}
                  className="flex flex-1 items-center"
                >

                  <div className="flex flex-col items-center gap-2">

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                        isActive
                          ? 'bg-sky-600 text-white'
                          : isComplete
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >

                      {isComplete ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <StepIcon
                          className="h-5 w-5"
                          strokeWidth={2}
                        />
                      )}

                    </div>

                    <span
                      className={`hidden text-xs font-medium sm:block ${
                        isActive
                          ? 'text-sky-600'
                          : isComplete
                          ? 'text-emerald-600'
                          : 'text-slate-400'
                      }`}
                    >
                      {s.title}
                    </span>

                  </div>

                  {i < steps.length - 1 && (
                    <div
                      className={`mx-2 h-0.5 flex-1 rounded-full transition-colors ${
                        i < step
                          ? 'bg-emerald-500'
                          : 'bg-slate-200'
                      }`}
                    />
                  )}

                </div>
              );
            })}

          </div>

          <p className="mt-4 text-center text-sm font-medium text-slate-500">
            Step {step + 1} of {steps.length}
          </p>

        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6 p-6 lg:p-8"
      >

        <div className="mx-auto max-w-3xl">

          <div className="card p-6 sm:p-7">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-600/10">

                <CurrentIcon
                  className="h-5 w-5"
                  strokeWidth={2}
                />

              </div>

              <div>

                <span className="font-display text-xs font-bold text-sky-600">
                  STEP {step + 1} OF {steps.length}
                </span>

                <h2 className="font-display text-base font-semibold text-slate-900">
                  {steps[step].title}
                </h2>

              </div>

            </div>

            {/* Step 0 */}
            {step === 0 && (
              <div className="grid gap-5 sm:grid-cols-2">

                <FormField
                  label="Full Name *"
                  htmlFor="full-name"
                  error={errors.fullName}
                >
                  <input
                    id="full-name"
                    type="text"
                    className={inputClass('fullName')}
                    value={form.fullName}
                    onChange={(e) =>
                      handleChange(
                        'fullName',
                        e.target.value
                      )
                    }
                    placeholder="John Doe"
                  />
                </FormField>

                <FormField
                  label="Gender *"
                  error={errors.gender}
                >
                  <select
                    className={inputClass('gender')}
                    value={form.gender}
                    onChange={(e) =>
                      handleChange(
                        'gender',
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select gender
                    </option>

                    {selectOptions.gender.map(
                      (o) => (
                        <option
                          key={o}
                          value={o}
                        >
                          {o}
                        </option>
                      )
                    )}

                  </select>
                </FormField>

                <FormField
                  label="Age *"
                  htmlFor="age"
                  error={errors.age}
                >
                  <input
                    id="age"
                    type="number"
                    className={inputClass('age')}
                    value={form.age}
                    onChange={(e) =>
                      handleChange(
                        'age',
                        e.target.value
                      )
                    }
                    placeholder="25"
                  />
                </FormField>

                <FormField
                  label="Marital Status *"
                  error={errors.maritalStatus}
                >
                  <select
                    className={inputClass(
                      'maritalStatus'
                    )}
                    value={form.maritalStatus}
                    onChange={(e) =>
                      handleChange(
                        'maritalStatus',
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select status
                    </option>

                    {selectOptions.maritalStatus.map(
                      (o) => (
                        <option
                          key={o}
                          value={o}
                        >
                          {o}
                        </option>
                      )
                    )}

                  </select>
                </FormField>

                <FormField
                  label="Number of Dependents"
                  error={errors.dependents}
                >
                  <select
                    className={inputClass(
                      'dependents'
                    )}
                    value={form.dependents}
                    onChange={(e) =>
                      handleChange(
                        'dependents',
                        e.target.value
                      )
                    }
                  >
                    {selectOptions.dependents.map(
                      (o) => (
                        <option
                          key={o}
                          value={o}
                        >
                          {o}
                        </option>
                      )
                    )}
                  </select>
                </FormField>

              </div>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <div className="grid gap-5 sm:grid-cols-2">

                <FormField
                  label="Employment Type *"
                  error={errors.employmentType}
                >
                  <select
                    className={inputClass(
                      'employmentType'
                    )}
                    value={form.employmentType}
                    onChange={(e) =>
                      handleChange(
                        'employmentType',
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select type
                    </option>

                    {selectOptions.employmentType.map(
                      (o) => (
                        <option
                          key={o}
                          value={o}
                        >
                          {o}
                        </option>
                      )
                    )}

                  </select>
                </FormField>

                <FormField
                  label="Annual Income (Rs) *"
                  htmlFor="annual-income"
                  error={errors.annualIncome}
                >
                  <input
                    id="annual-income"
                    type="number"
                    className={inputClass(
                      'annualIncome'
                    )}
                    value={form.annualIncome}
                    onChange={(e) =>
                      handleChange(
                        'annualIncome',
                        e.target.value
                      )
                    }
                    placeholder="e.g. 800000"
                  />
                </FormField>

              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="grid gap-5 sm:grid-cols-2">

                <FormField
                  label="Monthly Obligations (Rs)"
                  htmlFor="monthly-obligations"
                >
                  <input
                    id="monthly-obligations"
                    type="number"
                    className={inputClass(
                      'monthlyObligations'
                    )}
                    value={
                      form.monthlyObligations
                    }
                    onChange={(e) =>
                      handleChange(
                        'monthlyObligations',
                        e.target.value
                      )
                    }
                    placeholder="e.g. 25000"
                  />
                </FormField>

                <FormField
                  label="Savings (Rs)"
                  htmlFor="savings"
                >
                  <input
                    id="savings"
                    type="number"
                    className={inputClass(
                      'savings'
                    )}
                    value={form.savings}
                    onChange={(e) =>
                      handleChange(
                        'savings',
                        e.target.value
                      )
                    }
                    placeholder="e.g. 500000"
                  />
                </FormField>

                <FormField
                  label="Investment Portfolio Value (Rs)"
                  htmlFor="investment-value"
                >
                  <input
                    id="investment-value"
                    type="number"
                    className={inputClass(
                      'investmentValue'
                    )}
                    value={
                      form.investmentValue
                    }
                    onChange={(e) =>
                      handleChange(
                        'investmentValue',
                        e.target.value
                      )
                    }
                    placeholder="e.g. 300000"
                  />
                </FormField>

              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="grid gap-5 sm:grid-cols-2">

                <FormField
                  label="Loan Amount (Rs) *"
                  htmlFor="loan-amount"
                  error={errors.loanAmount}
                >
                  <input
                    id="loan-amount"
                    type="number"
                    className={inputClass(
                      'loanAmount'
                    )}
                    value={form.loanAmount}
                    onChange={(e) =>
                      handleChange(
                        'loanAmount',
                        e.target.value
                      )
                    }
                    placeholder="e.g. 2000000"
                  />
                </FormField>

                <FormField
                  label="Loan Term (months) *"
                  error={errors.loanTerm}
                >
                  <select
                    className={inputClass(
                      'loanTerm'
                    )}
                    value={form.loanTerm}
                    onChange={(e) =>
                      handleChange(
                        'loanTerm',
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select term
                    </option>

                    {selectOptions.loanTerm.map(
                      (o) => (
                        <option
                          key={o}
                          value={o}
                        >
                          {o} months
                        </option>
                      )
                    )}

                  </select>
                </FormField>

                <FormField
                  label="Loan Purpose *"
                  error={errors.loanPurpose}
                >
                  <select
                    className={inputClass(
                      'loanPurpose'
                    )}
                    value={form.loanPurpose}
                    onChange={(e) =>
                      handleChange(
                        'loanPurpose',
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select purpose
                    </option>

                    {selectOptions.loanPurpose.map(
                      (o) => (
                        <option
                          key={o}
                          value={o}
                        >
                          {o}
                        </option>
                      )
                    )}

                  </select>
                </FormField>

              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div className="grid gap-5 sm:grid-cols-2">

                <FormField
                  label="Previous Loan Experience"
                  error={errors.previousLoan}
                >
                  <select
                    className={inputClass(
                      'previousLoan'
                    )}
                    value={form.previousLoan}
                    onChange={(e) =>
                      handleChange(
                        'previousLoan',
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select experience
                    </option>

                    {selectOptions.previousLoan.map(
                      (o) => (
                        <option
                          key={o}
                          value={o}
                        >
                          {o}
                        </option>
                      )
                    )}

                  </select>
                </FormField>

                <FormField
                  label="Credit History"
                  error={errors.creditHistory}
                >
                  <select
                    className={inputClass(
                      'creditHistory'
                    )}
                    value={form.creditHistory}
                    onChange={(e) =>
                      handleChange(
                        'creditHistory',
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select history
                    </option>

                    {selectOptions.creditHistory.map(
                      (o) => (
                        <option
                          key={o}
                          value={o}
                        >
                          {o}
                        </option>
                      )
                    )}

                  </select>
                </FormField>

                <FormField
                  label="CIBIL Score (300-900) *"
                  htmlFor="cibil-score"
                  error={errors.cibilScore}
                >
                  <input
                    id="cibil-score"
                    type="number"
                    className={inputClass(
                      'cibilScore'
                    )}
                    value={form.cibilScore}
                    onChange={(e) =>
                      handleChange(
                        'cibilScore',
                        e.target.value
                      )
                    }
                    placeholder="e.g. 750"
                  />
                </FormField>

              </div>
            )}

            {/* Step 5 */}
            {step === 5 && (
              <div className="grid gap-5 sm:grid-cols-2">

                <FormField
                  label="Property Ownership *"
                  error={
                    errors.propertyOwnership
                  }
                >
                  <select
                    className={inputClass(
                      'propertyOwnership'
                    )}
                    value={
                      form.propertyOwnership
                    }
                    onChange={(e) =>
                      handleChange(
                        'propertyOwnership',
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select ownership
                    </option>

                    {selectOptions.propertyOwnership.map(
                      (o) => (
                        <option
                          key={o}
                          value={o}
                        >
                          {o}
                        </option>
                      )
                    )}

                  </select>
                </FormField>

              </div>
            )}

          </div>

          {/* Navigation buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">

            <button
              type="button"
              onClick={handleBack}
              className="btn-secondary"
              disabled={step === 0}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:opacity-60"
              >
                <Send className="h-4 w-4" />

                {submitting
                  ? 'Submitting...'
                  : 'Submit Application'}
              </button>
            )}

          </div>

        </div>
      </form>
    </div>
  );
}
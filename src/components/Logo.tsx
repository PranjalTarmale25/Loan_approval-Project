import { Landmark } from 'lucide-react';

type LogoProps = {
  className?: string;
  showText?: boolean;
  textClassName?: string;
};

export default function Logo({ className = '', showText = true, textClassName = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 shadow-sm">
        <Landmark className="h-5 w-5 text-white" strokeWidth={2.5} />
      </div>
      {showText && (
        <span className={`font-display text-lg font-bold tracking-tight text-slate-900 ${textClassName}`}>
          Loan<span className="text-sky-600">Ease</span>
        </span>
      )}
    </div>
  );
}

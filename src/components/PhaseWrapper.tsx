import { ReactNode } from "react";

interface PhaseWrapperProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const PhaseWrapper = ({ title, subtitle, children }: PhaseWrapperProps) => (
  <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
    <div className="mb-8">
      <h1 className="text-display font-heading font-bold text-primary">{title}</h1>
      {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
    </div>
    {children}
  </div>
);

export default PhaseWrapper;

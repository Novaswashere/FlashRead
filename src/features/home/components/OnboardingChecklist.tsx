import React from "react";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  actionLabel: string;
  actionPath: string;
}

export interface OnboardingChecklistProps {
  steps: OnboardingStep[];
}

export const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({ steps }) => {
  const router = useRouter();

  const completedCount = steps.filter((s) => s.isCompleted).length;
  const progressPercentage = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto bg-surface-container-low border border-border-subtle rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl transition-all hover:border-primary/50 relative overflow-hidden group">
      {/* Decorative gradient glowing bubble */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-500" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-500" />

      <div className="relative z-10">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">
          Getting Started
        </h2>
        <p className="text-on-surface-variant text-sm md:text-base mb-6">
          Welcome to FlashRead! Follow this quick setup checklist to import your first book and experience speed-reading.
        </p>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs md:text-sm font-medium text-on-surface-variant">
              Checklist Progress
            </span>
            <span className="text-xs md:text-sm font-semibold text-primary">
              {completedCount} of {steps.length} completed ({progressPercentage}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Checklist Steps */}
        <div className="flex flex-col gap-4">
          {steps.map((step) => (
            <div
              key={step.id}
              onClick={() => !step.isCompleted && router.push(step.actionPath)}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                step.isCompleted
                  ? "bg-surface-container border-emerald-500/20 opacity-80"
                  : "bg-surface-container-highest/30 border-border-subtle hover:border-primary/50 cursor-pointer hover:bg-surface-container-highest/60"
              }`}
            >
              <div className="mt-1 shrink-0">
                {step.isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <Circle className="h-5 w-5 text-outline group-hover:text-primary transition-colors" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-semibold text-sm md:text-base text-on-surface ${
                    step.isCompleted ? "line-through text-on-surface-variant" : ""
                  }`}
                >
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm text-on-surface-variant mt-1 leading-relaxed">
                  {step.description}
                </p>
              </div>
              {!step.isCompleted && (
                <button className="shrink-0 flex items-center gap-1 text-xs md:text-sm font-semibold text-primary hover:text-primary-hover active:scale-95 transition-all self-center">
                  <span>{step.actionLabel}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

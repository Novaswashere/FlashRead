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
    <div className="w-full max-w-2xl mx-auto glass-card rounded-xl p-lg md:p-xl relative overflow-hidden group">
      {/* Decorative accent glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-all duration-500" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-all duration-500" />

      <div className="relative z-10">
        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-sm">
          Getting Started
        </h2>
        <p className="font-body-md text-on-surface-variant mb-lg">
          Welcome to FlashRead! Follow these simple steps to start reading faster and more focused than ever before.
        </p>

        {/* Progress bar */}
        <div className="mb-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Checklist Progress
            </span>
            <span className="font-label-sm text-label-sm font-bold text-primary">
              {completedCount} of {steps.length} completed ({progressPercentage}%)
            </span>
          </div>
          <div className="w-full h-1 bg-surface-dim rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Checklist Steps */}
        <div className="flex flex-col gap-md">
          {steps.map((step) => (
            <div
              key={step.id}
              onClick={() => !step.isCompleted && router.push(step.actionPath)}
              className={`flex items-start gap-md p-md rounded-xl border transition-all ${
                step.isCompleted
                  ? "bg-surface-container border-primary/20 opacity-80"
                  : "bg-surface-container-lowest/40 border-outline-variant/30 hover:border-primary/50 cursor-pointer hover:bg-surface-container-lowest/70"
              }`}
            >
              <div className="mt-1 shrink-0">
                {step.isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 text-outline group-hover:text-primary transition-colors" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-label-md text-label-md font-bold text-on-surface ${
                    step.isCompleted ? "line-through text-on-surface-variant" : ""
                  }`}
                >
                  {step.title}
                </h3>
                <p className="font-body-md text-on-surface-variant mt-1 leading-relaxed">
                  {step.description}
                </p>
              </div>
              {!step.isCompleted && (
                <button className="shrink-0 flex items-center gap-1 font-label-md text-label-md font-bold text-primary hover:opacity-80 active:scale-95 transition-all self-center">
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

type BookingStepIndicatorProps = {
  steps: string[];
  currentStep: number;
};

export default function BookingStepIndicator({ steps, currentStep }: BookingStepIndicatorProps) {
  return (
    <ol className="booking-progress" aria-label="Progres booking">
      {steps.map((step, index) => (
        <li
          aria-current={index === currentStep ? "step" : undefined}
          className={index === currentStep ? "is-current" : undefined}
          key={step}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}

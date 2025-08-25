export function Steps({ currentStep }: { currentStep: number }) {
  const steps = ["Basic Info", "Event Details", "Rules & Links"];

  return (
    <div className="relative flex items-center justify-between max-w-2xl mx-auto mb-8">
      {/* Connecting lines container */}
      <div className="absolute top-5 left-0 right-0 flex justify-center">
        <div className="h-[2px] w-full max-w-[80%] bg-gray-200">
          <div 
            className="h-full bg-blue-600 transition-all duration-300" 
            style={{ 
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
            }} 
          />
        </div>
      </div>

      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center relative z-10">
          <div
            className={`
              w-10 h-10 rounded-full flex items-center justify-center mb-2
              transition-colors duration-300 
              ${index + 1 <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200"}
            `}
          >
            {index + 1}
          </div>
          <span className="text-sm font-medium text-center">
            {step}
          </span>
        </div>
      ))}
    </div>
  );
}

"use client";

import React from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface Step {
  name: string;
  count: number;
  selectedCount: number;
}

interface StepperProps {
  steps: Step[];
  activeStep: number;
  onPrevious: () => void;
  onNext: () => void;
  onStepClick: (step: number) => void;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  activeStep,
  onStepClick,
}) => {
  return (
    <div className="relative">
      {/* Vertical Progress Line */}
      <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-gray-300">
        <motion.div
          className="absolute top-0 left-0 w-full bg-black"
          style={{
            height: `${((activeStep) / (steps.length - 1)) * 100}%`,
          }}
          initial={{ height: "0%" }}
          animate={{ height: `${((activeStep) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-8">
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;

          return (
            <div
              key={step.name}
              className={`relative pl-16 transition-all duration-300 ${
                isActive ? "opacity-100" : "opacity-100 hover:opacity-100"
              }`}
            >
              {/* Step Indicator */}
              <button
                onClick={() => onStepClick(index)}
                disabled={index > activeStep}
                className={`absolute left-0 w-12 h-12 rounded-xl flex items-center justify-center 
                          transition-all duration-300 z-20 ${
                            isCompleted
                              ? "bg-[#006400] text-white"
                              : isActive
                              ? "bg-white text-black border-2 border-black"
                              : "bg-gray-200 text-black"
                          }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </button>

              {/* Step Content */}
              <div
                className={`py-2 cursor-pointer ${
                  isActive ? "transform translate-x-2" : ""
                }`}
                onClick={() => onStepClick(index)}
              >
                <h3
                  className={`text-lg font-medium mb-1 ${
                    isCompleted ? "text-[#006400]" : "text-black"
                  }`}
                >
                  {step.name}
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={`font-medium ${
                      isCompleted ? "text-[#006400]" : "text-black"
                    }`}
                  >
                    {step.selectedCount}
                  </span>
                  <span className="text-gray-500">/</span>
                  <span className="text-gray-500">
                    {step.count}{" "}
                    {step.count === 1 ? "Auswahl" : "Auswahlmöglichkeiten"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
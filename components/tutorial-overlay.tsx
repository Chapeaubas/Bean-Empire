"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Coffee, Coins, Award, TrendingUp, ChevronRight, ChevronLeft, X } from "lucide-react"

interface TutorialOverlayProps {
  onComplete: () => void
  onSkip: () => void
}

export default function TutorialOverlay({ onComplete, onSkip }: TutorialOverlayProps) {
  const [step, setStep] = useState(1)
  const [isVisible, setIsVisible] = useState(true)

  const totalSteps = 5

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      completeOnboarding()
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const completeOnboarding = () => {
    setIsVisible(false)
    setTimeout(() => {
      onComplete()
    }, 500)
  }

  const skipOnboarding = () => {
    setIsVisible(false)
    setTimeout(() => {
      onSkip()
    }, 500)
  }

  const getStepContent = () => {
    switch (step) {
      case 1:
        return {
          title: "Welcome to $GRIND: Bean Empire!",
          description: "Build your coffee empire from a small cart to a global brand. Let's learn the basics!",
          icon: <Coffee className="h-12 w-12 text-amber-300" />,
        }
      case 2:
        return {
          title: "Buy Businesses",
          description: "Start by purchasing your first Coffee Cart. As you earn money, you can buy more businesses.",
          icon: <Coins className="h-12 w-12 text-amber-300" />,
        }
      case 3:
        return {
          title: "Collect Revenue",
          description:
            "Click 'Collect' when a business is ready to harvest its profits. Managers can automate this for you!",
          icon: <Award className="h-12 w-12 text-amber-300" />,
        }
      case 4:
        return {
          title: "Upgrade & Expand",
          description:
            "Invest in upgrades to increase your profits and speed. The more you upgrade, the faster you'll grow!",
          icon: <TrendingUp className="h-12 w-12 text-amber-300" />,
        }
      case 5:
        return {
          title: "Ready to Grind?",
          description: "That's all you need to know to get started. Your coffee empire awaits!",
          icon: <Coffee className="h-12 w-12 text-amber-300" />,
        }
      default:
        return {
          title: "Welcome!",
          description: "Let's get started with your coffee empire.",
          icon: <Coffee className="h-12 w-12 text-amber-300" />,
        }
    }
  }

  const content = getStepContent()

  return (
    <div
      className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="max-w-md w-full bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg p-6 border-2 border-amber-500 shadow-2xl">
        <button
          onClick={skipOnboarding}
          className="absolute top-2 right-2 text-amber-300 hover:text-amber-100"
          aria-label="Skip tutorial"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="bg-amber-900 p-4 rounded-full mb-4">{content.icon}</div>
          <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
          <p className="text-amber-200">{content.description}</p>
        </div>

        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
            className="border-amber-500 text-amber-300"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex space-x-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i + 1 === step ? "bg-amber-400" : "bg-amber-700"}`} />
            ))}
          </div>

          <Button variant="default" onClick={nextStep} className="bg-amber-500 hover:bg-amber-600">
            {step === totalSteps ? "Get Started" : "Next"}
            {step !== totalSteps && <ChevronRight className="h-4 w-4 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

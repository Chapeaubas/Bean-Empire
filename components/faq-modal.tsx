"use client"

import { Button } from "@/components/ui/button"
import { Coffee, X } from "lucide-react"

interface FAQModalProps {
  show: boolean
  onClose: () => void
}

export default function FAQModal({ show, onClose }: FAQModalProps) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-amber-800 to-amber-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-amber-700">
          <h2 className="text-xl font-bold text-amber-100 flex items-center">
            <Coffee className="mr-2 h-5 w-5" /> $GRIND: Bean Hustle - FAQ
          </h2>
          <Button variant="ghost" onClick={onClose} className="text-amber-200 hover:text-amber-100 hover:bg-amber-700">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 text-amber-100">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-amber-300 mb-2">What is $GRIND: Bean Hustle?</h3>
              <p>
                $GRIND: Bean Hustle is an idle coffee empire tycoon game where you start with a humble coffee cart and
                build your way up to a global coffee empire. Buy businesses, hire managers, upgrade your operations, and
                earn as much money as possible!
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-amber-300 mb-2">How do I play?</h3>
              <p className="mb-2">
                Start by buying and running your first coffee business. Click the "Start Production" button to begin
                making coffee, then collect your earnings when it's ready. Use those earnings to buy more businesses or
                upgrade existing ones.
              </p>
              <p>
                As you progress, you can hire managers to automate your businesses, purchase upgrades to increase
                profits, and eventually prestige to earn $GRIND beans for permanent bonuses.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-amber-300 mb-2">What are Managers?</h3>
              <p>
                Managers automate your businesses so they run and collect revenue without you having to click. Hire a
                manager for each business to fully automate your coffee empire!
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-amber-300 mb-2">What are Upgrades?</h3>
              <p>
                Upgrades improve your businesses by increasing their profit or speed. Each business has multiple
                upgrades available as you reach certain ownership levels.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-amber-300 mb-2">What is Prestige?</h3>
              <p className="mb-2">
                Prestiging allows you to reset your progress in exchange for $GRIND beans, which provide permanent
                bonuses to all future runs. The more money you've earned, the more $GRIND beans you'll receive.
              </p>
              <p>
                After prestiging, you'll start over with just your first coffee cart, but with the advantage of your
                $GRIND bean bonuses making progress faster.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-amber-300 mb-2">What is the Premium Shop?</h3>
              <p>
                The Premium Shop offers special items you can purchase with $GRIND beans. These items provide powerful
                permanent bonuses like doubling your speed, increasing profits, or making managers cheaper.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-amber-300 mb-2">Tips for Success</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Focus on buying managers for all your businesses to automate production</li>
                <li>Purchase upgrades when available to maximize profits</li>
                <li>Buy businesses in bulk (x10, x100, or Max) when you can afford it</li>
                <li>Prestige when your progress slows down to earn $GRIND beans</li>
                <li>Invest your $GRIND beans in prestige upgrades for permanent bonuses</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-amber-700 p-4 flex justify-end">
          <Button onClick={onClose} className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

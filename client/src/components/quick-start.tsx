import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Zap, ArrowRight, Users, Globe } from "lucide-react";
import { Link } from "wouter";

export default function QuickStart() {
  const [selectedAmount, setSelectedAmount] = useState(25);
  
  const quickAmounts = [10, 25, 50, 100];
  
  const quickImpacts = [
    { amount: 10, impact: "School supplies for 1 student" },
    { amount: 25, impact: "1 month of meals for a student" },
    { amount: 50, impact: "Textbooks for entire semester" },
    { amount: 100, impact: "Computer access for 3 months" }
  ];

  const currentImpact = quickImpacts.find(q => q.amount === selectedAmount)?.impact;

  return (
    <Card className="bg-gradient-to-br from-white to-trust-blue/5 border-2 border-trust-blue/20 shadow-xl">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="h-6 w-6 text-action-orange" />
            <h3 className="text-2xl font-bold text-gray-900">Start Helping Now</h3>
          </div>
          <p className="text-gray-600">Pick an amount. See immediate impact. Connect with a student.</p>
        </div>

        <div className="space-y-6">
          {/* Quick Amount Selection */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Choose your impact:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "default" : "outline"}
                  className={`h-16 flex flex-col ${
                    selectedAmount === amount 
                      ? "bg-trust-blue hover:bg-blue-700" 
                      : "hover:bg-trust-blue/5"
                  }`}
                  onClick={() => setSelectedAmount(amount)}
                >
                  <span className="text-xl font-bold">${amount}</span>
                  <span className="text-xs opacity-80">one-time</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Impact Preview */}
          <div className="bg-gradient-to-r from-action-orange/10 to-hope-green/10 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-5 w-5 text-action-orange" />
              <span className="font-semibold text-gray-800">Your ${selectedAmount} provides:</span>
            </div>
            <p className="text-gray-700">{currentImpact}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-white/80 p-3 rounded-lg">
              <div className="text-2xl font-bold text-trust-blue">2,847</div>
              <div className="text-xs text-gray-600">Students helped</div>
            </div>
            <div className="bg-white/80 p-3 rounded-lg">
              <div className="text-2xl font-bold text-action-orange">94%</div>
              <div className="text-xs text-gray-600">Success rate</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              asChild 
              className="w-full bg-action-orange hover:bg-orange-600 h-12 text-lg font-semibold"
            >
              <Link href="/browse">
                Start Supporting Students
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              className="w-full border-trust-blue text-trust-blue hover:bg-trust-blue hover:text-white"
            >
              <Link href="/stories">
                See Success Stories First
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>1,392 active donors</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              <span>India & USA</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
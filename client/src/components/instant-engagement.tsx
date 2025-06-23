import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Users, Clock, Star, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function InstantEngagement() {
  const [activeCard, setActiveCard] = useState(0);
  
  const quickWins = [
    {
      title: "Help Priya Learn Coding",
      location: "Rajasthan, India",
      goal: 1200,
      raised: 890,
      timeLeft: "3 days",
      supporters: 23,
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=200&fit=crop",
      impact: "Will enable her to teach 50+ village children",
      urgency: "Almost funded!"
    },
    {
      title: "Marcus Needs Laptops",
      location: "Detroit, USA",
      goal: 2500,
      raised: 1680,
      timeLeft: "5 days",
      supporters: 34,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop",
      impact: "10 students will get job-ready skills",
      urgency: "67% complete"
    },
    {
      title: "Girls STEM Workshop",
      location: "California, USA",
      goal: 800,
      raised: 650,
      timeLeft: "2 days",
      supporters: 18,
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&h=200&fit=crop",
      impact: "20 girls will discover engineering",
      urgency: "So close!"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % quickWins.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const currentCard = quickWins[activeCard];
  const progress = (currentCard.raised / currentCard.goal) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-action-orange/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-trust-blue to-accent-purple text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-action-orange" />
            <span className="font-semibold">Urgent Help Needed</span>
          </div>
          <Badge className="bg-action-orange text-white">
            {currentCard.timeLeft} left
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Image */}
          <div className="relative">
            <img 
              src={currentCard.image} 
              alt={currentCard.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-trust-blue">
              {currentCard.location}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {currentCard.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {currentCard.impact}
              </p>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-hope-green border-hope-green">
                  {currentCard.urgency}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  {currentCard.supporters} supporters
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  ${currentCard.raised.toLocaleString()} raised
                </span>
                <span className="font-semibold text-trust-blue">
                  ${currentCard.goal.toLocaleString()} goal
                </span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                asChild 
                className="flex-1 bg-action-orange hover:bg-orange-600 font-semibold"
              >
                <Link href="/browse">
                  <Heart className="mr-2 h-4 w-4" />
                  Help Now
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="border-trust-blue text-trust-blue hover:bg-trust-blue hover:text-white"
                onClick={() => setActiveCard((prev) => (prev + 1) % quickWins.length)}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {quickWins.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === activeCard ? 'bg-action-orange' : 'bg-gray-300'
              }`}
              onClick={() => setActiveCard(index)}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span>4.9/5 success rate</span>
          </div>
          <span>•</span>
          <span>100% transparent</span>
        </div>
        <Link href="/browse" className="text-trust-blue font-medium hover:underline">
          View all causes →
        </Link>
      </div>
    </div>
  );
}
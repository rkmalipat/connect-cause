import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import OptimizedImage from "@/components/optimized-image";
import { Heart, Users, MapPin, Clock, Star } from "lucide-react";
import type { Initiative } from "@shared/schema";

interface SimplifiedInitiativeCardProps {
  initiative: Initiative;
}

export default function SimplifiedInitiativeCard({ initiative }: SimplifiedInitiativeCardProps) {
  const progress = initiative.goalAmount > 0 ? (initiative.raisedAmount || 0) / initiative.goalAmount * 100 : 0;
  const daysLeft = Math.ceil((new Date(initiative.createdAt!).getTime() + 30 * 24 * 60 * 60 * 1000 - Date.now()) / (24 * 60 * 60 * 1000));

  const getStudentName = () => {
    if (initiative.country === "India") {
      return initiative.title.includes("Women") ? "Priya & Friends" : "Arjun's Group";
    }
    return initiative.title.includes("STEM") ? "Emma & Girls" : "Marcus & Team";
  };

  const getQuickImpact = () => {
    if (initiative.category === "education") {
      return "Personal mentorship + education support";
    }
    return "Skills training + career guidance friendship";
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-action-orange/30 overflow-hidden">
      {/* Image with overlay */}
      <div className="relative">
        {initiative.coverImage && (
          <OptimizedImage
            src={initiative.coverImage}
            alt={initiative.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            width={400}
            height={192}
          />
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm">
            <MapPin className="h-3 w-3 mr-1" />
            {initiative.country}
          </Badge>
          {daysLeft <= 7 && (
            <Badge className="bg-red-500 text-white">
              <Clock className="h-3 w-3 mr-1" />
              {daysLeft}d left
            </Badge>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <Badge className="bg-hope-green text-white">
            <Star className="h-3 w-3 mr-1 fill-current" />
            Verified
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        {/* Student Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-trust-blue transition-colors">
            Help {getStudentName()}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {initiative.description}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              ${(initiative.raisedAmount || 0).toLocaleString()} raised
            </span>
            <span className="text-sm text-gray-500">
              ${initiative.goalAmount.toLocaleString()} goal
            </span>
          </div>
          <Progress value={progress} className="h-2 mb-2" />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {initiative.supportersCount || 0} supporters
            </div>
            <span>{Math.round(progress)}% funded</span>
          </div>
        </div>

        {/* Connection Promise */}
        <div className="bg-gradient-to-r from-trust-blue/5 to-action-orange/5 p-3 rounded-lg mb-4">
          <p className="text-sm font-medium text-trust-blue">
            You'll get: {getQuickImpact()}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Direct messaging • Progress photos • Thank you videos
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button className="w-full bg-action-orange hover:bg-orange-600 font-semibold">
            <Heart className="mr-2 h-4 w-4" />
            Meet & Support
          </Button>
          <Button variant="outline" className="w-full text-trust-blue border-trust-blue hover:bg-trust-blue hover:text-white">
            Chat First
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
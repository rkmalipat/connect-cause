import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Play, Clock, Users } from "lucide-react";
import { Link } from "wouter";

export default function OneMinuteEngagement() {
  const [videoPlaying, setVideoPlaying] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 bg-white shadow-2xl border-2 border-action-orange/20">
        <CardContent className="p-4">
          {!videoPlaying ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-red-500 text-white animate-pulse">
                  <Clock className="h-3 w-3 mr-1" />
                  LIVE
                </Badge>
                <span className="text-xs text-gray-500">Just now</span>
              </div>
              
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=150&fit=crop"
                  alt="Student success story"
                  className="w-full h-24 object-cover rounded-lg"
                />
                <Button
                  className="absolute inset-0 bg-black/50 hover:bg-black/60 rounded-lg"
                  onClick={() => setVideoPlaying(true)}
                >
                  <Play className="h-8 w-8 text-white" />
                </Button>
              </div>
              
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  "Thank you for believing in me!"
                </p>
                <p className="text-xs text-gray-600">
                  Priya wants to video chat about her college acceptance
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button asChild size="sm" className="flex-1 bg-action-orange hover:bg-orange-600">
                  <Link href="/browse">
                    <Heart className="h-3 w-3 mr-1" />
                    Meet a Student
                  </Link>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs"
                  onClick={() => setVideoPlaying(false)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Users className="h-3 w-3" />
                <span>47 people made new student friends today</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-gray-900 rounded-lg p-4 text-white text-center">
                <p className="text-sm">🎓 Success Story Playing...</p>
                <p className="text-xs mt-2">Your support changes everything</p>
              </div>
              <Button 
                className="w-full bg-action-orange hover:bg-orange-600"
                onClick={() => setVideoPlaying(false)}
              >
                Support Another Student
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
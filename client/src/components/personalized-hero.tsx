import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Clock, Users } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function PersonalizedHero() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getPersonalizedMessage = () => {
    if (!user) {
      return {
        title: "Ready to change a life today?",
        subtitle: "Join thousands making education possible worldwide",
        cta: "Start Your Impact Journey"
      };
    }

    if (user.userType === 'donor') {
      return {
        title: `${getGreeting()}, ${user.fullName.split(' ')[0]}!`,
        subtitle: "3 students are waiting for your support today",
        cta: "See Who Needs Help"
      };
    }

    if (user.userType === 'runner') {
      return {
        title: `${getGreeting()}, ${user.fullName.split(' ')[0]}!`,
        subtitle: "Your initiatives have 12 new supporters this week",
        cta: "Update Your Progress"
      };
    }

    return {
      title: `${getGreeting()}, ${user.fullName.split(' ')[0]}!`,
      subtitle: "Share your educational journey with supporters",
      cta: "Tell Your Story"
    };
  };

  const message = getPersonalizedMessage();

  const liveUpdates = [
    "Sarah just supported a coding program in Detroit",
    "Priya's literacy program reached its goal in Tamil Nadu", 
    "3 new students joined STEM programs this hour",
    "A village in Rajasthan got internet access today"
  ];

  const [currentUpdate, setCurrentUpdate] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentUpdate((prev) => (prev + 1) % liveUpdates.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-trust-blue via-accent-purple to-trust-blue text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-action-orange/20 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-hope-green/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-action-orange/30 rounded-full animate-pulse delay-2000"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Personalized Content */}
          <div className="space-y-8">
            {/* Personalized Greeting */}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
                {message.title}
              </h1>
              <p className="text-xl mb-6 text-blue-100">
                {message.subtitle}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                size="lg"
                className="bg-action-orange text-white hover:bg-orange-600 font-semibold px-8 py-4"
              >
                <Link href={user ? "/browse" : "/auth"}>
                  <Heart className="mr-2 h-5 w-5" />
                  {message.cta}
                </Link>
              </Button>
              
              {!user && (
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-trust-blue font-semibold px-8 py-4"
                >
                  <Link href="/stories">
                    Watch 2-min Impact Video
                  </Link>
                </Button>
              )}
            </div>

            {/* Live Activity Feed */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-hope-green rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live Impact</span>
              </div>
              <p className="text-blue-100 text-sm">
                {liveUpdates[currentUpdate]}
              </p>
            </div>
          </div>

          {/* Right Column - Impact Preview */}
          <div className="space-y-6">
            {/* Today's Opportunities */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-action-orange" />
                Today's Urgent Needs
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-action-orange to-hope-green rounded-full flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Detroit Coding Bootcamp</p>
                      <p className="text-sm text-blue-200">Needs $1,200 for laptops</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-action-orange/20 text-white">
                    80% funded
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-trust-blue to-accent-purple rounded-full flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Tamil Nadu Girls Education</p>
                      <p className="text-sm text-blue-200">Scholarships for 15 students</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-hope-green/20 text-white">
                    New
                  </Badge>
                </div>
              </div>
            </div>

            {/* Impact Counter */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-action-orange">2,847</div>
                <div className="text-sm text-blue-200">Lives Changed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-hope-green">$487K</div>
                <div className="text-sm text-blue-200">Total Impact</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
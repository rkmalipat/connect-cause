import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Share2, MapPin, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import type { Initiative, User } from "@shared/schema";

interface InitiativeCardProps {
  initiative: Initiative;
}

export default function InitiativeCard({ initiative }: InitiativeCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: runner } = useQuery<User>({
    queryKey: [`/api/users/${initiative.runnerId}`],
    enabled: !!initiative.runnerId,
  });

  const progressPercentage = initiative.goalAmount > 0 
    ? Math.round(((initiative.raisedAmount || 0) / initiative.goalAmount) * 100)
    : 0;

  const handleSupport = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to support this initiative.",
        variant: "destructive",
      });
      return;
    }

    if (user.userType !== 'donor') {
      toast({
        title: "Donor account required",
        description: "Only donors can support initiatives.",
        variant: "destructive",
      });
      return;
    }

    // Mock donation for MVP
    try {
      const mockDonation = {
        donorId: user.id,
        initiativeId: initiative.id,
        amount: 50, // Default amount
        message: "Keep up the great work!",
        anonymous: false,
      };

      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockDonation),
      });

      if (response.ok) {
        toast({
          title: "Thank you for your support!",
          description: "Your contribution will make a real difference.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process donation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: initiative.title,
        text: initiative.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Initiative link copied to clipboard.",
      });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'education':
        return 'bg-trust-blue text-white';
      case 'skill_development':
        return 'bg-hope-green text-white';
      case 'community':
        return 'bg-action-orange text-white';
      case 'healthcare':
        return 'bg-accent-purple text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow">
      {initiative.coverImage && (
        <img 
          src={initiative.coverImage} 
          alt={initiative.title}
          className="w-full h-48 object-cover"
        />
      )}
      
      <CardContent className="p-6">
        {runner && (
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-trust-blue text-white flex items-center justify-center mr-3">
              {runner.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{runner.fullName}</p>
              <p className="text-sm text-gray-600">Initiative Runner</p>
            </div>
          </div>
        )}

        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 flex-1">{initiative.title}</h3>
          <Badge className={getCategoryColor(initiative.category)}>
            {initiative.category.replace('_', ' ')}
          </Badge>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">{initiative.description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span className="text-hope-green font-semibold">{progressPercentage}% funded</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-2xl font-bold text-trust-blue">
              ${(initiative.raisedAmount || 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">of ${initiative.goalAmount.toLocaleString()} goal</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">{initiative.supportersCount || 0}</p>
            <p className="text-sm text-gray-600">supporters</p>
          </div>
        </div>

        {initiative.createdAt && (
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Created {new Date(initiative.createdAt).toLocaleDateString()}</span>
          </div>
        )}

        <div className="flex gap-3">
          <Button 
            onClick={handleSupport}
            className="flex-1 bg-trust-blue hover:bg-blue-700"
            disabled={!user || user.userType !== 'donor'}
          >
            <Heart className="mr-2 h-4 w-4" />
            Support
          </Button>
          <Button 
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="px-3"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

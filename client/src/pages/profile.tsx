import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ProfileBuilder from "@/components/profile-builder";
import InitiativeCard from "@/components/initiative-card";
import StoryReel from "@/components/story-reel";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Edit, MapPin, Calendar, MessageCircle, Settings, Plus } from "lucide-react";
import type { User, Initiative, Story } from "@shared/schema";

export default function Profile() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [showProfileBuilder, setShowProfileBuilder] = useState(false);

  const profileId = params.id ? parseInt(params.id) : currentUser?.id;
  const isOwnProfile = currentUser?.id === profileId;

  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: [`/api/users/${profileId}`],
    enabled: !!profileId,
  });

  const { data: initiatives = [] } = useQuery<Initiative[]>({
    queryKey: ["/api/initiatives", { runner: profileId }],
    enabled: !!profileId && user?.userType === 'initiative_runner',
  });

  const { data: stories = [] } = useQuery<Story[]>({
    queryKey: ["/api/stories", { author: profileId }],
    enabled: !!profileId,
  });

  const messageUserMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!currentUser || !user) throw new Error("Not authenticated");
      
      const messageData = {
        senderId: currentUser.id,
        receiverId: user.id,
        content,
      };

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Your message has been delivered.",
      });
      setLocation('/messages');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    const content = prompt("Enter your message:");
    if (content && content.trim()) {
      messageUserMutation.mutate(content.trim());
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">User not found</h1>
            <p className="text-gray-600 mb-4">The profile you're looking for doesn't exist.</p>
            <Button onClick={() => setLocation('/')}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'donor':
        return 'bg-trust-blue text-white';
      case 'beneficiary':
        return 'bg-action-orange text-white';
      case 'initiative_runner':
        return 'bg-hope-green text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'donor':
        return 'Donor';
      case 'beneficiary':
        return 'Beneficiary';
      case 'initiative_runner':
        return 'Initiative Runner';
      default:
        return userType;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showProfileBuilder && isOwnProfile && user.userType === 'initiative_runner' && (
        <ProfileBuilder onClose={() => setShowProfileBuilder(false)} />
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-trust-blue to-accent-purple text-white flex items-center justify-center text-3xl font-bold">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{user.fullName}</h1>
                    <p className="text-gray-600">@{user.username}</p>
                  </div>
                  
                  <div className="flex gap-2 mt-4 sm:mt-0">
                    <Badge className={getUserTypeColor(user.userType)}>
                      {getUserTypeLabel(user.userType)}
                    </Badge>
                    {user.verified && (
                      <Badge variant="secondary">Verified</Badge>
                    )}
                  </div>
                </div>

                {user.bio && (
                  <p className="text-gray-700 mb-4">{user.bio}</p>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  {user.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {user.location}
                    </div>
                  )}
                  {user.createdAt && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {isOwnProfile ? (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                      {user.userType === 'initiative_runner' && (
                        <Button 
                          onClick={() => setShowProfileBuilder(true)}
                          className="bg-action-orange hover:bg-amber-600"
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Initiative
                        </Button>
                      )}
                    </div>
                  ) : (
                    currentUser && (
                      <Button 
                        onClick={handleSendMessage}
                        disabled={messageUserMutation.isPending}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {messageUserMutation.isPending ? 'Sending...' : 'Send Message'}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {user.userType === 'initiative_runner' && (
              <TabsTrigger value="initiatives">
                Initiatives ({initiatives.length})
              </TabsTrigger>
            )}
            <TabsTrigger value="stories">
              Stories ({stories.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Impact Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.userType === 'donor' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Donated</span>
                          <span className="font-semibold">$0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Students Supported</span>
                          <span className="font-semibold">0</span>
                        </div>
                      </>
                    )}
                    
                    {user.userType === 'initiative_runner' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Active Initiatives</span>
                          <span className="font-semibold">{initiatives.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Raised</span>
                          <span className="font-semibold">
                            ${initiatives.reduce((sum, init) => sum + (init.raisedAmount || 0), 0).toLocaleString()}
                          </span>
                        </div>
                      </>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stories Shared</span>
                      <span className="font-semibold">{stories.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stories.slice(0, 3).map((story) => (
                      <div key={story.id} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-trust-blue rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm text-gray-700 line-clamp-2">{story.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {story.createdAt && new Date(story.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {stories.length === 0 && (
                      <p className="text-gray-500 text-sm">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {user.userType === 'initiative_runner' && (
            <TabsContent value="initiatives">
              {initiatives.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {initiatives.map((initiative) => (
                    <InitiativeCard key={initiative.id} initiative={initiative} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No initiatives yet</h3>
                    <p className="text-gray-600 mb-4">
                      {isOwnProfile 
                        ? "Create your first initiative to start making an impact."
                        : `${user.fullName} hasn't created any initiatives yet.`
                      }
                    </p>
                    {isOwnProfile && (
                      <Button 
                        onClick={() => setShowProfileBuilder(true)}
                        className="bg-action-orange hover:bg-amber-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Initiative
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          )}

          <TabsContent value="stories">
            {stories.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story) => (
                  <StoryReel key={story.id} story={story} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No stories yet</h3>
                  <p className="text-gray-600 mb-4">
                    {isOwnProfile 
                      ? "Share your first story to connect with the community."
                      : `${user.fullName} hasn't shared any stories yet.`
                    }
                  </p>
                  {isOwnProfile && (
                    <Button onClick={() => setLocation('/stories')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Share Story
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

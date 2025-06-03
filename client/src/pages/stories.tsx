import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StoryReel from "@/components/story-reel";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Plus, Heart, TrendingUp, Clock, Upload, Camera } from "lucide-react";
import type { Story, Initiative } from "@shared/schema";

export default function Stories() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [newStory, setNewStory] = useState({
    content: "",
    mediaUrl: "",
    mediaType: "image" as "image" | "video" | null,
    initiativeId: null as number | null,
  });

  const { data: stories = [], isLoading } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
  });

  const { data: userInitiatives = [] } = useQuery<Initiative[]>({
    queryKey: ["/api/initiatives", { runner: user?.id }],
    enabled: !!user && user.userType === 'initiative_runner',
  });

  const createStoryMutation = useMutation({
    mutationFn: async (storyData: any) => {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storyData),
      });

      if (!response.ok) throw new Error('Failed to create story');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Story shared!",
        description: "Your story has been shared with the community.",
      });
      setShowCreateDialog(false);
      setNewStory({
        content: "",
        mediaUrl: "",
        mediaType: "image",
        initiativeId: null,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to share story. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to share stories.",
        variant: "destructive",
      });
      return;
    }

    if (!newStory.content.trim()) {
      toast({
        title: "Content required",
        description: "Please add some content to your story.",
        variant: "destructive",
      });
      return;
    }

    const storyData = {
      content: newStory.content.trim(),
      mediaUrl: newStory.mediaUrl || null,
      mediaType: newStory.mediaType,
      authorId: user.id,
      initiativeId: newStory.initiativeId,
    };

    createStoryMutation.mutate(storyData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a file storage service
      // For now, we'll use a placeholder URL
      const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
      setNewStory(prev => ({
        ...prev,
        mediaUrl: `https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400`,
        mediaType,
      }));
      
      toast({
        title: "File uploaded",
        description: "Your media has been uploaded successfully.",
      });
    }
  };

  const filteredStories = stories.filter(story => {
    if (activeFilter === "all") return true;
    if (activeFilter === "my-stories") return story.authorId === user?.id;
    if (activeFilter === "trending") return (story.heartsCount || 0) > 5;
    return true;
  }).sort((a, b) => {
    if (activeFilter === "trending") {
      return (b.heartsCount || 0) - (a.heartsCount || 0);
    }
    return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
  });

  const stats = {
    totalStories: stories.length,
    totalHearts: stories.reduce((sum, story) => sum + (story.heartsCount || 0), 0),
    userStories: user ? stories.filter(s => s.authorId === user.id).length : 0,
    avgHearts: stories.length > 0 
      ? Math.round(stories.reduce((sum, story) => sum + (story.heartsCount || 0), 0) / stories.length)
      : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Share your journey, celebrate achievements, and inspire others in our community
          </p>
          
          {user && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-trust-blue hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Share Your Story
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Share Your Story</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleCreateStory} className="space-y-4">
                  <div>
                    <Label htmlFor="content">Your Story</Label>
                    <Textarea
                      id="content"
                      placeholder="Share your experience, achievement, or inspiring moment..."
                      value={newStory.content}
                      onChange={(e) => setNewStory(prev => ({ ...prev, content: e.target.value }))}
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  {user.userType === 'initiative_runner' && userInitiatives.length > 0 && (
                    <div>
                      <Label htmlFor="initiative">Related Initiative (Optional)</Label>
                      <Select 
                        value={newStory.initiativeId?.toString() || ""} 
                        onValueChange={(value) => setNewStory(prev => ({ 
                          ...prev, 
                          initiativeId: value ? parseInt(value) : null 
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an initiative" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No initiative</SelectItem>
                          {userInitiatives.map((initiative) => (
                            <SelectItem key={initiative.id} value={initiative.id.toString()}>
                              {initiative.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="media">Add Media (Optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="media-url"
                        type="url"
                        placeholder="Or paste image URL..."
                        value={newStory.mediaUrl}
                        onChange={(e) => setNewStory(prev => ({ ...prev, mediaUrl: e.target.value }))}
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {newStory.mediaUrl && (
                    <div className="mt-2">
                      <img 
                        src={newStory.mediaUrl} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      disabled={createStoryMutation.isPending}
                      className="flex-1 bg-trust-blue hover:bg-blue-700"
                    >
                      {createStoryMutation.isPending ? 'Sharing...' : 'Share Story'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowCreateDialog(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-trust-blue">{stats.totalStories}</div>
              <p className="text-xs text-muted-foreground">Shared by community</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hearts</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stats.totalHearts}</div>
              <p className="text-xs text-muted-foreground">Community support</p>
            </CardContent>
          </Card>

          {user && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Your Stories</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-hope-green">{stats.userStories}</div>
                <p className="text-xs text-muted-foreground">Stories you've shared</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Hearts</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-action-orange">{stats.avgHearts}</div>
              <p className="text-xs text-muted-foreground">Per story</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Tabs value={activeFilter} onValueChange={setActiveFilter} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Stories</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            {user && <TabsTrigger value="my-stories">My Stories</TabsTrigger>}
          </TabsList>
        </Tabs>

        {/* Stories Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[9/16] rounded-2xl"></div>
              </div>
            ))}
          </div>
        ) : filteredStories.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredStories.map((story) => (
              <StoryReel key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No stories yet</h3>
              <p className="text-gray-600 mb-6">
                {activeFilter === "my-stories" 
                  ? "You haven't shared any stories yet. Start sharing your journey!"
                  : "Be the first to share a story and inspire the community."
                }
              </p>
              {user && (
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-trust-blue hover:bg-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Share Your Story
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

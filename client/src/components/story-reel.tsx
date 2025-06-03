import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, Play, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import type { Story, User } from "@shared/schema";

interface StoryReelProps {
  story: Story;
}

export default function StoryReel({ story }: StoryReelProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);

  const { data: author } = useQuery<User>({
    queryKey: [`/api/users/${story.authorId}`],
    enabled: !!story.authorId,
  });

  const handleHeartClick = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like stories.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/stories/${story.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heartsCount: (story.heartsCount || 0) + 1,
        }),
      });

      if (response.ok) {
        toast({
          title: "Story liked!",
          description: "Thank you for showing your support.",
        });
      }
    } catch (error) {
      console.error('Error liking story:', error);
    }
  };

  const gradientClasses = [
    'from-trust-blue to-accent-purple',
    'from-hope-green to-trust-blue',
    'from-action-orange to-hope-green',
    'from-accent-purple to-action-orange',
  ];

  const gradientClass = gradientClasses[story.id % gradientClasses.length];

  return (
    <>
      <div 
        className={`relative bg-gradient-to-br ${gradientClass} rounded-2xl overflow-hidden cursor-pointer group`}
        onClick={() => setShowModal(true)}
      >
        <div className="aspect-[9/16] relative">
          {story.mediaUrl && (
            <img 
              src={story.mediaUrl} 
              alt="Story media"
              className="w-full h-full object-cover opacity-80" 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          <div className="absolute top-4 left-4 right-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-full mr-2 flex items-center justify-center">
                {author ? author.fullName.charAt(0).toUpperCase() : '?'}
              </div>
              <span className="text-white font-medium text-sm">
                {author?.fullName || 'Anonymous'}
              </span>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-sm mb-2 line-clamp-3">{story.content}</p>
            <div className="flex items-center">
              <Heart className="h-4 w-4 text-red-400 mr-1" />
              <span className="text-xs">{story.heartsCount || 0} hearts</span>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/20 rounded-full p-4">
              <Play className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <div className="w-8 h-8 bg-trust-blue rounded-full mr-2 flex items-center justify-center text-white">
                {author ? author.fullName.charAt(0).toUpperCase() : '?'}
              </div>
              {author?.fullName || 'Anonymous'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {story.mediaUrl && (
              <img 
                src={story.mediaUrl} 
                alt="Story media"
                className="w-full h-64 object-cover rounded-lg" 
              />
            )}
            
            <p className="text-gray-700">{story.content}</p>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center text-sm text-gray-500">
                <Heart className="h-4 w-4 text-red-400 mr-1" />
                <span>{story.heartsCount || 0} hearts</span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleHeartClick}
                  variant="outline" 
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                >
                  <Heart className="h-4 w-4 mr-1" />
                  Like
                </Button>
                
                {user && user.id !== story.authorId && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setShowModal(false);
                      // Navigate to messages or open message dialog
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

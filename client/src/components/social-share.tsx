import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Facebook, Twitter, Linkedin, Link, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
}

export default function SocialShare({ title, description, url, image }: SocialShareProps) {
  const { toast } = useToast();
  const currentUrl = url || window.location.href;
  const shareText = `${title} - ${description}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast({
        title: "Link copied!",
        description: "Share this initiative with others",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually",
        variant: "destructive",
      });
    }
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareOnLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  };

  const shareViaEmail = () => {
    const emailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${shareText}\n\n${currentUrl}`)}`;
    window.location.href = emailUrl;
  };

  return (
    <Card className="bg-gradient-to-r from-trust-blue/5 to-accent-purple/5 border-trust-blue/20">
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Share this initiative</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={shareOnFacebook}
            className="flex items-center gap-2 hover:bg-blue-50"
          >
            <Facebook className="h-4 w-4 text-blue-600" />
            Facebook
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={shareOnTwitter}
            className="flex items-center gap-2 hover:bg-sky-50"
          >
            <Twitter className="h-4 w-4 text-sky-500" />
            Twitter
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={shareOnLinkedIn}
            className="flex items-center gap-2 hover:bg-blue-50"
          >
            <Linkedin className="h-4 w-4 text-blue-700" />
            LinkedIn
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={shareViaEmail}
            className="flex items-center gap-2 hover:bg-gray-50"
          >
            <Mail className="h-4 w-4 text-gray-600" />
            Email
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="flex items-center gap-2 hover:bg-gray-50"
          >
            <Link className="h-4 w-4 text-gray-600" />
            Copy Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
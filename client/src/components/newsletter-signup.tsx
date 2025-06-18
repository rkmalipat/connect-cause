import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Bell, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [preferences, setPreferences] = useState({
    impact_updates: true,
    new_initiatives: true,
    success_stories: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Welcome to ConnectCause!",
        description: "You'll receive updates about the amazing impact you're helping create.",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card className="bg-gradient-to-br from-trust-blue/10 via-white to-accent-purple/10 border-trust-blue/20">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-trust-blue">
          <Mail className="h-5 w-5" />
          Stay Connected
        </CardTitle>
        <p className="text-sm text-gray-600">
          Get updates on the incredible impact you're helping create
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">What would you like to hear about?</p>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="impact_updates"
                  checked={preferences.impact_updates}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, impact_updates: checked as boolean }))
                  }
                />
                <label htmlFor="impact_updates" className="text-sm text-gray-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Monthly impact reports
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="new_initiatives"
                  checked={preferences.new_initiatives}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, new_initiatives: checked as boolean }))
                  }
                />
                <label htmlFor="new_initiatives" className="text-sm text-gray-600 flex items-center gap-1">
                  <Bell className="h-3 w-3" />
                  New initiatives & urgent needs
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="success_stories"
                  checked={preferences.success_stories}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, success_stories: checked as boolean }))
                  }
                />
                <label htmlFor="success_stories" className="text-sm text-gray-600">
                  Inspiring success stories
                </label>
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-trust-blue hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Joining..." : "Join Our Community"}
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
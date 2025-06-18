import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Gift, Share2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function ReferralWidget() {
  const { user } = useAuth();
  const [referralEmail, setReferralEmail] = useState("");
  
  if (!user) return null;

  const referralCode = `CC${user.id}${user.fullName.substring(0, 2).toUpperCase()}`;
  const referralLink = `${window.location.origin}?ref=${referralCode}`;
  
  const handleSendInvite = () => {
    if (!referralEmail) return;
    
    const subject = "Join me in making a difference with ConnectCause";
    const body = `Hi there!\n\nI've been supporting educational initiatives through ConnectCause and thought you might be interested too.\n\nYou can see the amazing work being done and join our community here: ${referralLink}\n\nTogether, we can help more students access quality education.\n\nBest regards,\n${user.fullName}`;
    
    window.location.href = `mailto:${referralEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setReferralEmail("");
  };

  return (
    <Card className="bg-gradient-to-br from-action-orange/10 to-trust-blue/10 border-action-orange/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-trust-blue">
          <Users className="h-5 w-5" />
          Invite Friends & Multiply Impact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white/80 p-3 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Your referral code:</p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-trust-blue text-white px-3 py-1">
              {referralCode}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigator.clipboard.writeText(referralLink)}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Invite via email:</p>
          <div className="flex gap-2">
            <Input
              placeholder="friend@example.com"
              value={referralEmail}
              onChange={(e) => setReferralEmail(e.target.value)}
              type="email"
            />
            <Button onClick={handleSendInvite} className="bg-action-orange hover:bg-orange-600">
              <Gift className="h-4 w-4 mr-1" />
              Invite
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 bg-white/60 p-2 rounded">
          When friends join through your link, both of you get featured in our donor spotlight!
        </div>
      </CardContent>
    </Card>
  );
}
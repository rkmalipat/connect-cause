import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Briefcase, MessageCircle, Video, Heart } from "lucide-react";

export default function EducationFocusBanner() {
  return (
    <Card className="bg-gradient-to-r from-trust-blue/5 via-white to-action-orange/5 border-trust-blue/20 mb-8">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <GraduationCap className="h-6 w-6 text-trust-blue" />
            <h3 className="text-xl font-bold text-gray-900">Education & Livelihood Focus</h3>
            <Briefcase className="h-6 w-6 text-action-orange" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ConnectCause exclusively supports education and job skills training. Meet students personally and build lasting friendships.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white/80 rounded-lg">
            <MessageCircle className="h-8 w-8 text-trust-blue mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">Direct Chat</h4>
            <p className="text-sm text-gray-600">Message students directly</p>
          </div>
          
          <div className="text-center p-4 bg-white/80 rounded-lg">
            <Video className="h-8 w-8 text-action-orange mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">Video Calls</h4>
            <p className="text-sm text-gray-600">See their progress live</p>
          </div>
          
          <div className="text-center p-4 bg-white/80 rounded-lg">
            <Heart className="h-8 w-8 text-hope-green mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">Real Updates</h4>
            <p className="text-sm text-gray-600">Photos and achievements</p>
          </div>
          
          <div className="text-center p-4 bg-white/80 rounded-lg">
            <GraduationCap className="h-8 w-8 text-accent-purple mx-auto mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">Success Stories</h4>
            <p className="text-sm text-gray-600">Celebrate together</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <Badge className="bg-trust-blue/10 text-trust-blue border-trust-blue/20">
            Education Support
          </Badge>
          <Badge className="bg-action-orange/10 text-action-orange border-action-orange/20">
            Job Skills Training
          </Badge>
          <Badge className="bg-hope-green/10 text-hope-green border-hope-green/20">
            Personal Mentorship
          </Badge>
          <Badge className="bg-accent-purple/10 text-accent-purple border-accent-purple/20">
            Cross-Cultural Friendship
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
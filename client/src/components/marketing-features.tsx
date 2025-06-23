import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Users, Globe, TrendingUp, Share2, Bell } from "lucide-react";

export default function MarketingFeatures() {
  const features = [
    {
      icon: Globe,
      title: "Cross-Cultural Impact",
      description: "Connect with educational initiatives across India and USA, bridging cultural gaps through shared learning",
      color: "bg-trust-blue/10 text-trust-blue"
    },
    {
      icon: Users,
      title: "Direct Connection",
      description: "Message initiative runners and beneficiaries directly, building authentic relationships beyond donations",
      color: "bg-action-orange/10 text-action-orange"
    },
    {
      icon: TrendingUp,
      title: "Real-Time Impact",
      description: "Track progress with live updates, photos, and success stories from the students you're supporting",
      color: "bg-success-green/10 text-success-green"
    },
    {
      icon: Share2,
      title: "Viral Sharing",
      description: "Share initiatives easily across social media to multiply impact and reach more potential supporters",
      color: "bg-accent-purple/10 text-accent-purple"
    }
  ];

  const countries = [
    {
      name: "India",
      flag: "🇮🇳",
      initiatives: 3,
      focus: "Rural education, digital literacy, women's empowerment",
      highlight: "Reaching remote villages with mobile learning labs"
    },
    {
      name: "USA",
      flag: "🇺🇸", 
      initiatives: 2,
      focus: "STEM education, coding bootcamps, underserved communities",
      highlight: "Bridging the digital divide in urban areas"
    }
  ];

  return (
    <div className="space-y-12">
      {/* Key Features */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why ConnectCause Works</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-3`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Country Focus */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Focus Countries</h3>
        <div className="grid md:grid-cols-2 gap-8">
          {countries.map((country, index) => (
            <Card key={index} className="border-2 border-trust-blue/20 hover:border-trust-blue/40 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <span className="text-3xl">{country.flag}</span>
                  {country.name}
                  <Badge variant="secondary" className="ml-auto">
                    {country.initiatives} initiatives
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Focus Areas:</h4>
                  <p className="text-gray-600 text-sm">{country.focus}</p>
                </div>
                <div className="bg-gradient-to-r from-trust-blue/5 to-action-orange/5 p-3 rounded-lg">
                  <p className="text-sm font-medium text-trust-blue">{country.highlight}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Expansion Promise */}
      <Card className="bg-gradient-to-r from-hope-green/10 to-trust-blue/10 border-hope-green/20">
        <CardContent className="p-6 text-center">
          <Bell className="h-8 w-8 text-hope-green mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-gray-900 mb-2">More Countries Coming Soon</h4>
          <p className="text-gray-600 mb-4">
            Based on community interest, we'll expand to additional countries where educational support is most needed.
          </p>
          <Button variant="outline" className="border-hope-green text-hope-green hover:bg-hope-green hover:text-white">
            Request New Country
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
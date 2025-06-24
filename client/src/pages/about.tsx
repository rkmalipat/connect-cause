import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import OptimizedImage from "@/components/optimized-image";
import { 
  Heart, 
  Users, 
  Globe, 
  BookOpen, 
  Award, 
  Target,
  Mail,
  Phone,
  MapPin,
  Shield,
  TrendingUp,
  Star
} from "lucide-react";
import { Link } from "wouter";

export default function About() {
  const stats = [
    { label: "Students Helped", value: "2,847", icon: Users },
    { label: "Active Donors", value: "1,423", icon: Heart },
    { label: "Countries", value: "2", icon: Globe },
    { label: "Success Rate", value: "94%", icon: Award }
  ];

  const teamMembers = [
    {
      name: "Team Leherein",
      role: "Dedicated Volunteers",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=300&fit=crop&crop=face",
      bio: "Passionate volunteers committed to supporting children's education in Balsadan"
    },
    {
      name: "Balsadan Children",
      role: "Our Inspiration",
      image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=300&h=300&fit=crop&crop=face",
      bio: "Bright, motivated children in Pune, India who inspire us every day with their determination"
    },
    {
      name: "IIM Trust Partners",
      role: "Ground Operations",
      image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&h=300&fit=crop&crop=face",
      bio: "Investment In Mankind Trust manages Balsadan and ensures direct impact"
    }
  ];

  const milestones = [
    { year: "2019", event: "New England Leherein established as IRS registered nonprofit" },
    { year: "2020", event: "Partnership formed with Investment In Mankind Trust and Balsadan" },
    { year: "2021", event: "First educational support programs launched for Balsadan children" },
    { year: "2022", event: "Expanded community outreach through local events and Dabba fundraisers" },
    { year: "2024", event: "Launched ConnectCause platform to connect donors directly with children" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-trust-blue to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About New England Leherein</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Committed to educating, encouraging, and empowering kids in "Balsadan" - 
              a loving home for underprivileged children in Pune, India.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Shield className="h-5 w-5 mr-2" />
                IRS Registered NGO
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Heart className="h-5 w-5 mr-2" />
                Supporting Balsadan Children
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-trust-blue">
                <Target className="h-6 w-6 mr-3" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                New England Leherein is committed to the mission of educating, encouraging, and empowering 
                kids in "Balsadan" - a loving home for underprivileged children in Pune, India, 
                run by the Non-Profit Investment In Mankind (IIM) Trust.
              </p>
            </CardContent>
          </Card>

          <Card className="p-8">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-trust-blue">
                <BookOpen className="h-6 w-6 mr-3" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Through our mission we aspire to make a small difference in the world and create waves of change. 
                We envision a future where every child in Balsadan has access to quality education, 
                mentorship, and the support they need to build a brighter future.
              </p>
              <p className="text-gray-600 text-sm mt-3 italic">
                "Leherein" means "waves" in Hindi - symbolizing the ripple effect of positive change.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Impact Stats */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-trust-blue">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <stat.icon className="h-12 w-12 text-action-orange" />
                </div>
                <div className="text-3xl font-bold text-trust-blue mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* How We Work */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-trust-blue">How We Work</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-trust-blue/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-trust-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Personal Matching</h3>
              <p className="text-gray-600">
                We connect donors directly with children in Balsadan, creating meaningful relationships that go beyond financial support.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-action-orange/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-action-orange" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Direct Connection</h3>
              <p className="text-gray-600">
                Donors and children communicate through our platform, sharing progress updates, stories, and building lasting friendships across continents.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-success-green/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-success-green" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
              <p className="text-gray-600">
                Regular updates, milestone celebrations, and transparent reporting ensure every contribution makes a real impact.
              </p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-trust-blue">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center">
                <OptimizedImage
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  width={128}
                  height={128}
                />
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-action-orange font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-trust-blue">Our Journey</h2>
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-trust-blue text-white rounded-full px-4 py-2 font-bold mr-6 min-w-fit">
                  {milestone.year}
                </div>
                <p className="text-gray-700 pt-2">{milestone.event}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Transparency */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-trust-blue">
                <Shield className="h-6 w-6 mr-3" />
                Financial Transparency
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Program Services</span>
                <span className="font-semibold">87%</span>
              </div>
              <div className="flex justify-between">
                <span>Fundraising</span>
                <span className="font-semibold">8%</span>
              </div>
              <div className="flex justify-between">
                <span>Administrative</span>
                <span className="font-semibold">5%</span>
              </div>
              <Separator />
              <p className="text-sm text-gray-600">
                We maintain the highest standards of financial accountability with regular audits and transparent reporting.
              </p>
            </CardContent>
          </Card>

          <Card className="p-8">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-trust-blue">
                <Mail className="h-6 w-6 mr-3" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-gray-500" />
                <span>info@connectcause.org</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-gray-500" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-gray-500" />
                <span>New York, NY & Mumbai, India</span>
              </div>
              <Separator />
              <p className="text-sm text-gray-600">
                EIN: 12-3456789 | 501(c)(3) Tax-Exempt Organization
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-trust-blue to-blue-700 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of donors who are building friendships and changing lives through education.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-action-orange hover:bg-orange-600">
              <Link href="/browse">
                Find Students to Support
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              <Link href="/auth">
                Join Our Community
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
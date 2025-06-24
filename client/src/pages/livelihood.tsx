import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import OptimizedImage from "@/components/optimized-image";
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Award,
  Target,
  Heart,
  ArrowRight,
  CheckCircle,
  Star,
  Globe
} from "lucide-react";
import { Link } from "wouter";

export default function Livelihood() {
  const programs = [
    {
      title: "Skill Development Training",
      description: "Computer literacy, digital skills, and vocational training for Balsadan youth",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
      participants: 24,
      completion: 85,
      category: "Digital Skills"
    },
    {
      title: "Entrepreneurship Mentorship",
      description: "Business planning, financial literacy, and startup guidance for young adults",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=250&fit=crop",
      participants: 12,
      completion: 92,
      category: "Business"
    },
    {
      title: "Trade Certification Programs",
      description: "Hands-on training in carpentry, tailoring, and technical trades",
      image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=250&fit=crop",
      participants: 18,
      completion: 78,
      category: "Technical"
    }
  ];

  const successStories = [
    {
      name: "Arjun",
      age: 22,
      program: "Computer Training",
      outcome: "Now works as IT support specialist, supporting his family",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Priya",
      age: 20,
      program: "Tailoring Business",
      outcome: "Started her own tailoring shop, employs 3 other women",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c5c2?w=300&h=300&fit=crop&crop=face"
    },
    {
      name: "Vikram",
      age: 24,
      program: "Digital Marketing",
      outcome: "Freelances for multiple companies, increased family income 300%",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face"
    }
  ];

  const impactStats = [
    { label: "Youth Trained", value: "156", icon: Users },
    { label: "Job Placements", value: "89", icon: Briefcase },
    { label: "Average Income Increase", value: "180%", icon: TrendingUp },
    { label: "Program Completion Rate", value: "87%", icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-success-green to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Livelihood Programs</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Empowering Balsadan youth with skills, training, and opportunities 
              to build sustainable careers and transform their communities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Target className="h-5 w-5 mr-2" />
                Skills Development
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Briefcase className="h-5 w-5 mr-2" />
                Career Placement
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Mission Statement */}
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-trust-blue">Breaking the Cycle of Poverty</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our livelihood programs provide Balsadan youth with practical skills, mentorship, and 
            real-world opportunities to build sustainable careers. We focus on high-demand skills 
            that can immediately improve their economic prospects and create lasting change for their families.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-trust-blue">Program Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <stat.icon className="h-12 w-12 text-success-green" />
                </div>
                <div className="text-3xl font-bold text-trust-blue mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Programs */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12 text-trust-blue">Current Programs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <OptimizedImage
                    src={program.image}
                    alt={program.title}
                    className="w-full h-48 object-cover"
                    width={400}
                    height={192}
                  />
                  <Badge className="absolute top-3 right-3 bg-success-green">
                    {program.category}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{program.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{program.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Participants</span>
                      <span className="font-medium">{program.participants} active</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Completion Rate</span>
                        <span className="font-medium">{program.completion}%</span>
                      </div>
                      <Progress value={program.completion} className="h-2" />
                    </div>
                  </div>
                  
                  <Button asChild className="w-full bg-success-green hover:bg-green-600">
                    <Link href="/submit">
                      Support This Program
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-trust-blue">Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div key={index} className="text-center">
                <OptimizedImage
                  src={story.image}
                  alt={story.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  width={128}
                  height={128}
                />
                <h3 className="text-xl font-semibold mb-1">{story.name}, {story.age}</h3>
                <p className="text-success-green font-medium mb-3">{story.program}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{story.outcome}</p>
                <div className="flex justify-center mt-3">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-trust-blue">How Our Program Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-trust-blue text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Assessment</h3>
              <p className="text-gray-600 text-sm">
                We assess each youth's interests, skills, and career goals to match them with the right program.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-action-orange text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Training</h3>
              <p className="text-gray-600 text-sm">
                Intensive hands-on training with experienced mentors and industry-standard equipment.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-success-green text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Certification</h3>
              <p className="text-gray-600 text-sm">
                Recognized certificates and portfolio development to showcase new skills to employers.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Placement</h3>
              <p className="text-gray-600 text-sm">
                Job placement assistance, entrepreneurship support, and ongoing career mentorship.
              </p>
            </div>
          </div>
        </div>

        {/* Current Needs */}
        <div className="bg-gradient-to-r from-action-orange/10 to-success-green/10 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-trust-blue">Current Program Needs</h2>
            <p className="text-lg text-gray-700">
              Help us expand our programs and reach more youth in Balsadan
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-success-green mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Equipment & Technology</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Laptops, software licenses, and tools for hands-on training
                  </p>
                  <p className="text-success-green font-medium">$2,500 funds 1 complete workstation</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-success-green mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Mentor Support</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Professional mentors and industry experts to guide trainees
                  </p>
                  <p className="text-success-green font-medium">$500 sponsors 1 month of mentorship</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-success-green to-green-700 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Transform Lives Through Livelihood</h2>
          <p className="text-xl mb-6 opacity-90">
            Your support helps Balsadan youth build careers, support families, and break the cycle of poverty.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-action-orange hover:bg-orange-600">
              <Link href="/browse">
                <Briefcase className="h-5 w-5 mr-2" />
                Support Livelihood Programs
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              <Link href="/about">
                <Globe className="h-5 w-5 mr-2" />
                Learn About Our Mission
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SimplifiedInitiativeCard from "@/components/simplified-initiative-card";
import StoryReel from "@/components/story-reel";
import ImpactDashboard from "@/components/impact-dashboard";
import NewsletterSignup from "@/components/newsletter-signup";
import ReferralWidget from "@/components/referral-widget";
import MarketingFeatures from "@/components/marketing-features";
import PersonalizedHero from "@/components/personalized-hero";
import QuickStart from "@/components/quick-start";
import InstantEngagement from "@/components/instant-engagement";
import OneMinuteEngagement from "@/components/one-minute-engagement";
import EducationFocusBanner from "@/components/education-focus-banner";
import { useAuth } from "@/hooks/use-auth";
import { Heart, Users, GraduationCap, HandHeart, Plus } from "lucide-react";
import type { Initiative, Story } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();

  const { data: featuredInitiatives = [] } = useQuery<Initiative[]>({
    queryKey: ["/api/initiatives"],
  });

  const { data: featuredStories = [] } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
  });

  // Take only first 3 initiatives and 4 stories for featured sections
  const displayInitiatives = featuredInitiatives.slice(0, 3);
  const displayStories = featuredStories.slice(0, 4);

  // Calculate impact stats
  const impactStats = {
    totalDonations: featuredInitiatives.reduce((sum, init) => sum + (init.raisedAmount || 0), 0),
    studentsHelped: featuredInitiatives.reduce((sum, init) => sum + (init.supportersCount || 0), 0),
    initiativesActive: featuredInitiatives.filter(init => init.status === 'active').length,
    countriesReached: new Set(featuredInitiatives.map(init => init.country)).size,
    completionRate: 85
  };

  // Calculate user impact if logged in
  const userImpact = user ? {
    totalDonated: 2500,
    studentsSupported: 12,
    initiativesSupported: 5
  } : undefined;

  return (
    <div className="min-h-screen">
      {/* Personalized Hero Section */}
      <PersonalizedHero />

      {/* Quick Start Section */}
      {!user && (
        <section className="py-12 bg-gradient-to-r from-gray-50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <QuickStart />
          </div>
        </section>
      )}

      {/* Education Focus Banner */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <EducationFocusBanner />
        </div>
      </section>

      {/* Instant Engagement Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Students Ready to Connect
            </h2>
            <p className="text-lg text-gray-600">
              Real students, real friendships, real education support
            </p>
          </div>
          <InstantEngagement />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How ConnectCause Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Simple steps to change lives</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Initiative Runners */}
            <Card className="text-center group hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-hope-green text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Initiative Runners</h3>
                <p className="text-gray-600 mb-6">Create compelling profiles using our templates. Share your mission, showcase impact, and connect with potential supporters through engaging stories.</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                    <span className="text-sm text-hope-green font-semibold">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-hope-green h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Donors */}
            <Card className="text-center group hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-trust-blue text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Generous Donors</h3>
                <p className="text-gray-600 mb-6">Browse verified initiatives, connect directly with beneficiaries, track your impact, and build meaningful relationships with those you support.</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-trust-blue">$1,247</p>
                      <p className="text-sm text-gray-600">Total Donated</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-trust-blue">12</p>
                      <p className="text-sm text-gray-600">Students Helped</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Beneficiaries */}
            <Card className="text-center group hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-action-orange text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Lives Change</h3>
                <p className="text-gray-600 mb-6">Students share their journey. Friendships blossom. Education transforms communities.</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="flex -space-x-2 mr-3">
                      <div className="w-8 h-8 bg-trust-blue rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-hope-green rounded-full border-2 border-white"></div>
                      <div className="w-8 h-8 bg-action-orange rounded-full border-2 border-white"></div>
                    </div>
                    <span className="text-sm text-gray-700">3 Active Supporters</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Initiatives */}
      {displayInitiatives.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Students Need You Now</h2>
                <p className="text-xl text-gray-600">Real students, real dreams, real impact</p>
              </div>
              <Button asChild variant="ghost" className="text-trust-blue hover:text-blue-700">
                <Link href="/browse">
                  View All →
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayInitiatives.map((initiative) => (
                <SimplifiedInitiativeCard key={initiative.id} initiative={initiative} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Success Stories */}
      {displayStories.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Impact in Action</h2>
              <p className="text-xl text-gray-600">See how support changes everything</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayStories.map((story) => (
                <StoryReel key={story.id} story={story} />
              ))}
            </div>

            <div className="text-center mt-8">
              <Button asChild className="bg-trust-blue hover:bg-blue-700">
                <Link href="/stories">
                  <Plus className="mr-2 h-4 w-4" />
                  Share Your Story
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Community Stats */}
      <section className="py-20 bg-gradient-to-r from-trust-blue to-accent-purple text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Growing Community</h2>
            <p className="text-xl text-blue-100">Together, we're creating meaningful change</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-action-orange mb-2">2,847</div>
              <div className="text-lg text-blue-100">Students Supported</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-action-orange mb-2">1,392</div>
              <div className="text-lg text-blue-100">Active Donors</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-action-orange mb-2">$487K</div>
              <div className="text-lg text-blue-100">Total Raised</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-action-orange mb-2">156</div>
              <div className="text-lg text-blue-100">Active Initiatives</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Make a <span className="text-trust-blue">Difference?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of changemakers who are creating meaningful connections and lasting impact in education and livelihoods.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button asChild className="bg-trust-blue hover:bg-blue-700">
              <Link href="/auth?mode=register&type=donor">
                <Heart className="mr-3 h-5 w-5" />
                Start Supporting
              </Link>
            </Button>
            <Button asChild className="bg-action-orange hover:bg-amber-600">
              <Link href="/auth?mode=register&type=initiative_runner">
                <Plus className="mr-3 h-5 w-5" />
                Create Initiative
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/auth?mode=register&type=beneficiary">
                <GraduationCap className="mr-3 h-5 w-5" />
                I Need Support
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-center text-sm text-gray-500">
            <span>Secure • Verified • Transparent</span>
          </div>
        </div>
      </section>

      {/* Marketing Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MarketingFeatures />
        </div>
      </section>

      {/* Impact Dashboard */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Collective Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">See the real difference we're making together</p>
          </div>
          <ImpactDashboard 
            stats={impactStats} 
            showPersonalized={!!user} 
            userImpact={userImpact}
          />
        </div>
      </section>

      {/* Newsletter & Referral Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <NewsletterSignup />
            {user && <ReferralWidget />}
          </div>
        </div>
      </section>
      
      {/* One Minute Engagement Widget */}
      <OneMinuteEngagement />
    </div>
  );
}

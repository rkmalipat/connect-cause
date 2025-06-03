import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import InitiativeCard from "@/components/initiative-card";
import StoryReel from "@/components/story-reel";
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-trust-blue to-accent-purple text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Bridging Hearts, <span className="text-action-orange">Building Futures</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Connect donors with students and initiatives that need support. Share stories, build relationships, and create lasting impact in education and livelihoods.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <>
                    {user.userType === 'donor' && (
                      <Button asChild className="bg-action-orange text-white hover:bg-amber-600">
                        <Link href="/browse">
                          <HandHeart className="mr-2 h-5 w-5" />
                          Browse Causes
                        </Link>
                      </Button>
                    )}
                    {user.userType === 'initiative_runner' && (
                      <Button asChild className="bg-action-orange text-white hover:bg-amber-600">
                        <Link href="/profile/create-initiative">
                          <Plus className="mr-2 h-5 w-5" />
                          Create Initiative
                        </Link>
                      </Button>
                    )}
                    {user.userType === 'beneficiary' && (
                      <Button asChild className="bg-action-orange text-white hover:bg-amber-600">
                        <Link href="/stories">
                          <Heart className="mr-2 h-5 w-5" />
                          Share Your Story
                        </Link>
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button asChild className="bg-action-orange text-white hover:bg-amber-600">
                      <Link href="/auth?mode=register&type=donor">
                        <HandHeart className="mr-2 h-5 w-5" />
                        Start Donating
                      </Link>
                    </Button>
                    <Button asChild className="bg-white text-trust-blue hover:bg-gray-100">
                      <Link href="/auth?mode=register&type=initiative_runner">
                        <Plus className="mr-2 h-5 w-5" />
                        Create Initiative
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Students collaborating on education projects" 
                className="rounded-2xl shadow-2xl w-full" 
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div className="flex items-center">
                  <div className="bg-hope-green text-white p-2 rounded-full mr-3">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">2,847 Students</p>
                    <p className="text-sm text-gray-600">Supported This Month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How ConnectCause Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Three communities coming together to create lasting educational and livelihood impact</p>
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
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Students & Beneficiaries</h3>
                <p className="text-gray-600 mb-6">Share your educational journey, communicate with supporters, showcase your progress, and express gratitude to those who believe in your potential.</p>
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
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Initiatives</h2>
                <p className="text-xl text-gray-600">Discover impactful projects that need your support</p>
              </div>
              <Button asChild variant="ghost" className="text-trust-blue hover:text-blue-700">
                <Link href="/browse">
                  View All →
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayInitiatives.map((initiative) => (
                <InitiativeCard key={initiative.id} initiative={initiative} />
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
              <p className="text-xl text-gray-600">Real impact, real connections, real change</p>
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
    </div>
  );
}

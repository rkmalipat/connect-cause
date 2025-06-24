import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import SimplifiedInitiativeCard from "@/components/simplified-initiative-card";
import EducationFocusBanner from "@/components/education-focus-banner";
import LoadingSpinner from "@/components/loading-spinner";
import { Search, Filter, Heart, TrendingUp, Globe, MapPin, PlusCircle } from "lucide-react";
import { Link } from "wouter";
import type { Initiative } from "@shared/schema";

export default function BrowseInitiatives() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");

  const { data: initiatives = [], isLoading } = useQuery<Initiative[]>({
    queryKey: ["/api/initiatives"],
  });

  const { data: countries = [] } = useQuery<string[]>({
    queryKey: ["/api/countries"],
  });

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "education", label: "Education Support" },
    { value: "skill_development", label: "Skill Development" },
    { value: "community", label: "Community Development" },
    { value: "healthcare", label: "Healthcare Access" },
  ];

  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "progress", label: "Most Progress" },
    { value: "urgent", label: "Close to Goal" },
    { value: "popular", label: "Most Supporters" },
  ];

  const filteredAndSortedInitiatives = initiatives
    .filter(initiative => {
      const matchesSearch = initiative.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           initiative.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || initiative.category === selectedCategory;
      const matchesCountry = selectedCountry === "all" || initiative.country === selectedCountry;
      return matchesSearch && matchesCategory && matchesCountry;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "progress":
          const aProgress = a.goalAmount > 0 ? (a.raisedAmount || 0) / a.goalAmount : 0;
          const bProgress = b.goalAmount > 0 ? (b.raisedAmount || 0) / b.goalAmount : 0;
          return bProgress - aProgress;
        case "urgent":
          const aPercentage = a.goalAmount > 0 ? (a.raisedAmount || 0) / a.goalAmount : 0;
          const bPercentage = b.goalAmount > 0 ? (b.raisedAmount || 0) / b.goalAmount : 0;
          // Sort by closest to goal (highest percentage first)
          return bPercentage - aPercentage;
        case "popular":
          return (b.supportersCount || 0) - (a.supportersCount || 0);
        case "recent":
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });

  const stats = {
    total: initiatives.length,
    totalRaised: initiatives.reduce((sum, init) => sum + (init.raisedAmount || 0), 0),
    totalSupporters: initiatives.reduce((sum, init) => sum + (init.supportersCount || 0), 0),
    avgProgress: initiatives.length > 0 
      ? Math.round(initiatives.reduce((sum, init) => {
          const progress = init.goalAmount > 0 ? (init.raisedAmount || 0) / init.goalAmount : 0;
          return sum + progress;
        }, 0) / initiatives.length * 100)
      : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Student</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet students who need education support. Chat with them. Follow their journey to success.
          </p>
        </div>

        {/* Education Focus Banner */}
        <EducationFocusBanner />

        {/* Country Tabs */}
        <Tabs value={selectedCountry} onValueChange={setSelectedCountry} className="mb-8">
          <TabsList className="flex flex-wrap justify-center gap-2 bg-white p-2 rounded-lg border">
            <TabsTrigger value="all" className="flex items-center gap-2 data-[state=active]:bg-trust-blue data-[state=active]:text-white">
              <Globe className="h-4 w-4" />
              All Countries
              <Badge variant="secondary" className="ml-1">
                {initiatives.length}
              </Badge>
            </TabsTrigger>
            {countries.map((country) => {
              const countryInitiatives = initiatives.filter(init => init.country === country);
              return (
                <TabsTrigger 
                  key={country} 
                  value={country} 
                  className="flex items-center gap-2 data-[state=active]:bg-trust-blue data-[state=active]:text-white"
                >
                  <MapPin className="h-4 w-4" />
                  {country}
                  <Badge variant="secondary" className="ml-1">
                    {countryInitiatives.length}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Initiatives</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-trust-blue">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Projects seeking support</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-hope-green">${stats.totalRaised.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across all initiatives</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Supporters</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-action-orange">{stats.totalSupporters}</div>
              <p className="text-xs text-muted-foreground">People making a difference</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent-purple">{stats.avgProgress}%</div>
              <p className="text-xs text-muted-foreground">Towards funding goals</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search initiatives..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredAndSortedInitiatives.length} of {initiatives.length} initiatives
            {selectedCategory !== "all" && ` in ${categories.find(c => c.value === selectedCategory)?.label}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* Initiatives Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-20 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAndSortedInitiatives.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedInitiatives.map((initiative) => (
              <SimplifiedInitiativeCard key={initiative.id} initiative={initiative} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No initiatives found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or explore different categories.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSortBy("recent");
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, GraduationCap, Globe, Heart } from "lucide-react";

interface ImpactStats {
  totalDonations: number;
  studentsHelped: number;
  initiativesActive: number;
  countriesReached: number;
  completionRate: number;
}

interface ImpactDashboardProps {
  stats: ImpactStats;
  showPersonalized?: boolean;
  userImpact?: {
    totalDonated: number;
    studentsSupported: number;
    initiativesSupported: number;
  };
}

export default function ImpactDashboard({ stats, showPersonalized, userImpact }: ImpactDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Global Impact */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-trust-blue" />
          Global Impact
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-trust-blue/10 to-trust-blue/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Total Donations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-trust-blue">
                ${stats.totalDonations.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Changing lives worldwide
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-action-orange/10 to-action-orange/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Students Helped
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-action-orange">
                {stats.studentsHelped.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Educational journeys supported
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent-purple/10 to-accent-purple/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Active Initiatives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent-purple">
                {stats.initiativesActive}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Projects making impact
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success-green/10 to-success-green/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Countries Reached
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success-green">
                {stats.countriesReached}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Global community
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Overall Success Rate</span>
            <Badge variant="secondary" className="bg-success-green/20 text-success-green">
              {stats.completionRate}% Success
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={stats.completionRate} className="h-3" />
          <p className="text-sm text-gray-600 mt-2">
            Of students who receive support complete their educational goals
          </p>
        </CardContent>
      </Card>

      {/* Personal Impact (if user is logged in) */}
      {showPersonalized && userImpact && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5 text-action-orange" />
            Your Personal Impact
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-action-orange/20 bg-action-orange/5">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-action-orange">
                  ${userImpact.totalDonated.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Total contributed</p>
              </CardContent>
            </Card>

            <Card className="border-trust-blue/20 bg-trust-blue/5">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-trust-blue">
                  {userImpact.studentsSupported}
                </div>
                <p className="text-sm text-gray-600">Students supported</p>
              </CardContent>
            </Card>

            <Card className="border-accent-purple/20 bg-accent-purple/5">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-accent-purple">
                  {userImpact.initiativesSupported}
                </div>
                <p className="text-sm text-gray-600">Initiatives backed</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
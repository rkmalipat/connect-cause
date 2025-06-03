import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Heart, ArrowLeft } from "lucide-react";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { login, register, user } = useAuth();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [userType, setUserType] = useState<'donor' | 'beneficiary' | 'initiative_runner'>('donor');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: '',
    bio: '',
    location: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Parse URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlMode = urlParams.get('mode');
    const urlType = urlParams.get('type');
    
    if (urlMode === 'register') setMode('register');
    if (urlType && ['donor', 'beneficiary', 'initiative_runner'].includes(urlType)) {
      setUserType(urlType as 'donor' | 'beneficiary' | 'initiative_runner');
    }
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation('/');
    }
  }, [user, setLocation]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const success = await login(formData.email, formData.password);
        if (success) {
          toast({
            title: "Welcome back!",
            description: "You've been successfully logged in.",
          });
          setLocation('/');
        } else {
          toast({
            title: "Login failed",
            description: "Invalid email or password.",
            variant: "destructive",
          });
        }
      } else {
        // Registration validation
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Password mismatch",
            description: "Passwords do not match.",
            variant: "destructive",
          });
          return;
        }

        if (formData.password.length < 6) {
          toast({
            title: "Password too short",
            description: "Password must be at least 6 characters long.",
            variant: "destructive",
          });
          return;
        }

        const userData = {
          email: formData.email,
          password: formData.password,
          username: formData.username,
          fullName: formData.fullName,
          userType,
          bio: formData.bio || null,
          location: formData.location || null,
          avatar: null,
          verified: false,
        };

        const success = await register(userData);
        if (success) {
          toast({
            title: "Welcome to ConnectCause!",
            description: "Your account has been created successfully.",
          });
          setLocation('/');
        } else {
          toast({
            title: "Registration failed",
            description: "User with this email already exists or invalid data.",
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getUserTypeDescription = (type: string) => {
    switch (type) {
      case 'donor':
        return 'Support initiatives and connect with beneficiaries';
      case 'beneficiary':
        return 'Receive support and share your journey';
      case 'initiative_runner':
        return 'Create and manage educational initiatives';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Heart className="h-12 w-12 text-trust-blue" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {mode === 'login' ? 'Welcome back' : 'Join ConnectCause'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'login' 
              ? 'Sign in to your account to continue making a difference'
              : 'Create your account and start making meaningful connections'
            }
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </CardTitle>
            {mode === 'register' && (
              <CardDescription>
                Choose your role and tell us about yourself
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === 'register' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="userType">I want to...</Label>
                    <Select value={userType} onValueChange={(value) => setUserType(value as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="donor">
                          <div>
                            <div className="font-medium">Be a Donor</div>
                            <div className="text-sm text-gray-500">Support initiatives and connect with beneficiaries</div>
                          </div>
                        </SelectItem>
                        <SelectItem value="beneficiary">
                          <div>
                            <div className="font-medium">Receive Support</div>
                            <div className="text-sm text-gray-500">Get help with education and share your journey</div>
                          </div>
                        </SelectItem>
                        <SelectItem value="initiative_runner">
                          <div>
                            <div className="font-medium">Run an Initiative</div>
                            <div className="text-sm text-gray-500">Create and manage educational programs</div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        required
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        placeholder="Choose a username"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                />
              </div>

              {mode === 'register' && (
                <>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirm your password"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location (Optional)</Label>
                    <Input
                      id="location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Tell us about yourself (Optional)</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Share a bit about your interests and goals..."
                      className="min-h-[80px]"
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full bg-trust-blue hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                >
                  {mode === 'login' ? 'Create a new account' : 'Sign in to existing account'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="ghost" onClick={() => setLocation('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
}

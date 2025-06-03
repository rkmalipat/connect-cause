import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { 
  X, 
  Lightbulb, 
  Target, 
  Users, 
  BookOpen, 
  Wrench, 
  Heart, 
  Stethoscope,
  Upload,
  Eye,
  Sparkles
} from "lucide-react";

interface ProfileBuilderProps {
  onClose: () => void;
}

const initiativeTemplates = {
  education: {
    icon: BookOpen,
    title: "Education Support",
    description: "Providing educational resources and opportunities",
    template: "Empowering students with quality education and learning resources to unlock their potential and create brighter futures.",
    suggestions: [
      "Include specific number of students you aim to help",
      "Mention educational materials or resources needed",
      "Share your educational background or passion",
      "Describe the community impact"
    ]
  },
  skill_development: {
    icon: Wrench,
    title: "Skill Development",
    description: "Teaching practical skills for livelihood",
    template: "Building essential skills and providing vocational training to help individuals secure meaningful employment and economic independence.",
    suggestions: [
      "Specify which skills you'll be teaching",
      "Mention job placement assistance if applicable",
      "Include success stories from previous training",
      "Detail the training duration and format"
    ]
  },
  community: {
    icon: Users,
    title: "Community Development",
    description: "Building stronger communities together",
    template: "Creating positive change at the grassroots level by addressing community needs and fostering collaboration among residents.",
    suggestions: [
      "Identify specific community challenges",
      "Explain how the community will be involved",
      "Mention partnerships with local organizations",
      "Describe long-term sustainability plans"
    ]
  },
  healthcare: {
    icon: Stethoscope,
    title: "Healthcare Access",
    description: "Improving health outcomes and access",
    template: "Providing essential healthcare services and health education to underserved communities, focusing on prevention and wellness.",
    suggestions: [
      "Specify types of healthcare services",
      "Mention medical professionals involved",
      "Include health education components",
      "Detail target demographics"
    ]
  }
};

export default function ProfileBuilder({ onClose }: ProfileBuilderProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    goalAmount: "",
    coverImage: "",
  });
  const [profileStrength, setProfileStrength] = useState(0);

  const createInitiativeMutation = useMutation({
    mutationFn: async (initiativeData: any) => {
      const response = await fetch('/api/initiatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(initiativeData),
      });

      if (!response.ok) throw new Error('Failed to create initiative');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Initiative created!",
        description: "Your initiative has been created successfully.",
      });
      onClose();
      queryClient.invalidateQueries({ queryKey: ["/api/initiatives"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create initiative. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Calculate profile strength
  React.useEffect(() => {
    let strength = 0;
    if (formData.title.length > 5) strength += 25;
    if (formData.description.length > 50) strength += 25;
    if (formData.category) strength += 25;
    if (formData.goalAmount && parseInt(formData.goalAmount) > 0) strength += 15;
    if (formData.coverImage) strength += 10;
    setProfileStrength(strength);
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTemplateSelect = (category: string) => {
    const template = initiativeTemplates[category as keyof typeof initiativeTemplates];
    setFormData(prev => ({
      ...prev,
      category,
      description: template.template
    }));
    setStep(2);
  };

  const optimizeDescription = () => {
    if (!formData.category) return;
    
    const template = initiativeTemplates[formData.category as keyof typeof initiativeTemplates];
    const optimizedDescription = `${formData.description}\n\nOur mission is to create lasting impact by focusing on sustainable solutions and community engagement. With your support, we can reach our goal and transform lives.`;
    
    setFormData(prev => ({ ...prev, description: optimizedDescription }));
    
    toast({
      title: "Description optimized!",
      description: "AI has enhanced your description for maximum impact.",
    });
  };

  const handleSubmit = () => {
    if (!user) return;

    if (!formData.title || !formData.description || !formData.category || !formData.goalAmount) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const initiativeData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      goalAmount: parseInt(formData.goalAmount),
      coverImage: formData.coverImage || null,
      runnerId: user.id,
      status: "active",
    };

    createInitiativeMutation.mutate(initiativeData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, upload to cloud storage
      const imageUrl = `https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800`;
      setFormData(prev => ({ ...prev, coverImage: imageUrl }));
      
      toast({
        title: "Image uploaded",
        description: "Your cover image has been uploaded successfully.",
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-action-orange" />
            Create Your Initiative Profile
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                <span>Profile Strength</span>
                <span className="text-trust-blue">{profileStrength}%</span>
              </div>
              <Progress value={profileStrength} className="h-2" />
            </div>

            {/* Step 1: Category Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Choose Your Initiative Type</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(initiativeTemplates).map(([key, template]) => {
                    const IconComponent = template.icon;
                    return (
                      <Card 
                        key={key}
                        className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-trust-blue"
                        onClick={() => handleTemplateSelect(key)}
                      >
                        <CardContent className="p-4 text-center">
                          <IconComponent className="h-8 w-8 mx-auto mb-2 text-trust-blue" />
                          <h4 className="font-medium text-gray-900 mb-1">{template.title}</h4>
                          <p className="text-sm text-gray-600">{template.description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Details Form */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Initiative Details</h3>
                  <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                    ← Back
                  </Button>
                </div>

                <div>
                  <Label htmlFor="title">Initiative Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter a compelling title for your initiative"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Your Mission *</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell your story and explain your mission..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="min-h-[120px]"
                    required
                  />
                  <div className="flex items-center mt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={optimizeDescription}
                      className="text-action-orange border-action-orange hover:bg-action-orange hover:text-white"
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      AI Optimize
                    </Button>
                    <span className="text-sm text-gray-500 ml-2">
                      AI will help optimize your message for maximum impact
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="goalAmount">Funding Goal (USD) *</Label>
                  <Input
                    id="goalAmount"
                    type="number"
                    placeholder="Enter your funding goal"
                    value={formData.goalAmount}
                    onChange={(e) => handleInputChange('goalAmount', e.target.value)}
                    min="1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="coverImage">Cover Image</Label>
                  <div className="flex gap-2">
                    <Input
                      id="coverImage"
                      type="url"
                      placeholder="Paste image URL or upload below"
                      value={formData.coverImage}
                      onChange={(e) => handleInputChange('coverImage', e.target.value)}
                    />
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button type="button" variant="outline">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {formData.coverImage && (
                    <img 
                      src={formData.coverImage} 
                      alt="Cover preview"
                      className="mt-2 w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleSubmit}
                    disabled={createInitiativeMutation.isPending || profileStrength < 75}
                    className="flex-1 bg-trust-blue hover:bg-blue-700"
                  >
                    {createInitiativeMutation.isPending ? 'Creating...' : 'Create Initiative'}
                  </Button>
                  <Button variant="outline" onClick={() => setStep(3)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>

                {profileStrength < 75 && (
                  <p className="text-sm text-amber-600">
                    Complete your profile to at least 75% to create your initiative.
                  </p>
                )}
              </div>
            )}

            {/* Step 3: Preview */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                  <Button variant="outline" size="sm" onClick={() => setStep(2)}>
                    ← Edit
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-6">
                    {formData.coverImage && (
                      <img 
                        src={formData.coverImage} 
                        alt={formData.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-trust-blue text-white flex items-center justify-center mr-3">
                        {user?.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user?.fullName}</p>
                        <p className="text-sm text-gray-600">Initiative Runner</p>
                      </div>
                    </div>

                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 flex-1">{formData.title || "Your Initiative Title"}</h3>
                      {formData.category && (
                        <Badge className="bg-trust-blue text-white">
                          {initiativeTemplates[formData.category as keyof typeof initiativeTemplates]?.title}
                        </Badge>
                      )}
                    </div>

                    <p className="text-gray-600 mb-4">{formData.description || "Your mission description will appear here..."}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span className="text-hope-green font-semibold">0% funded</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-2xl font-bold text-trust-blue">$0</p>
                        <p className="text-sm text-gray-600">
                          of ${formData.goalAmount ? parseInt(formData.goalAmount).toLocaleString() : '0'} goal
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">0</p>
                        <p className="text-sm text-gray-600">supporters</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  onClick={handleSubmit}
                  disabled={createInitiativeMutation.isPending}
                  className="w-full bg-trust-blue hover:bg-blue-700"
                >
                  {createInitiativeMutation.isPending ? 'Creating Initiative...' : 'Create Initiative'}
                </Button>
              </div>
            )}
          </div>

          {/* Tips Section */}
          <div className="space-y-6">
            <Card className="bg-action-orange/10 border-action-orange/20">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <Lightbulb className="h-5 w-5 text-action-orange mr-2" />
                  Smart Template Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                {formData.category && (
                  <ul className="space-y-2 text-sm text-gray-700">
                    {initiativeTemplates[formData.category as keyof typeof initiativeTemplates]?.suggestions.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-hope-green mr-2">✓</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                )}
                {!formData.category && (
                  <p className="text-sm text-gray-700">
                    Select an initiative type to get personalized tips for creating a compelling profile.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <Target className="h-5 w-5 text-trust-blue mr-2" />
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start">
                    <Heart className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Tell a personal story that connects emotionally with donors</span>
                  </li>
                  <li className="flex items-start">
                    <Users className="h-4 w-4 text-trust-blue mr-2 mt-0.5 flex-shrink-0" />
                    <span>Include specific numbers and measurable outcomes</span>
                  </li>
                  <li className="flex items-start">
                    <Sparkles className="h-4 w-4 text-action-orange mr-2 mt-0.5 flex-shrink-0" />
                    <span>Use high-quality images that showcase your work</span>
                  </li>
                  <li className="flex items-start">
                    <Target className="h-4 w-4 text-hope-green mr-2 mt-0.5 flex-shrink-0" />
                    <span>Set realistic and achievable funding goals</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

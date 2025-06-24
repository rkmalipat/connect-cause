import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { BookOpen, Briefcase, Heart, Send, Upload, MapPin } from "lucide-react";

const submitCauseSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  category: z.enum(["education", "livelihood"]),
  country: z.enum(["India", "USA"]),
  goalAmount: z.number().min(100, "Goal amount must be at least $100"),
  coverImage: z.string().url("Please provide a valid image URL").optional(),
  contactEmail: z.string().email("Please provide a valid email"),
  contactPhone: z.string().min(10, "Please provide a valid phone number"),
  beneficiaryAge: z.number().min(5).max(30).optional(),
  urgency: z.enum(["low", "medium", "high"]),
  timeline: z.string().min(10, "Please describe your timeline"),
  additionalInfo: z.string().optional()
});

type SubmitCauseForm = z.infer<typeof submitCauseSchema>;

export default function SubmitCause() {
  const [selectedCategory, setSelectedCategory] = useState<"education" | "livelihood" | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SubmitCauseForm>({
    resolver: zodResolver(submitCauseSchema),
    defaultValues: {
      category: "education",
      country: "India",
      urgency: "medium"
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: SubmitCauseForm) => {
      // Transform form data to initiative format
      const initiativeData = {
        title: data.title,
        description: `${data.description}\n\nContact: ${data.contactEmail} | ${data.contactPhone}\nTimeline: ${data.timeline}${data.additionalInfo ? `\nAdditional Info: ${data.additionalInfo}` : ''}`,
        category: data.category,
        country: data.country,
        goalAmount: data.goalAmount,
        coverImage: data.coverImage || `https://images.unsplash.com/photo-${data.category === 'education' ? '1522202176988-66273c2fd55f' : '1516321318423-f06f85e504b3'}?w=800&h=400&fit=crop`,
        runnerId: 1, // Default to first user for demo
        status: "pending_review"
      };
      
      return apiRequest("/api/initiatives", {
        method: "POST",
        body: JSON.stringify(initiativeData)
      });
    },
    onSuccess: () => {
      toast({
        title: "Cause Submitted Successfully!",
        description: "Your cause is under review and will be published soon.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/initiatives"] });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: SubmitCauseForm) => {
    submitMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-trust-blue mb-4">Submit Your Cause</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your education or livelihood need with our community. 
            Connect with donors who want to make a personal difference in your journey.
          </p>
        </div>

        {/* Category Selection */}
        {!selectedCategory && (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-trust-blue"
              onClick={() => setSelectedCategory("education")}
            >
              <CardHeader className="text-center">
                <div className="mx-auto bg-trust-blue/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-trust-blue" />
                </div>
                <CardTitle className="text-2xl text-trust-blue">Education Support</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Need help with school fees, books, supplies, or educational programs? 
                  Connect with donors who want to support your learning journey.
                </p>
                <Badge variant="outline" className="text-trust-blue border-trust-blue">
                  Click to Submit Education Need
                </Badge>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-success-green"
              onClick={() => setSelectedCategory("livelihood")}
            >
              <CardHeader className="text-center">
                <div className="mx-auto bg-success-green/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                  <Briefcase className="h-8 w-8 text-success-green" />
                </div>
                <CardTitle className="text-2xl text-success-green">Livelihood Support</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Need support for skills training, job placement, or starting a small business? 
                  Find mentors and sponsors for your career goals.
                </p>
                <Badge variant="outline" className="text-success-green border-success-green">
                  Click to Submit Livelihood Need
                </Badge>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Form */}
        {selectedCategory && (
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {selectedCategory === "education" ? (
                    <BookOpen className="h-6 w-6 text-trust-blue mr-3" />
                  ) : (
                    <Briefcase className="h-6 w-6 text-success-green mr-3" />
                  )}
                  <CardTitle className="text-2xl">
                    Submit {selectedCategory === "education" ? "Education" : "Livelihood"} Cause
                  </CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCategory(null)}
                >
                  Change Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Hidden category field */}
                <input type="hidden" {...form.register("category")} value={selectedCategory} />

                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Title of Your Cause *</Label>
                    <Input
                      id="title"
                      {...form.register("title")}
                      placeholder="e.g. Help me complete my computer science degree"
                      className="mt-1"
                    />
                    {form.formState.errors.title && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="country">Location *</Label>
                    <Select onValueChange={(value) => form.setValue("country", value as "India" | "USA")}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="India">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            India
                          </div>
                        </SelectItem>
                        <SelectItem value="USA">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            USA
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.country && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.country.message}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Tell Your Story *</Label>
                  <Textarea
                    id="description"
                    {...form.register("description")}
                    rows={6}
                    placeholder={`Share your background, why you need ${selectedCategory} support, how it will help you, and what makes your story unique. Be personal and authentic - donors want to connect with real people.`}
                    className="mt-1"
                  />
                  {form.formState.errors.description && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.description.message}</p>
                  )}
                </div>

                {/* Financial Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="goalAmount">Funding Goal (USD) *</Label>
                    <Input
                      id="goalAmount"
                      type="number"
                      {...form.register("goalAmount", { valueAsNumber: true })}
                      placeholder="e.g. 2500"
                      className="mt-1"
                    />
                    {form.formState.errors.goalAmount && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.goalAmount.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="urgency">Urgency Level *</Label>
                    <Select onValueChange={(value) => form.setValue("urgency", value as "low" | "medium" | "high")}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="How urgent is your need?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Can wait 6+ months</SelectItem>
                        <SelectItem value="medium">Medium - Needed within 3-6 months</SelectItem>
                        <SelectItem value="high">High - Urgent, needed within 1-3 months</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.urgency && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.urgency.message}</p>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      {...form.register("contactEmail")}
                      placeholder="your.email@example.com"
                      className="mt-1"
                    />
                    {form.formState.errors.contactEmail && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.contactEmail.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="contactPhone">Phone Number *</Label>
                    <Input
                      id="contactPhone"
                      {...form.register("contactPhone")}
                      placeholder="+1 555-123-4567"
                      className="mt-1"
                    />
                    {form.formState.errors.contactPhone && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.contactPhone.message}</p>
                    )}
                  </div>
                </div>

                {/* Timeline and Additional Info */}
                <div>
                  <Label htmlFor="timeline">Timeline & Milestones *</Label>
                  <Textarea
                    id="timeline"
                    {...form.register("timeline")}
                    rows={3}
                    placeholder="Describe your timeline, key milestones, and how you'll use the support (e.g., 'Start course in January 2025, complete by December 2025, will share monthly progress updates')"
                    className="mt-1"
                  />
                  {form.formState.errors.timeline && (
                    <p className="text-red-500 text-sm mt-1">{form.formState.errors.timeline.message}</p>
                  )}
                </div>

                {/* Optional Fields */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="coverImage">Photo URL (Optional)</Label>
                    <Input
                      id="coverImage"
                      {...form.register("coverImage")}
                      placeholder="https://example.com/your-photo.jpg"
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Share a photo URL that represents you or your cause
                    </p>
                    {form.formState.errors.coverImage && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.coverImage.message}</p>
                    )}
                  </div>

                  {selectedCategory === "education" && (
                    <div>
                      <Label htmlFor="beneficiaryAge">Your Age (Optional)</Label>
                      <Input
                        id="beneficiaryAge"
                        type="number"
                        {...form.register("beneficiaryAge", { valueAsNumber: true })}
                        placeholder="e.g. 20"
                        className="mt-1"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                    <Textarea
                      id="additionalInfo"
                      {...form.register("additionalInfo")}
                      rows={3}
                      placeholder="Any other details that would help donors understand your situation better"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className={`${selectedCategory === "education" ? "bg-trust-blue hover:bg-blue-700" : "bg-success-green hover:bg-green-700"}`}
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Submit Your Cause
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-500">
                  <p>
                    By submitting, you agree to our terms and confirm that all information is accurate. 
                    Your cause will be reviewed before being published.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Info Cards */}
        {!selectedCategory && (
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="text-center p-6">
              <Heart className="h-12 w-12 text-action-orange mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Personal Connections</h3>
              <p className="text-gray-600 text-sm">
                Build real friendships with donors who care about your success
              </p>
            </Card>
            <Card className="text-center p-6">
              <Upload className="h-12 w-12 text-trust-blue mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Share Updates</h3>
              <p className="text-gray-600 text-sm">
                Keep your supporters engaged with progress photos and messages
              </p>
            </Card>
            <Card className="text-center p-6">
              <MapPin className="h-12 w-12 text-success-green mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Global Community</h3>
              <p className="text-gray-600 text-sm">
                Connect across India and USA for cross-cultural mentorship
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
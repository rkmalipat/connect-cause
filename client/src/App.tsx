import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import Navigation from "@/components/navigation";
import Home from "@/pages/home";
import Auth from "@/pages/auth";
import BrowseInitiatives from "@/pages/browse-initiatives";
import Profile from "@/pages/profile";
import Messages from "@/pages/messages";
import Stories from "@/pages/stories";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/auth" component={Auth} />
        <Route path="/browse" component={BrowseInitiatives} />
        <Route path="/profile/:id?" component={Profile} />
        <Route path="/messages" component={Messages} />
        <Route path="/stories" component={Stories} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

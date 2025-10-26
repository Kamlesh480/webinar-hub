import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface RegistrationFormProps {
  webinar: {
    title: string;
    description: string;
    date_published: string;
    duration_minutes: number;
    learning_outcomes?: string[];
  };
}

const RegistrationForm = ({ webinar }: RegistrationFormProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email) {
      toast.error("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Store in localStorage (not sent to server)
    const registrations = JSON.parse(localStorage.getItem("webinar_registrations") || "[]");
    registrations.push({
      webinarTitle: webinar.title,
      ...formData,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("webinar_registrations", JSON.stringify(registrations));

    setIsSubmitted(true);
    toast.success("Registration successful! You'll receive webinar details via email.");
  };

  if (isSubmitted) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center">
        <div className="mb-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-2xl font-semibold mb-2">You're Registered!</h3>
        <p className="text-muted-foreground mb-6">
          We've sent the webinar details to <strong>{formData.email}</strong>
        </p>
        <Button onClick={() => setIsSubmitted(false)} variant="outline">
          Register Another
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Webinar Details Section */}
      <div className="bg-card rounded-xl border border-border p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">WEBINAR</span>
        </div>
        <h2 className="text-3xl font-bold mb-6">{webinar.title}</h2>
        
        {/* Date and Time */}
        <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{new Date(webinar.date_published).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{webinar.duration_minutes} minutes</span>
          </div>
        </div>

        {/* Learning Outcomes */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">In this session you will learn:</h3>
          <ul className="space-y-3">
            {(webinar.learning_outcomes || [
              'Key concepts and best practices',
              'Practical implementation strategies',
              'Real-world use cases and examples',
              'Q&A with industry experts'
            ]).map((outcome, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-muted-foreground">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Registration Form */}
      <div className="bg-card rounded-xl border border-border p-8">
        <h2 className="text-2xl font-semibold mb-2">Register for This Webinar</h2>
        <p className="text-muted-foreground mb-6">
          Fill out the form below to reserve your spot
        </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1"
          />
        </div>

        <Button type="submit" className="w-full" size="lg">
          Register Now
        </Button>
      </form>
      </div>
    </div>
  );
};

export default RegistrationForm;

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Leaf, ArrowLeft, Mail, Phone, MapPin } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const submitContactMutation = trpc.contact.submit.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await submitContactMutation.mutateAsync(data);
      toast.success("Message sent successfully! We'll get back to you soon.");
      reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="container mx-auto py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-accent" />
            <span className="font-bold text-lg">Serenity Wellness</span>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Get in Touch</h1>
            <p className="text-lg text-muted-foreground">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Mail className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Email</h3>
                  <p className="text-muted-foreground text-sm">info@serenity.com</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Phone className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                  <p className="text-muted-foreground text-sm">(555) 123-4567</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <MapPin className="w-8 h-8 text-accent mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">Location</h3>
                  <p className="text-muted-foreground text-sm">123 Serenity Lane<br />Wellness City, WC 12345</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>We'll get back to you within 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      {...register("name")}
                      className="mt-2"
                    />
                    {errors.name && (
                      <p className="text-destructive text-sm mt-2">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      {...register("email")}
                      className="mt-2"
                    />
                    {errors.email && (
                      <p className="text-destructive text-sm mt-2">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    {...register("phone")}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help you..."
                    {...register("message")}
                    className="mt-2 resize-none"
                    rows={6}
                  />
                  {errors.message && (
                    <p className="text-destructive text-sm mt-2">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-accent hover:bg-accent/90"
                  disabled={isSubmitting || submitContactMutation.isPending}
                >
                  {isSubmitting || submitContactMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Hours Section */}
          <Card className="border-border mt-8">
            <CardHeader>
              <CardTitle>Hours of Operation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Weekdays</h4>
                  <p className="text-muted-foreground">Monday - Friday</p>
                  <p className="text-lg font-semibold text-accent">9:00 AM - 6:00 PM</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Weekends</h4>
                  <p className="text-muted-foreground">Saturday - Sunday</p>
                  <p className="text-lg font-semibold text-accent">10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

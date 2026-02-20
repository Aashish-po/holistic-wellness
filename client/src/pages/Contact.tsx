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
import { ArrowLeft, Mail, Phone, MapPin, CheckCircle, AlertCircle, Clock } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSuccess, setIsSuccess] = useState(false);
  
  const submitContactMutation = trpc.contact.submit.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await submitContactMutation.mutateAsync(data);
      setIsSuccess(true);
      toast.success("Message sent successfully! We'll get back to you soon.");
      reset();
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "info@serenity.com",
      color: "accent-teal",
    },
    {
      icon: Phone,
      title: "Phone",
      value: "(555) 123-4567",
      color: "accent-purple",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "123 Serenity Lane, Wellness City, WC 12345",
      color: "accent-coral",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="navbar-sticky">
        <div className="container mx-auto py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </Link>
          <span className="font-bold text-lg">Contact Us</span>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16 fade-in">
            <h1 className="text-foreground mb-4">Get In Touch</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about our services? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div
                  key={index}
                  className="card-premium text-center scale-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`icon-circle ${info.color} mx-auto mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{info.title}</h3>
                  <p className="text-muted-foreground text-sm">{info.value}</p>
                </div>
              );
            })}
          </div>

          {/* Contact Form */}
          <Card className="card-premium border-2 border-accent/20">
            <CardHeader className="bg-gradient-to-r from-accent-purple/5 to-accent-teal/5">
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>We'll get back to you within 24 hours</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {isSuccess && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex gap-3 fade-in">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-green-900">Message Sent!</h3>
                    <p className="text-green-800 text-sm">Thank you for contacting us. We'll be in touch soon.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-foreground font-semibold">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      {...register("name")}
                      className="mt-2 border-2 border-border"
                    />
                    {errors.name && (
                      <p className="text-destructive text-sm mt-2 flex gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-foreground font-semibold">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      {...register("email")}
                      className="mt-2 border-2 border-border"
                    />
                    {errors.email && (
                      <p className="text-destructive text-sm mt-2 flex gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-foreground font-semibold">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    {...register("phone")}
                    className="mt-2 border-2 border-border"
                  />
                  {errors.phone && (
                    <p className="text-destructive text-sm mt-2 flex gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="subject" className="text-foreground font-semibold">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    placeholder="How can we help?"
                    {...register("subject")}
                    className="mt-2 border-2 border-border"
                  />
                  {errors.subject && (
                    <p className="text-destructive text-sm mt-2 flex gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="message" className="text-foreground font-semibold">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    {...register("message")}
                    className="mt-2 border-2 border-border resize-none"
                    rows={6}
                  />
                  {errors.message && (
                    <p className="text-destructive text-sm mt-2 flex gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={isSubmitting || submitContactMutation.isPending}
                >
                  {isSubmitting || submitContactMutation.isPending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </CardContent>
          </Card>

          {/* Hours Section */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Card className="card-premium bg-gradient-to-br from-accent-gold/5 to-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent-gold" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between pb-2 border-b border-border">
                  <span className="font-semibold">Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-border">
                  <span className="font-semibold">Saturday:</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Sunday:</span>
                  <span>Closed</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-premium bg-gradient-to-br from-accent-purple/5 to-accent-teal/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">✨</span>
                  Quick Response
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  We aim to respond to all inquiries within 24 hours during business days.
                </p>
                <p className="text-muted-foreground">
                  For urgent matters, please call us directly at <span className="font-semibold text-primary">(555) 123-4567</span>.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

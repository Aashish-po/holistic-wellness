import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const bookingSchema = z.object({
  serviceType: z.string().min(1, "Please select a service"),
  clientName: z.string().min(2, "Name must be at least 2 characters"),
  clientEmail: z.string().email("Invalid email address"),
  clientPhone: z.string().min(10, "Invalid phone number"),
  appointmentDate: z.string().min(1, "Please select a date"),
  appointmentTime: z.string().min(1, "Please select a time"),
  duration: z.string().min(1, "Please select a duration"),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function Booking() {
  const [selectedService, setSelectedService] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const createAppointmentMutation = trpc.appointments.create.useMutation({
    onSuccess: () => {
      setIsSuccess(true);
      toast.success("Appointment booked successfully!");
      setTimeout(() => setIsSuccess(false), 3000);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to book appointment");
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    await createAppointmentMutation.mutateAsync(data);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);
    return maxDate.toISOString().split("T")[0];
  };

  const services = [
    { id: "yoga", name: "Yoga - $45" },
    { id: "meditation", name: "Meditation - $35" },
    { id: "massage", name: "Massage Therapy - $60" },
    { id: "wellness", name: "Wellness Coaching - $55" },
  ];

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  const durations = ["30 minutes", "60 minutes", "90 minutes"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="navbar-sticky">
        <div className="container mx-auto py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </Link>
          <span className="font-bold text-lg">Book Your Wellness Session</span>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="container mx-auto py-12">
        <div className="max-w-2xl mx-auto">
          {isSuccess && (
            <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex gap-3 fade-in">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-green-900">Appointment Booked!</h3>
                <p className="text-green-800 text-sm">We'll confirm your appointment shortly</p>
              </div>
            </div>
          )}

          <div className="text-center mb-12 fade-in">
            <h1 className="text-foreground mb-4">Book Your Appointment</h1>
            <p className="text-lg text-muted-foreground">
              Choose a service and select your preferred date and time
            </p>
          </div>

          <Card className="card-premium border-2 border-accent/20">
            <CardHeader className="bg-gradient-to-r from-accent/5 to-accent-purple/5">
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>Fill in your information to complete the booking</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Service Selection */}
                <div>
                  <Label htmlFor="serviceType" className="text-base font-semibold mb-3 block text-foreground">
                    Select Service
                  </Label>
                  <Select
                    value={selectedService}
                    onValueChange={(value) => {
                      setSelectedService(value);
                      setValue("serviceType", value);
                    }}
                  >
                    <SelectTrigger className="border-2 border-border hover:border-primary transition-colors">
                      <SelectValue placeholder="Choose a wellness service..." />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.serviceType && (
                    <p className="text-destructive text-sm mt-2 flex gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {errors.serviceType.message}
                    </p>
                  )}
                </div>

                {/* Personal Information */}
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
                  <h3 className="font-semibold text-foreground">Your Information</h3>

                  <div>
                    <Label htmlFor="clientName" className="text-foreground font-semibold">
                      Full Name
                    </Label>
                    <Input
                      id="clientName"
                      placeholder="John Doe"
                      {...register("clientName")}
                      className="mt-2 border-2 border-border"
                    />
                    {errors.clientName && (
                      <p className="text-destructive text-sm mt-2">{errors.clientName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="clientEmail" className="text-foreground font-semibold">
                      Email
                    </Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      placeholder="john@example.com"
                      {...register("clientEmail")}
                      className="mt-2 border-2 border-border"
                    />
                    {errors.clientEmail && (
                      <p className="text-destructive text-sm mt-2">{errors.clientEmail.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="clientPhone" className="text-foreground font-semibold">
                      Phone Number
                    </Label>
                    <Input
                      id="clientPhone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      {...register("clientPhone")}
                      className="mt-2 border-2 border-border"
                    />
                    {errors.clientPhone && (
                      <p className="text-destructive text-sm mt-2">{errors.clientPhone.message}</p>
                    )}
                  </div>
                </div>

                {/* Date & Time Selection */}
                <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border border-border">
                  <div>
                    <Label htmlFor="appointmentDate" className="text-foreground font-semibold">
                      Preferred Date
                    </Label>
                    <Input
                      id="appointmentDate"
                      type="date"
                      min={getMinDate()}
                      max={getMaxDate()}
                      {...register("appointmentDate")}
                      className="mt-2 border-2 border-border"
                    />
                    {errors.appointmentDate && (
                      <p className="text-destructive text-sm mt-2">{errors.appointmentDate.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="appointmentTime" className="text-foreground font-semibold">
                      Preferred Time
                    </Label>
                    <Select
                      value={appointmentTime}
                      onValueChange={(value) => {
                        setValue("appointmentTime", value);
                      }}
                    >
                      <SelectTrigger className="mt-2 border-2 border-border">
                        <SelectValue placeholder="Select a time..." />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.appointmentTime && (
                      <p className="text-destructive text-sm mt-2">{errors.appointmentTime.message}</p>
                    )}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <Label htmlFor="duration" className="text-foreground font-semibold">
                    Session Duration
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      setValue("duration", value);
                    }}
                  >
                    <SelectTrigger className="mt-2 border-2 border-border">
                      <SelectValue placeholder="Select duration..." />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map((duration) => (
                        <SelectItem key={duration} value={duration}>
                          {duration}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.duration && (
                    <p className="text-destructive text-sm mt-2">{errors.duration.message}</p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes" className="text-foreground font-semibold">
                    Additional Notes (Optional)
                  </Label>
                  <textarea
                    id="notes"
                    placeholder="Any special requests or health concerns we should know about?"
                    {...register("notes")}
                    rows={4}
                    className="mt-2 w-full border-2 border-border rounded-lg p-3"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={isSubmitting || createAppointmentMutation.isPending}
                >
                  {isSubmitting || createAppointmentMutation.isPending ? "Booking..." : "Confirm Booking"}
                </button>
              </form>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <div className="card-premium bg-gradient-to-br from-accent-purple/5 to-accent-teal/5 border-l-4 border-accent-purple">
              <h3 className="font-bold text-foreground mb-2">💡 Pro Tip</h3>
              <p className="text-sm text-muted-foreground">
                Book at least 24 hours in advance for better availability
              </p>
            </div>
            <div className="card-premium bg-gradient-to-br from-accent-coral/5 to-accent-gold/5 border-l-4 border-accent-coral">
              <h3 className="font-bold text-foreground mb-2">❓ Questions?</h3>
              <p className="text-sm text-muted-foreground">
                <Link href="/contact" className="text-primary hover:underline">
                  Contact us
                </Link>
                {" "}for more information
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

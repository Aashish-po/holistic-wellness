import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Leaf, ArrowLeft } from "lucide-react";

const bookingSchema = z.object({
  clientName: z.string().min(2, "Name must be at least 2 characters"),
  clientEmail: z.string().email("Invalid email address"),
  clientPhone: z.string().min(10, "Phone must be at least 10 digits"),
  serviceType: z.string().min(1, "Please select a service"),
  appointmentDate: z.string().min(1, "Please select a date"),
  appointmentTime: z.string().min(1, "Please select a time"),
  duration: z.string().min(1, "Please select a duration"),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const services = [
  { id: "yoga", name: "Yoga", duration: 60, price: 45 },
  { id: "meditation", name: "Meditation", duration: 45, price: 35 },
  { id: "massage", name: "Massage Therapy", duration: 60, price: 60 },
  { id: "coaching", name: "Wellness Coaching", duration: 50, price: 50 },
];

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM",
  "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM",
];

export default function Booking() {
  const [selectedService, setSelectedService] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const createAppointmentMutation = trpc.appointments.create.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const appointmentDate = watch("appointmentDate");
  const appointmentTime = watch("appointmentTime");

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    try {
      const [year, month, day] = data.appointmentDate.split("-");
      const [hours, minutes] = data.appointmentTime.split(":").map(Number);
      const appointmentDateTime = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        hours,
        minutes
      );

      const selectedServiceObj = services.find(s => s.id === data.serviceType);

      await createAppointmentMutation.mutateAsync({
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        serviceType: data.serviceType,
        appointmentDate: appointmentDateTime,
        duration: selectedServiceObj?.duration || 60,
        notes: data.notes || "",
      });

      toast.success("Appointment booked successfully! We'll send you a confirmation email shortly.");
      reset();
      setSelectedService("");
    } catch (error) {
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="navbar-sticky">
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
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 fade-in">
            <h1
              className="text-foreground mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Book Your Appointment
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose a service and select your preferred date and time
            </p>
          </div>

          <Card className="card-premium">
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>Fill in your information to complete the booking</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Service Selection */}
                <div>
                  <Label htmlFor="serviceType" className="text-base font-semibold mb-3 block text-foreground">
                    Select Service
                  </Label>
                  <Select value={selectedService} onValueChange={(value) => {
                    setSelectedService(value);
                    setValue("serviceType", value);
                  }}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a service..." />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - ${service.price} ({service.duration} min)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.serviceType && (
                    <p className="text-destructive text-sm mt-2">{errors.serviceType.message}</p>
                  )}
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="clientName" className="text-foreground font-semibold">Full Name</Label>
                    <Input
                      id="clientName"
                      placeholder="John Doe"
                      {...register("clientName")}
                      className="mt-2"
                    />
                    {errors.clientName && (
                      <p className="text-destructive text-sm mt-2">{errors.clientName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="clientEmail" className="text-foreground font-semibold">Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      placeholder="john@example.com"
                      {...register("clientEmail")}
                      className="mt-2"
                    />
                    {errors.clientEmail && (
                      <p className="text-destructive text-sm mt-2">{errors.clientEmail.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="clientPhone" className="text-foreground font-semibold">Phone Number</Label>
                    <Input
                      id="clientPhone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      {...register("clientPhone")}
                      className="mt-2"
                    />
                    {errors.clientPhone && (
                      <p className="text-destructive text-sm mt-2">{errors.clientPhone.message}</p>
                    )}
                  </div>
                </div>

                {/* Date & Time Selection */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="appointmentDate" className="text-foreground font-semibold">Preferred Date</Label>
                    <Input
                      id="appointmentDate"
                      type="date"
                      min={getMinDate()}
                      max={getMaxDate()}
                      {...register("appointmentDate")}
                      className="mt-2"
                    />
                    {errors.appointmentDate && (
                      <p className="text-destructive text-sm mt-2">{errors.appointmentDate.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="appointmentTime" className="text-foreground font-semibold">Preferred Time</Label>
                    <Select value={appointmentTime} onValueChange={(value) => {
                      setValue("appointmentTime", value);
                    }}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select time..." />
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
                  <Label htmlFor="duration" className="text-foreground font-semibold">Session Duration</Label>
                  <Select value={watch("duration")} onValueChange={(value) => {
                    setValue("duration", value);
                  }}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select duration..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.duration && (
                    <p className="text-destructive text-sm mt-2">{errors.duration.message}</p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes" className="text-foreground font-semibold">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any specific requests or health considerations..."
                    {...register("notes")}
                    className="mt-2 resize-none"
                    rows={4}
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

          {/* Info Box */}
          <div className="mt-8 bg-accent/10 border border-accent/20 rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-2">What to Expect</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>✓ You'll receive a confirmation email with your appointment details</li>
              <li>✓ Please arrive 10 minutes early for your first appointment</li>
              <li>✓ Cancellations must be made 24 hours in advance</li>
              <li>✓ Our wellness center is located at 123 Serenity Lane, Wellness City</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

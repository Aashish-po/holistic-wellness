import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Zap, Users, Leaf, Facebook, Instagram, Twitter, Mail } from "lucide-react";

const services = [
  {
    id: 1,
    name: "Yoga",
    description: "Strengthen your body and calm your mind through ancient yoga practices",
    price: "$45",
    icon: "🧘",
    color: "bg-green-50",
  },
  {
    id: 2,
    name: "Meditation",
    description: "Find inner peace and clarity through guided meditation sessions",
    price: "$35",
    icon: "🕉️",
    color: "bg-blue-50",
  },
  {
    id: 3,
    name: "Massage Therapy",
    description: "Release tension and restore balance with therapeutic massage",
    price: "$60",
    icon: "💆",
    color: "bg-amber-50",
  },
  {
    id: 4,
    name: "Wellness Coaching",
    description: "Personalized guidance for holistic health and lifestyle transformation",
    price: "$75",
    icon: "🌟",
    color: "bg-purple-50",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Yoga Enthusiast",
    text: "Serenity has completely transformed my wellness journey. The instructors are incredibly knowledgeable and caring.",
    image: "👩",
  },
  {
    name: "Michael Chen",
    role: "Meditation Practitioner",
    text: "The peaceful atmosphere and expert guidance have helped me achieve a level of mindfulness I never thought possible.",
    image: "👨",
  },
  {
    name: "Emma Davis",
    role: "Wellness Coach Client",
    text: "The holistic approach to wellness here is unmatched. I feel healthier and happier than ever before.",
    image: "👩",
  },
];

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Navigation */}
      <nav className="navbar-sticky">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
              Serenity Wellness
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-foreground hover:text-primary transition-colors">
              Services
            </a>
            <a href="#testimonials" className="text-foreground hover:text-primary transition-colors">
              Testimonials
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </a>
            <button
              onClick={() => setLocation("/booking")}
              className="btn-primary"
            >
              Book Now
            </button>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setLocation("/booking")}
              className="btn-primary text-sm"
            >
              Book
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48">
        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h1
                className="text-foreground mb-6 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Find Your Inner Peace at Serenity
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Discover holistic wellness through yoga, meditation, massage therapy, and personalized wellness coaching. Transform your mind, body, and spirit in our peaceful sanctuary.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setLocation("/booking")}
                  className="btn-primary"
                >
                  Book an Appointment
                </button>
                <button
                  onClick={() => setLocation("/services")}
                  className="btn-secondary"
                >
                  Explore Services
                </button>
              </div>
            </div>
            <div className="hidden md:block slide-in-right">
              <div className="relative h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl flex items-center justify-center">
                <Leaf className="w-48 h-48 text-primary/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-foreground mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our range of wellness services designed to nurture your body and mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="service-card"
                style={{
                  animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className={`text-5xl mb-4 ${service.color} p-4 rounded-2xl inline-block`}>
                  {service.icon}
                </div>
                <h3
                  className="text-xl font-bold text-foreground mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {service.name}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">{service.price}</span>
                  <button
                    onClick={() => setLocation("/booking")}
                    className="btn-primary text-sm"
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-background">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center scale-up">
              <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3
                className="text-xl font-bold text-foreground mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Holistic Care
              </h3>
              <p className="text-muted-foreground">
                We address your complete wellness - mind, body, and spirit
              </p>
            </div>
            <div className="text-center scale-up" style={{ animationDelay: "0.1s" }}>
              <div className="inline-block p-4 bg-accent/10 rounded-full mb-4">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3
                className="text-xl font-bold text-foreground mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Expert Instructors
              </h3>
              <p className="text-muted-foreground">
                Certified professionals with years of experience in wellness
              </p>
            </div>
            <div className="text-center scale-up" style={{ animationDelay: "0.2s" }}>
              <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3
                className="text-xl font-bold text-foreground mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Transformative Results
              </h3>
              <p className="text-muted-foreground">
                Experience real, lasting changes in your health and wellbeing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section-padding bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-foreground mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              What Our Clients Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Join hundreds of satisfied clients on their wellness journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="card-premium"
                style={{
                  animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl">{testimonial.image}</div>
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto text-center">
          <h2
            className="text-foreground mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ready to Begin Your Wellness Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Take the first step towards a healthier, more peaceful life. Book your session today.
          </p>
          <button
            onClick={() => setLocation("/booking")}
            className="btn-primary"
          >
            Schedule Your Session
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-5 h-5" />
                <span className="font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Serenity Wellness
                </span>
              </div>
              <p className="text-background/80 text-sm">
                Your sanctuary for holistic wellness and inner peace
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-background/80">
                <li>
                  <a href="#services" className="hover:text-background transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-background transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-background transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-background/80">
                <li>Yoga Classes</li>
                <li>Meditation</li>
                <li>Massage Therapy</li>
                <li>Wellness Coaching</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="hover:text-background transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-background transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-background transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-background transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-background/20 pt-8 text-center text-sm text-background/80">
            <p>&copy; 2026 Serenity Holistic Wellness. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Heart, Leaf, Brain, Zap, Star, ArrowRight, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  const services = [
    {
      id: "yoga",
      name: "Yoga",
      description: "Strengthen your body and calm your mind through ancient yoga practices",
      price: "$45",
      icon: Leaf,
      color: "purple",
      gradient: "bg-gradient-purple",
      badge: "Most Popular",
    },
    {
      id: "meditation",
      name: "Meditation",
      description: "Find inner peace and clarity through guided meditation sessions",
      price: "$35",
      icon: Brain,
      color: "teal",
      gradient: "bg-gradient-teal",
      badge: "Beginner Friendly",
    },
    {
      id: "massage",
      name: "Massage Therapy",
      description: "Release tension and restore balance with therapeutic massage",
      price: "$60",
      icon: Heart,
      color: "coral",
      gradient: "bg-gradient-secondary",
      badge: "Premium",
    },
    {
      id: "wellness",
      name: "Wellness Coaching",
      description: "Personalized guidance for your holistic wellness journey",
      price: "$55",
      icon: Zap,
      color: "gold",
      gradient: "bg-gradient-accent",
      badge: "Personalized",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Yoga Enthusiast",
      content: "Serenity has completely transformed my wellness journey. The instructors are incredibly knowledgeable and caring.",
      initials: "SJ",
      color: "#9b59b6",
    },
    {
      name: "Michael Chen",
      role: "Meditation Practitioner",
      content: "The meditation sessions have brought so much peace into my daily life. Highly recommended!",
      initials: "MC",
      color: "#1abc9c",
    },
    {
      name: "Emma Wilson",
      role: "Wellness Client",
      content: "Best wellness center I've ever been to. The atmosphere is so calming and the staff is wonderful.",
      initials: "EW",
      color: "#ff6b6b",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="navbar-sticky">
        <div className="container mx-auto py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-bold text-lg">Serenity Wellness</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-foreground hover:text-primary transition-colors">
              Services
            </a>
            <a href="#testimonials" className="text-foreground hover:text-primary transition-colors">
              Testimonials
            </a>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            <Link href="/booking">
              <Button className="btn-primary">Book Now</Button>
            </Link>
          </div>

          <div className="md:hidden flex gap-2">
            <Link href="/booking">
              <Button className="btn-primary text-sm">Book</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent-purple rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl fade-in">
            <h1 className="text-foreground mb-6">Find Your Inner Peace at Serenity</h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Discover holistic wellness through yoga, meditation, massage therapy, and personalized wellness coaching.
              Transform your mind, body, and spirit in our peaceful sanctuary.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/booking">
                <Button className="btn-primary">Book an Appointment</Button>
              </Link>
              <a href="#services">
                <Button className="btn-secondary">Explore Services</Button>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12 pt-12 border-t border-border">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">500+</div>
                <p className="text-sm text-muted-foreground">Happy Clients</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">10+</div>
                <p className="text-sm text-muted-foreground">Expert Instructors</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">5 Yrs</div>
                <p className="text-sm text-muted-foreground">In Business</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 md:py-32 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-foreground mb-4">Our Wellness Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our range of holistic wellness services designed to nurture your body and mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className={`service-card ${service.id} slide-in-left`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onMouseEnter={() => setHoveredService(service.id)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  {/* Badge */}
                  <div className={`badge badge-${service.color} mb-4 inline-block`}>
                    {service.badge}
                  </div>

                  {/* Icon */}
                  <div className={`icon-circle ${service.color} mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-2">{service.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{service.description}</p>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-2xl font-bold gradient-text">{service.price}</span>
                    <Link href="/booking">
                      <button className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white transition-all">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 md:py-32 bg-muted">
        <div className="container mx-auto">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-foreground mb-4">Why Choose Serenity?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the difference with our holistic approach to wellness
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🌿",
                title: "Expert Instructors",
                description: "Certified professionals with years of experience in holistic wellness",
              },
              {
                icon: "🧘",
                title: "Personalized Approach",
                description: "Customized wellness plans tailored to your unique needs and goals",
              },
              {
                icon: "✨",
                title: "Peaceful Environment",
                description: "A serene sanctuary designed for relaxation and inner transformation",
              },
            ].map((item, index) => (
              <div key={index} className="card-premium text-center scale-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-32 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-foreground mb-4">What Our Clients Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from our satisfied wellness community members
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card slide-in-right" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="avatar-circle" style={{ background: testimonial.color }}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-foreground italic">"{testimonial.content}"</p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-primary text-white">
        <div className="container mx-auto text-center fade-in">
          <h2 className="text-white mb-4">Ready to Transform Your Wellness?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of clients who have discovered their path to inner peace and holistic wellness
          </p>
          <Link href="/booking">
            <Button className="btn-primary">Start Your Journey Today</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Serenity Wellness</h4>
              <p className="text-white/70 text-sm">Your sanctuary for holistic wellness and inner peace</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#services" className="text-white/70 hover:text-white transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <Link href="/blog" className="text-white/70 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                {services.map((service) => (
                  <li key={service.id}>
                    <a href="#services" className="text-white/70 hover:text-white transition-colors">
                      {service.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-white/70 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-sm text-white/70">
            <p>&copy; 2024 Serenity Holistic Wellness. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

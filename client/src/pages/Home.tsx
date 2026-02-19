import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Leaf, Heart, Zap, Users } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-accent" />
            <span className="font-bold text-lg text-foreground">Serenity Wellness</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#services" className="text-foreground hover:text-accent transition-colors">Services</Link>
            <Link href="/#blog" className="text-foreground hover:text-accent transition-colors">Blog</Link>
            <Link href="/contact" className="text-foreground hover:text-accent transition-colors">Contact</Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link href="/admin" className="text-foreground hover:text-accent transition-colors">Admin</Link>
            )}
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/admin" className="text-sm">
                <Button variant="outline">Dashboard</Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button>Sign In</Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-white to-background py-20 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-accent/50 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Find Your Inner Peace at Serenity
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Discover holistic wellness through yoga, meditation, massage therapy, and personalized wellness coaching. Transform your mind, body, and spirit.
              </p>
              <div className="flex gap-4">
                <Link href="/booking">
                  <Button size="lg" className="bg-accent hover:bg-accent/90">
                    Book an Appointment
                  </Button>
                </Link>
                <Link href="/#services">
                  <Button size="lg" variant="outline">
                    Explore Services
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="w-full h-96 bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl border border-accent/20 flex items-center justify-center">
                <Leaf className="w-32 h-32 text-accent/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our range of wellness services designed to nurture your body and mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: "Yoga", description: "Strengthen your body and calm your mind", price: "$45" },
              { icon: Zap, title: "Meditation", description: "Find inner peace and clarity", price: "$35" },
              { icon: Users, title: "Massage Therapy", description: "Release tension and restore balance", price: "$60" },
              { icon: Leaf, title: "Wellness Coaching", description: "Personalized guidance for your journey", price: "$50" },
            ].map((service, idx) => (
              <div key={idx} className="bg-background border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <service.icon className="w-12 h-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-accent">{service.price}</span>
                  <Link href="/booking">
                    <Button size="sm" variant="outline">Book</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview Section */}
      <section id="blog" className="py-20 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Wellness Blog</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn tips, insights, and practices for a healthier, more balanced life
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "The Benefits of Daily Meditation", category: "Meditation", excerpt: "Discover how just 10 minutes of daily meditation can transform your mental health..." },
              { title: "Yoga for Better Sleep", category: "Yoga", excerpt: "Learn gentle yoga poses that promote deep, restorative sleep..." },
              { title: "Nutrition for Wellness", category: "Nutrition", excerpt: "Explore how mindful eating can enhance your overall well-being..." },
            ].map((post, idx) => (
              <div key={idx} className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-accent/10 to-accent/5"></div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{post.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
                  <Link href="/blog">
                    <Button variant="outline" size="sm">Read More</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/blog">
              <Button size="lg" variant="outline">View All Articles</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Wellness Journey?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Book your first appointment today and take the first step towards a healthier, more balanced life.
          </p>
          <Link href="/booking">
            <Button size="lg" className="bg-white text-accent hover:bg-white/90">
              Book Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-5 h-5" />
                <span className="font-bold">Serenity Wellness</span>
              </div>
              <p className="text-sm opacity-75">Holistic wellness for mind, body, and spirit.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li><Link href="/#services">Services</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li>Yoga Classes</li>
                <li>Meditation Sessions</li>
                <li>Massage Therapy</li>
                <li>Wellness Coaching</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-sm opacity-75">
                Email: info@serenity.com<br />
                Phone: (555) 123-4567
              </p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm opacity-75">
            <p>&copy; 2026 Serenity Holistic Wellness. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

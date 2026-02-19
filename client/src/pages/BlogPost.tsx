import { useRoute } from "wouter";
import { Link } from "wouter";
import { Leaf, ArrowLeft, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";

export default function BlogPost() {
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug as string;

  const { data: post, isLoading, error } = trpc.blog.getBySlug.useQuery(slug, {
    enabled: !!slug,
  });

  if (!match) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading article...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-white border-b border-border">
          <div className="container mx-auto py-4">
            <Link href="/blog" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Blog</span>
            </Link>
          </div>
        </div>
        <div className="container mx-auto py-12 text-center">
          <p className="text-muted-foreground">Article not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="container mx-auto py-4 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Blog</span>
          </Link>
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-accent" />
            <span className="font-bold text-lg">Serenity Wellness</span>
          </div>
          <div className="w-32"></div>
        </div>
      </div>

      <div className="container mx-auto py-12">
        <article className="max-w-3xl mx-auto">
          {/* Featured Image */}
          <div className="mb-8 h-96 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl border border-accent/20"></div>

          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                {post.category}
              </span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                {post.author}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-muted-foreground">
              {post.excerpt}
            </p>
          </div>

          {/* Article Content */}
          <Card className="border-border mb-12">
            <CardContent className="pt-8 prose prose-sm max-w-none">
              <Streamdown>
                {post.content}
              </Streamdown>
            </CardContent>
          </Card>

          {/* Author Info */}
          <Card className="border-border bg-accent/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{post.author}</h3>
                  <p className="text-sm text-muted-foreground">
                    Wellness expert and contributor at Serenity Holistic Wellness
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="mt-12 bg-accent text-white rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to start your wellness journey?</h3>
            <p className="mb-6 opacity-90">
              Book an appointment with one of our wellness practitioners today.
            </p>
            <Link href="/booking">
              <Button size="lg" className="bg-white text-accent hover:bg-white/90">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Related Articles */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-foreground mb-8">More Articles</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <Link key={i} href="/blog">
                  <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardContent className="pt-6">
                      <div className="h-32 bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg mb-4"></div>
                      <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full mb-3">
                        Wellness
                      </span>
                      <h4 className="font-semibold text-foreground mb-2 line-clamp-2">
                        Explore more wellness tips and insights
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        Discover more articles to support your wellness journey...
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

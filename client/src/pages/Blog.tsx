import { useState } from "react";
import { Link } from "wouter";
import { Leaf, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: blogPosts = [] as any[], isLoading } = trpc.blog.list.useQuery({
    limit: 50,
    offset: 0,
  });

  const categories = Array.from(new Set(blogPosts.map((post: any) => post.category)));

  const filteredPosts = blogPosts.filter((post: any) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Wellness Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover insights, tips, and practices for a healthier, more balanced life
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-12 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-accent hover:bg-accent/90" : ""}
            >
              All Articles
            </Button>
            {categories.map((category: any) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category as string)}
                className={selectedCategory === category ? "bg-accent hover:bg-accent/90" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading articles...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found. Try adjusting your search.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPosts.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="border-border hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-4 gap-6">
                        {/* Featured Image Placeholder */}
                        <div className="md:col-span-1">
                          <div className="h-40 bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg border border-accent/20"></div>
                        </div>

                        {/* Content */}
                        <div className="md:col-span-3">
                          <div className="flex items-start justify-between mb-3">
                            <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">
                              {post.category}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">By {post.author}</span>
                            <Button variant="outline" size="sm">
                              Read More →
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

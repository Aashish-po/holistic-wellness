import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Leaf, LogOut, Calendar, FileText, Mail, AlertCircle } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function Admin() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogSlug, setNewBlogSlug] = useState("");
  const [newBlogExcerpt, setNewBlogExcerpt] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [newBlogCategory, setNewBlogCategory] = useState("");

  const { data: appointments = [] as any[] } = trpc.appointments.list.useQuery(undefined as any);
  const { data: blogPosts = [] as any[] } = trpc.blog.allPosts.useQuery(undefined as any);
  const { data: contactSubmissions = [] as any[] } = trpc.contact.list.useQuery(undefined as any);

  const updateAppointmentMutation = trpc.appointments.updateStatus.useMutation();
  const createBlogMutation = trpc.blog.create.useMutation();
  const deleteBlogMutation = trpc.blog.delete.useMutation();
  const markContactAsReadMutation = trpc.contact.markAsRead.useMutation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Card className="border-border max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You need to be logged in as an admin to access this page.
            </p>
            <a href={getLoginUrl()}>
              <Button className="w-full bg-accent hover:bg-accent/90">Sign In</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleUpdateAppointmentStatus = async (id: number, status: string) => {
    try {
      await updateAppointmentMutation.mutateAsync({
        id,
        status: status as any,
      });
      toast.success("Appointment updated");
    } catch (error) {
      toast.error("Failed to update appointment");
    }
  };

  const handleCreateBlog = async () => {
    if (!newBlogTitle || !newBlogSlug || !newBlogExcerpt || !newBlogContent || !newBlogCategory) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createBlogMutation.mutateAsync({
        title: newBlogTitle,
        slug: newBlogSlug,
        excerpt: newBlogExcerpt,
        content: newBlogContent,
        category: newBlogCategory,
        author: user?.name || "Admin",
        published: 1,
      });
      toast.success("Blog post created");
      setNewBlogTitle("");
      setNewBlogSlug("");
      setNewBlogExcerpt("");
      setNewBlogContent("");
      setNewBlogCategory("");
    } catch (error) {
      toast.error("Failed to create blog post");
    }
  };

  const handleDeleteBlog = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deleteBlogMutation.mutateAsync(id);
      toast.success("Blog post deleted");
    } catch (error) {
      toast.error("Failed to delete blog post");
    }
  };

  const handleMarkContactAsRead = async (id: number) => {
    try {
      await markContactAsReadMutation.mutateAsync(id);
      toast.success("Marked as read");
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40">
        <div className="container mx-auto py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-accent" />
            <span className="font-bold text-lg">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {user?.name}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                setLocation("/");
              }}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <Tabs defaultValue="appointments" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Appointments</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Blog</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Contact</span>
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Appointment Management</CardTitle>
                <CardDescription>View and manage client appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold">Client</th>
                        <th className="text-left py-3 px-4 font-semibold">Service</th>
                        <th className="text-left py-3 px-4 font-semibold">Date</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(appointments as any[]).map((apt: any) => (
                        <tr key={apt.id} className="border-b border-border hover:bg-background">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-foreground">{apt.clientName}</p>
                              <p className="text-xs text-muted-foreground">{apt.clientEmail}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">{apt.serviceType}</td>
                          <td className="py-3 px-4">
                            {new Date(apt.appointmentDate).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(apt.status)}>
                              {apt.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Select
                              value={apt.status}
                              onValueChange={(value) =>
                                handleUpdateAppointmentStatus(apt.id, value)
                              }
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Create New Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={newBlogTitle}
                    onChange={(e) => setNewBlogTitle(e.target.value)}
                    placeholder="Post title"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Slug</Label>
                  <Input
                    value={newBlogSlug}
                    onChange={(e) => setNewBlogSlug(e.target.value)}
                    placeholder="post-slug"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input
                    value={newBlogCategory}
                    onChange={(e) => setNewBlogCategory(e.target.value)}
                    placeholder="e.g., Yoga, Meditation"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Excerpt</Label>
                  <Textarea
                    value={newBlogExcerpt}
                    onChange={(e) => setNewBlogExcerpt(e.target.value)}
                    placeholder="Brief summary"
                    className="mt-2"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Content</Label>
                  <Textarea
                    value={newBlogContent}
                    onChange={(e) => setNewBlogContent(e.target.value)}
                    placeholder="Full post content (supports markdown)"
                    className="mt-2"
                    rows={6}
                  />
                </div>
                <Button
                  onClick={handleCreateBlog}
                  className="w-full bg-accent hover:bg-accent/90"
                  disabled={createBlogMutation.isPending}
                >
                  {createBlogMutation.isPending ? "Creating..." : "Create Post"}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Published Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(blogPosts as any[]).map((post: any) => (
                    <div key={post.id} className="border border-border rounded-lg p-4 flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{post.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{post.excerpt}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{post.category}</Badge>
                          <Badge variant={post.published ? "default" : "secondary"}>
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteBlog(post.id)}
                        disabled={deleteBlogMutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Contact Submissions</CardTitle>
                <CardDescription>View and manage contact form submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(contactSubmissions as any[]).map((submission: any) => (
                    <div
                      key={submission.id}
                      className={`border border-border rounded-lg p-4 ${
                        submission.read ? "bg-background" : "bg-accent/5"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground">{submission.name}</h4>
                          <p className="text-sm text-muted-foreground">{submission.email}</p>
                          {submission.phone && (
                            <p className="text-sm text-muted-foreground">{submission.phone}</p>
                          )}
                        </div>
                        <Badge variant={submission.read ? "secondary" : "default"}>
                          {submission.read ? "Read" : "Unread"}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground mt-3">{submission.message}</p>
                      <div className="flex gap-2 mt-4">
                        {!submission.read && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkContactAsRead(submission.id)}
                            disabled={markContactAsReadMutation.isPending}
                          >
                            Mark as Read
                          </Button>
                        )}
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {(appointments as any[]).length}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Confirmed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">
                    {(appointments as any[]).filter((a: any) => a.status === "confirmed").length}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Blog Posts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {(blogPosts as any[]).length}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Unread Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    {(contactSubmissions as any[]).filter((c: any) => !c.read).length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

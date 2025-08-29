import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, MessageSquare, Calendar, Users, Code, Zap } from "lucide-react";
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

const CollabSpace = () => {
  return (
    <>
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-6xl">
          <div className="font-bold text-xl text-primary">
            Collab Space
          </div>
          <div className="flex gap-4">
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">Community</Button>
            <Button variant="outline" asChild>
              <Link href={route('login')}>
                Log in
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Based on your original design */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <Badge variant="secondary" className="mb-6">
                Real Projects. Real Feedback.
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground">
                Collab Space
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                A collaborative platform where tinkerers share projects, demos, and challenges — and get focused, time-boxed feedback from the community.
              </p>

              <div className="flex gap-4 justify-center lg:justify-start mb-12">
                <Button 
                  size="lg" 
                  className="shadow-lg"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Join Now
                </Button>
                <Button variant="outline" size="lg">
                  <Users className="mr-2 h-5 w-5" />
                  Explore Projects
                </Button>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="flex-1 w-full max-w-lg">
              <div className="relative">
                <div className="bg-card/60 backdrop-blur-sm rounded-2xl border shadow-xl p-8">
                  <div className="space-y-6">
                    {/* Mock project cards */}
                    <div className="flex items-start gap-4 p-4 bg-accent/10 rounded-lg border border-accent/20">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <Code className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">IoT Weather Station</h3>
                        <p className="text-sm text-muted-foreground">Real-time data visualization</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">Arduino</Badge>
                          <Badge variant="secondary" className="text-xs">React</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-secondary/20 rounded-lg border border-secondary/30">
                      <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                        <Zap className="h-6 w-6 text-accent-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">Smart Home Hub</h3>
                        <p className="text-sm text-muted-foreground">Voice-controlled automation</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">Python</Badge>
                          <Badge variant="secondary" className="text-xs">AI</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-muted/40 rounded-lg border border-muted">
                      <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                        <PlayCircle className="h-6 w-6 text-secondary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">3D Print Monitor</h3>
                        <p className="text-sm text-muted-foreground">Live progress tracking</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">3D Print</Badge>
                          <Badge variant="secondary" className="text-xs">Node.js</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-accent rounded-full animate-pulse delay-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Features */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">Built for Real Makers</h2>
            <p className="text-xl text-muted-foreground">
              Share projects, get feedback, connect with makers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <PlayCircle className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">Share Demos</CardTitle>
                <CardDescription className="text-base">
                  Upload screencasts and GIFs to show your projects in action
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <MessageSquare className="h-8 w-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-xl">Get Feedback</CardTitle>
                <CardDescription className="text-base">
                  Focused discussions with time-boxed replies that stay productive
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Calendar className="h-8 w-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-xl">Join Events</CardTitle>
                <CardDescription className="text-base">
                  Participate in maker meetups, workshops, and community gatherings
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">Featured Projects</h2>
            <p className="text-xl text-muted-foreground">
              Check out what the community is building
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project Card 1 */}
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
              <CardHeader className="p-0">
                <img src="https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1964&auto=format&fit=crop" alt="Project Image" className="w-full h-48 object-cover"/>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2">AI-Powered Code Reviewer</CardTitle>
                <CardDescription className="mb-4">An intelligent assistant that reviews your code for style, errors, and best practices.</CardDescription>
                <div className="flex gap-2 mb-4">
                  <Badge variant="secondary">Python</Badge>
                  <Badge variant="secondary">Machine Learning</Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  <span>by @code_master</span>
                </div>
              </CardContent>
            </Card>

            {/* Project Card 2 */}
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
              <CardHeader className="p-0">
                <img src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop" alt="Project Image" className="w-full h-48 object-cover"/>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2">Home Automation Dashboard</CardTitle>
                <CardDescription className="mb-4">A sleek and intuitive dashboard to control all your smart home devices.</CardDescription>
                <div className="flex gap-2 mb-4">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">Node.js</Badge>
                  <Badge variant="secondary">IoT</Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  <span>by @tinker_belle</span>
                </div>
              </CardContent>
            </Card>

            {/* Project Card 3 */}
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
              <CardHeader className="p-0">
                <img src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2070&auto=format&fit=crop" alt="Project Image" className="w-full h-48 object-cover"/>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2">3D Printed Robotics Arm</CardTitle>
                <CardDescription className="mb-4">A fully functional robotics arm made with 3D printed parts and open-source hardware.</CardDescription>
                <div className="flex gap-2 mb-4">
                  <Badge variant="secondary">3D Printing</Badge>
                  <Badge variant="secondary">Arduino</Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  <span>by @maker_pro</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-12 text-foreground">Join Our Growing Community</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group">
              <div className="text-4xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                2.5k+
              </div>
              <div className="text-muted-foreground mt-2">Projects Shared</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-accent group-hover:scale-110 transition-transform duration-300">
                15k+
              </div>
              <div className="text-muted-foreground mt-2">Feedback Given</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-secondary-foreground group-hover:scale-110 transition-transform duration-300">
                850+
              </div>
              <div className="text-muted-foreground mt-2">Active Makers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-primary relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary-foreground/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary-foreground/10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Share Your Next Project?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-12 max-w-2xl mx-auto">
            Join makers who are building, sharing, and growing together in our focused collaborative space.
          </p>
          
          <div className="flex gap-6 justify-center flex-col sm:flex-row">
            <Button 
              size="lg" 
              variant="secondary"
              className="shadow-xl text-lg px-8 py-4 h-auto font-semibold"
            >
              <PlayCircle className="mr-2 h-6 w-6" />
              Join Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-4 h-auto font-semibold"
            >
              <Users className="mr-2 h-6 w-6" />
              Explore Projects
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-card border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="font-bold text-xl text-primary mb-4">
                Collab Space
              </div>
              <p className="text-muted-foreground text-sm">
                Where tinkerers share projects, demos, and challenges — and get focused feedback from the community.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Platform</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="hover:text-foreground cursor-pointer transition-colors">Share Projects</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Get Feedback</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Join Discussions</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Find Events</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Community</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="hover:text-foreground cursor-pointer transition-colors">Guidelines</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Support</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Discord</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Newsletter</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="hover:text-foreground cursor-pointer transition-colors">Documentation</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">API</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Blog</div>
                <div className="hover:text-foreground cursor-pointer transition-colors">Privacy</div>
              </div>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            © 2024 Collab Space. A collaborative platform for makers and tinkerers.
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default CollabSpace;
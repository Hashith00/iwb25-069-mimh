import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Zap,
  Shield,
  BarChart3,
  Leaf,
  ArrowRight,
  MapPin,
  Activity,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import heroNetworkImage from "@/assets/hero-network.jpg";
import HeaderComponent from "@/components/HeaderComponent";

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <HeaderComponent />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroNetworkImage}
            alt="Global network visualization"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/60" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              <Leaf className="h-4 w-4 mr-2" />
              Carbon-Aware Cloud Routing
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Route Smarter, <span className="hero-text">Planet Greener</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Intelligent cloud routing that automatically directs traffic to
              regions with the lowest carbon intensity, reducing your
              infrastructure's environmental impact without sacrificing
              performance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-8">
                  View Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/regions">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Explore Regions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="dashboard-card text-center">
              <div className="text-3xl font-bold text-success mb-2">47%</div>
              <div className="metric-label">Average Carbon Reduction</div>
            </Card>
            <Card className="dashboard-card text-center">
              <div className="text-3xl font-bold text-primary mb-2">12</div>
              <div className="metric-label">Active Regions</div>
            </Card>
            <Card className="dashboard-card text-center">
              <div className="text-3xl font-bold text-accent mb-2">99.9%</div>
              <div className="metric-label">Uptime Guarantee</div>
            </Card>
            <Card className="dashboard-card text-center">
              <div className="text-3xl font-bold text-foreground mb-2">
                &lt;50ms
              </div>
              <div className="metric-label">Average Latency</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Smart Routing Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced algorithms that balance performance, cost, and
              environmental impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="dashboard-card">
              <Globe className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                Real-Time Carbon Monitoring
              </h3>
              <p className="text-muted-foreground">
                Live carbon intensity data from electricity grids worldwide,
                updated every 5 minutes
              </p>
            </Card>

            <Card className="dashboard-card">
              <Zap className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                Intelligent Load Balancing
              </h3>
              <p className="text-muted-foreground">
                Automatically routes requests to the cleanest available regions
                while maintaining performance
              </p>
            </Card>

            <Card className="dashboard-card">
              <BarChart3 className="h-12 w-12 text-warning mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                Comprehensive Analytics
              </h3>
              <p className="text-muted-foreground">
                Detailed insights into carbon savings, performance metrics, and
                regional comparisons
              </p>
            </Card>

            <Card className="dashboard-card">
              <Shield className="h-12 w-12 text-success mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                Fallback Protection
              </h3>
              <p className="text-muted-foreground">
                Automatic failover to backup regions ensures 99.9% uptime even
                during outages
              </p>
            </Card>

            <Card className="dashboard-card">
              <MapPin className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">Global Coverage</h3>
              <p className="text-muted-foreground">
                12 regions across 6 continents provide worldwide coverage with
                optimal routing
              </p>
            </Card>

            <Card className="dashboard-card">
              <Activity className="h-12 w-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-3">Health Monitoring</h3>
              <p className="text-muted-foreground">
                Continuous health checks and performance monitoring for all
                regional endpoints
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                Why Choose GreenProxy?
              </h2>
              <p className="text-xl text-muted-foreground">
                The perfect balance of sustainability, performance, and
                reliability
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">
                      Reduce Environmental Impact
                    </h3>
                    <p className="text-muted-foreground">
                      Cut your cloud infrastructure's carbon footprint by up to
                      47% without any code changes
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Maintain Performance</h3>
                    <p className="text-muted-foreground">
                      Smart algorithms ensure optimal performance while
                      prioritizing clean energy regions
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Easy Integration</h3>
                    <p className="text-muted-foreground">
                      Simple API integration that works with your existing
                      infrastructure and tools
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Real-Time Insights</h3>
                    <p className="text-muted-foreground">
                      Comprehensive dashboard with live metrics, analytics, and
                      environmental impact tracking
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Cost Optimization</h3>
                    <p className="text-muted-foreground">
                      Intelligent routing often reduces costs by utilizing less
                      expensive clean energy regions
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Enterprise Ready</h3>
                    <p className="text-muted-foreground">
                      Built for scale with enterprise-grade security,
                      monitoring, and support
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Go Green?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start reducing your cloud infrastructure's carbon footprint today
              with intelligent routing
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-8">
                  Launch Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/regions">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Explore Regions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">GreenProxy</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 GreenProxy. Building a sustainable cloud infrastructure.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

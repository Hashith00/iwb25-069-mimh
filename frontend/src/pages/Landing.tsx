import { Button } from "@/components/ui/button";
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
  Route,
  Lock,
  Play,
} from "lucide-react";
import { Link } from "react-router-dom";
import HeaderComponent from "@/components/HeaderComponent";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/LoginModal";

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section with Background */}
      <header className="relative min-h-screen">
        <div className="absolute inset-0">
          <img
            src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/7aa3f483-3978-4416-8322-fa9964864dcb_3840w.jpg"
            alt="Network infrastructure background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 via-gray-900/40 to-gray-900/70"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 via-transparent to-gray-900/30"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 pt-4">
          <HeaderComponent />
        </nav>

        {/* Hero Content */}
        <section className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/20 backdrop-blur mb-4 sm:mb-6">
              <Route className="h-3 w-3 sm:h-4 sm:w-4 text-white/80" />
              <span className="text-xs sm:text-sm font-medium text-white/80 font-geist">
                Carbon-aware routing
              </span>
            </div>

            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tighter leading-[1.1] sm:leading-tight mb-4 sm:mb-6 font-geist text-white px-2">
              Route smarter, <br className="hidden xs:block" />
              <span className="block xs:inline bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent">
                planet greener.
              </span>
            </h1>

            <p className="mx-auto max-w-3xl text-sm sm:text-base lg:text-lg text-white/80 mb-6 sm:mb-8 leading-relaxed font-geist px-2 sm:px-4 lg:px-0">
              GreenProxy learns your infrastructure patterns—load, regions,
              carbon intensity—to craft routes that feel natural. Every request
              is intelligent, efficient, and unmistakably green.
            </p>

            <div className="flex flex-col xs:flex-row gap-3 items-center justify-center mb-6 sm:mb-8 px-2 sm:px-4 lg:px-0">
              {isAuthenticated ? (
                <Link to="/dashboard" className="w-full xs:w-auto">
                  <Button
                    size="lg"
                    className="w-full xs:w-auto bg-white text-gray-900 hover:bg-white/90 px-4 xs:px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold rounded-full font-geist min-w-[140px]"
                  >
                    View Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
              ) : (
                <LoginModal>
                  <Button
                    size="lg"
                    className="w-full xs:w-auto bg-white text-gray-900 hover:bg-white/90 px-4 xs:px-6 sm:px-8 py-3 text-sm sm:text-base font-semibold rounded-full font-geist min-w-[140px]"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </LoginModal>
              )}
              <Link to="/regionsPage" className="w-full xs:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full xs:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur px-4 xs:px-6 sm:px-8 py-3 text-sm sm:text-base font-medium rounded-full font-geist min-w-[140px]"
                >
                  Explore Regions
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </header>

      {/* Key Metrics Section */}
      <section className="relative z-10 -mt-8 sm:-mt-12 pb-12 sm:pb-16 lg:pb-24">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
            <div className="rounded-lg sm:rounded-xl lg:rounded-2xl bg-white/80 ring-1 ring-gray-200 p-3 sm:p-4 lg:p-6 backdrop-blur shadow-sm">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full bg-green-100 ring-1 ring-green-200 flex items-center justify-center mb-2 sm:mb-3">
                  <Leaf className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
                </div>
                <div className="w-full">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 font-geist">
                    47%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-geist leading-tight">
                    Carbon Reduction
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg sm:rounded-xl lg:rounded-2xl bg-white/80 ring-1 ring-gray-200 p-3 sm:p-4 lg:p-6 backdrop-blur shadow-sm">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full bg-blue-100 ring-1 ring-blue-200 flex items-center justify-center mb-2 sm:mb-3">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
                </div>
                <div className="w-full">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 font-geist">
                    12
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-geist leading-tight">
                    Active Regions
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg sm:rounded-xl lg:rounded-2xl bg-white/80 ring-1 ring-gray-200 p-3 sm:p-4 lg:p-6 backdrop-blur shadow-sm">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full bg-emerald-100 ring-1 ring-emerald-200 flex items-center justify-center mb-2 sm:mb-3">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-emerald-600" />
                </div>
                <div className="w-full">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 font-geist">
                    99.9%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-geist leading-tight">
                    Uptime
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg sm:rounded-xl lg:rounded-2xl bg-white/80 ring-1 ring-gray-200 p-3 sm:p-4 lg:p-6 backdrop-blur shadow-sm">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full bg-purple-100 ring-1 ring-purple-200 flex items-center justify-center mb-2 sm:mb-3">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600" />
                </div>
                <div className="w-full">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 font-geist">
                    &lt;50ms
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-geist leading-tight">
                    Latency
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="mx-3 sm:mx-4 lg:mx-8 mb-12 sm:mb-16 lg:mb-24 bg-white/80 ring-1 ring-gray-200 backdrop-blur rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-2">
          <Route className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="font-normal font-geist">
            Your Infrastructure Journey
          </span>
        </div>
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl leading-[0.9] font-medium text-gray-900 tracking-tighter mb-1 font-geist">
            The path unfolds.
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 font-normal font-geist">
            Every green deployment begins with intelligent routing
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Discovery phase */}
          <article className="flex flex-col min-h-[280px] sm:min-h-[320px] lg:min-h-[420px] bg-gray-50 ring-1 ring-gray-200 backdrop-blur rounded-xl sm:rounded-2xl p-4 sm:p-5 justify-between">
            <div className="space-y-3 sm:space-y-4 lg:space-y-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full bg-gray-100 ring-1 ring-gray-200 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base font-geist">
                    Analyze
                  </h3>
                  <p className="text-xs text-gray-600 font-geist">
                    Carbon monitoring
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 font-geist leading-relaxed">
                Monitor real-time carbon intensity across global regions. Our AI
                understands your infrastructure patterns and environmental
                impact.
              </p>
              <div className="flex items-center gap-2 text-gray-600">
                <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs font-geist">Global coverage</span>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-400 rounded-full transition-all duration-1000"
                style={{ width: "25%" }}
              ></div>
            </div>
          </article>

          {/* Planning phase */}
          <article className="flex flex-col min-h-[280px] sm:min-h-[320px] lg:min-h-[420px] bg-gray-50 ring-1 ring-gray-200 backdrop-blur rounded-xl sm:rounded-2xl p-4 sm:p-5 justify-between">
            <div className="space-y-3 sm:space-y-4 lg:space-y-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full bg-gray-100 ring-1 ring-gray-200 flex items-center justify-center">
                  <Route className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base font-geist">
                    Route
                  </h3>
                  <p className="text-xs text-gray-600 font-geist">
                    Smart optimization
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 font-geist leading-relaxed">
                Watch as optimal routes take shape. Our algorithms weave
                together performance, cost, and carbon efficiency in perfect
                harmony.
              </p>
              <div className="flex items-center gap-2 text-gray-600">
                <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs font-geist">Real-time routing</span>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-400 rounded-full transition-all duration-1000"
                style={{ width: "50%" }}
              ></div>
            </div>
          </article>

          {/* Experience phase */}
          <article className="flex flex-col min-h-[280px] sm:min-h-[320px] lg:min-h-[420px] bg-gray-50 ring-1 ring-gray-200 backdrop-blur rounded-xl sm:rounded-2xl p-4 sm:p-5 justify-between">
            <div className="space-y-3 sm:space-y-4 lg:space-y-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full bg-gray-100 ring-1 ring-gray-200 flex items-center justify-center">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base font-geist">
                    Monitor
                  </h3>
                  <p className="text-xs text-gray-600 font-geist">
                    Live performance
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 font-geist leading-relaxed">
                Your infrastructure flows naturally. Real-time adjustments keep
                you running efficiently with minimal environmental impact.
              </p>
              <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-green-100 ring-1 ring-green-200">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-700 font-geist">
                  Active monitoring
                </span>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-400 rounded-full transition-all duration-1000"
                style={{ width: "75%" }}
              ></div>
            </div>
          </article>

          {/* Optimize phase */}
          <article className="flex flex-col min-h-[280px] sm:min-h-[320px] lg:min-h-[420px] bg-gray-50 ring-1 ring-gray-200 backdrop-blur rounded-xl sm:rounded-2xl p-4 sm:p-5 justify-between">
            <div className="space-y-3 sm:space-y-4 lg:space-y-5">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full bg-gray-100 ring-1 ring-gray-200 flex items-center justify-center">
                  <Leaf className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-gray-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base font-geist">
                    Optimize
                  </h3>
                  <p className="text-xs text-gray-600 font-geist">
                    Continuous improvement
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 font-geist leading-relaxed">
                Capture insights and improvements. Your usage patterns help
                GreenProxy learn and make every future route even more
                efficient.
              </p>
              <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gray-100 ring-1 ring-gray-200">
                <Shield className="h-3 w-3 text-gray-600" />
                <span className="text-xs text-gray-600 font-geist">
                  Secure & private
                </span>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-400 rounded-full transition-all duration-1000"
                style={{ width: "100%" }}
              ></div>
            </div>
          </article>
        </div>

        <div className="text-center">
          <Link to="/dashboard">
            <Button className="bg-gray-900 text-white hover:bg-gray-800 px-4 sm:px-6 py-3 text-sm font-semibold rounded-full font-geist">
              <Play className="h-4 w-4 mr-2" />
              Start your journey
            </Button>
          </Link>
          <p className="mt-2 text-xs text-gray-600 font-geist">
            Deploy in under 60 seconds
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 mb-16 sm:mb-20">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl ring-1 ring-gray-200 bg-white/80 backdrop-blur shadow-sm">
          <div className="relative p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Intro */}
              <div className="lg:col-span-5">
                <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none font-semibold text-gray-900 tracking-tighter mb-3 font-geist">
                  Features.
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-5 font-geist leading-relaxed">
                  Advanced algorithms that balance performance, cost, and
                  environmental impact with enterprise-grade reliability.
                </p>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium tracking-tight text-gray-700 bg-gray-100 hover:bg-gray-200 ring-1 ring-gray-200 backdrop-blur font-geist transition-colors"
                >
                  <ArrowRight className="h-3 w-3" />
                  Explore dashboard
                </Link>
              </div>

              {/* Features Grid */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-gray-50 ring-1 ring-gray-200 backdrop-blur rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 font-geist">
                      Real-Time Carbon Monitoring
                    </h3>
                    <p className="text-sm text-gray-600 font-geist leading-relaxed">
                      Live carbon intensity data from electricity grids
                      worldwide, updated every 5 minutes
                    </p>
                  </div>

                  <div className="bg-gray-50 ring-1 ring-gray-200 backdrop-blur rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 font-geist">
                      Intelligent Load Balancing
                    </h3>
                    <p className="text-sm text-gray-600 font-geist leading-relaxed">
                      Automatically routes requests to the cleanest available
                      regions while maintaining performance
                    </p>
                  </div>

                  <div className="bg-gray-50 ring-1 ring-gray-200 backdrop-blur rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 font-geist">
                      Comprehensive Analytics
                    </h3>
                    <p className="text-sm text-gray-600 font-geist leading-relaxed">
                      Detailed insights into carbon savings, performance
                      metrics, and regional comparisons
                    </p>
                  </div>

                  <div className="bg-gray-50 ring-1 ring-gray-200 backdrop-blur rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 font-geist">
                      Fallback Protection
                    </h3>
                    <p className="text-sm text-gray-600 font-geist leading-relaxed">
                      Automatic failover to backup regions ensures 99.9% uptime
                      even during outages
                    </p>
                  </div>

                  <div className="bg-gray-50 ring-1 ring-gray-200 backdrop-blur rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 font-geist">
                      Global Coverage
                    </h3>
                    <p className="text-sm text-gray-600 font-geist leading-relaxed">
                      12 regions across 6 continents provide worldwide coverage
                      with optimal routing
                    </p>
                  </div>

                  <div className="bg-gray-50 ring-1 ring-gray-200 backdrop-blur rounded-xl sm:rounded-2xl p-4 sm:p-6">
                    <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 font-geist">
                      Health Monitoring
                    </h3>
                    <p className="text-sm text-gray-600 font-geist leading-relaxed">
                      Continuous health checks and performance monitoring for
                      all regional endpoints
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full mb-6 sm:mb-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden ring-1 ring-gray-200 bg-white/80 rounded-2xl sm:rounded-3xl backdrop-blur shadow-sm">
            <div className="relative z-10 p-6 sm:p-8 md:p-12 lg:p-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* CTA Content */}
                <div className="lg:col-span-7">
                  <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tighter text-gray-900 mb-4 sm:mb-6 leading-tight font-geist">
                    Ready to go{" "}
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      green
                    </span>
                    ?
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed font-geist">
                    Start reducing your cloud infrastructure's carbon footprint
                    today with intelligent, adaptive routing that learns and
                    optimizes continuously.
                  </p>

                  <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
                    {isAuthenticated ? (
                      <Link to="/dashboard" className="w-full xs:w-auto">
                        <Button
                          size="lg"
                          className="w-full xs:w-auto bg-gray-900 text-white hover:bg-gray-800 px-6 sm:px-8 py-3 text-base font-semibold rounded-full font-geist"
                        >
                          Launch Dashboard
                          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      </Link>
                    ) : (
                      <LoginModal>
                        <Button
                          size="lg"
                          className="w-full xs:w-auto bg-gray-900 text-white hover:bg-gray-800 px-6 sm:px-8 py-3 text-base font-semibold rounded-full font-geist"
                        >
                          Get Started
                          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      </LoginModal>
                    )}
                    <Link to="/regionspage" className="w-full xs:w-auto">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full xs:w-auto bg-gray-100 text-gray-900 border-gray-200 hover:bg-gray-200 backdrop-blur px-6 sm:px-8 py-3 text-base font-medium rounded-full font-geist"
                      >
                        Explore Regions
                      </Button>
                    </Link>
                  </div>

                  <div className="flex flex-wrap gap-4 sm:gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="font-geist">Deploy in 60 seconds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="font-geist">
                        No code changes required
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="font-geist">
                        Enterprise-grade security
                      </span>
                    </div>
                  </div>
                </div>

                {/* Benefits List */}
                <div className="lg:col-span-5">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-50 ring-1 ring-gray-200 backdrop-blur">
                      <div className="h-8 w-8 rounded-full bg-green-100 ring-1 ring-green-200 flex items-center justify-center flex-shrink-0">
                        <Leaf className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 font-geist">
                          47% Carbon Reduction
                        </h3>
                        <p className="text-xs text-gray-600 font-geist leading-relaxed">
                          Cut your infrastructure's environmental impact
                          significantly
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-50 ring-1 ring-gray-200 backdrop-blur">
                      <div className="h-8 w-8 rounded-full bg-blue-100 ring-1 ring-blue-200 flex items-center justify-center flex-shrink-0">
                        <Zap className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 font-geist">
                          Smart Performance
                        </h3>
                        <p className="text-xs text-gray-600 font-geist leading-relaxed">
                          Maintain optimal performance while prioritizing clean
                          energy
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-50 ring-1 ring-gray-200 backdrop-blur">
                      <div className="h-8 w-8 rounded-full bg-purple-100 ring-1 ring-purple-200 flex items-center justify-center flex-shrink-0">
                        <BarChart3 className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 font-geist">
                          Real-time Insights
                        </h3>
                        <p className="text-xs text-gray-600 font-geist leading-relaxed">
                          Comprehensive analytics and environmental impact
                          tracking
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-3 sm:px-6 pb-8 sm:pb-12">
        <div className="p-6 sm:p-8 lg:p-12 xl:p-16 border border-gray-200 rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-2xl shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12 sm:mb-16">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-4 sm:mb-6">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 ring-1 ring-gray-200 backdrop-blur">
                  <Leaf className="h-4 w-4 text-green-600" />
                </span>
                <span className="ml-2 uppercase text-lg font-semibold tracking-tighter text-gray-900 font-geist">
                  GreenProxy
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6 sm:mb-8 font-geist">
                Intelligent cloud routing that learns your infrastructure
                patterns to balance performance, cost, and environmental impact
                seamlessly.
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <a
                  href="#"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:bg-gray-50 bg-gray-50"
                  aria-label="Twitter"
                >
                  <Globe className="h-4 w-4 text-gray-600" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:bg-gray-50 bg-gray-50"
                  aria-label="LinkedIn"
                >
                  <Shield className="h-4 w-4 text-gray-600" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:bg-gray-50 bg-gray-50"
                  aria-label="GitHub"
                >
                  <Activity className="h-4 w-4 text-gray-600" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4 sm:mb-6 uppercase tracking-wide font-geist">
                Platform
              </h4>
              <ul className="space-y-3 sm:space-y-4">
                <li>
                  <Link
                    to="/dashboard"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-geist"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/regions"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-geist"
                  >
                    Regions
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-geist"
                  >
                    Analytics
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-geist"
                  >
                    Monitoring
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4 sm:mb-6 uppercase tracking-wide font-geist">
                Solutions
              </h4>
              <ul className="space-y-3 sm:space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-geist"
                  >
                    Carbon Routing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-geist"
                  >
                    Load Balancing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-geist"
                  >
                    Global CDN
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-geist"
                  >
                    API Gateway
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4 sm:mb-6 uppercase tracking-wide font-geist">
                Resources
              </h4>
              <ul className="space-y-3 sm:space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-geist"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-geist"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-geist"
                  >
                    Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-geist"
                  >
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 sm:pt-12 mb-8 sm:mb-12">
            <div className="max-w-2xl mx-auto text-center">
              <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4 font-geist">
                Stay in the flow
              </h4>
              <p className="text-sm text-gray-600 mb-4 sm:mb-6 font-geist">
                Get carbon insights, new features, and optimization tips
                delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 max-w-md px-4 py-3 rounded-lg sm:rounded-xl text-sm text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-green-500 focus:outline-none transition-all duration-300 bg-white font-geist"
                />
                <button className="px-6 sm:px-8 py-3 rounded-lg sm:rounded-xl text-sm font-medium text-white border border-green-600 hover:border-green-700 transition-all duration-300 bg-green-600 hover:bg-green-700 font-geist">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-gray-500 text-center sm:text-left">
            <span className="font-geist">
              © 2024 GreenProxy. All rights reserved.
            </span>
            <a
              href="#"
              className="hover:text-gray-700 transition-colors duration-300 font-geist"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-gray-700 transition-colors duration-300 font-geist"
            >
              Terms of Service
            </a>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-2 font-geist">
              <CheckCircle className="h-3 w-3 text-green-600" />
              Carbon optimized
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

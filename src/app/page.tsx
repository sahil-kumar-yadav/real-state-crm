import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verifyToken } from "@/lib/auth";

export default async function Home() {
  // Check if user is logged in by verifying JWT token
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  
  // Redirect logged-in users
  if (token) {
    const payload = await verifyToken(token);
    if (payload) {
      redirect("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ================= Navigation ================= */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="container-max flex-between py-4">
          <div className="flex items-center gap-2">
            <div className="flex-center h-10 w-10 rounded-lg bg-blue-600">
              <span className="text-lg font-bold text-white">RE</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">
              Real Estate CRM
            </h1>
          </div>
          <div className="flex gap-4">
            <Link
              href="/auth/login"
              className="btn-secondary px-6 py-2 text-sm font-medium"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="btn-primary px-6 py-2 text-sm font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= Hero Section ================= */}
      <section className="container-max py-32">
        <div className="text-center">
          <h2 className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl">
            Professional Property Management Made Simple
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            Complete CRM solution for real estate agencies to manage properties,
            leads, agents, and track commissions with ease.
          </p>
          <div className="flex-center gap-4">
            <Link href="/auth/register" className="btn-primary px-8 py-3">
              Start Free Trial
            </Link>
            <Link href="#features" className="btn-secondary px-8 py-3">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ================= Features Section ================= */}
      <section id="features" className="bg-white py-20">
        <div className="container-max">
          <h3 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Powerful Features
          </h3>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Property Management",
                desc: "Manage unlimited properties with complete details, images, and agent assignments",
              },
              {
                title: "Lead Tracking",
                desc: "Capture and track buyer/seller inquiries with activity timeline and follow-ups",
              },
              {
                title: "Visit Scheduling",
                desc: "Schedule property visits with reminders and completion tracking",
              },
              {
                title: "Commission Tracking",
                desc: "Automatic commission calculation and payment status tracking",
              },
              {
                title: "Agent Performance",
                desc: "Real-time dashboard showing agent KPIs and performance metrics",
              },
              {
                title: "AI Follow-ups",
                desc: "AI-powered follow-up suggestions for better lead conversion",
              },
            ].map((feature, idx) => (
              <div key={idx} className="card-hover rounded-lg border border-gray-200 p-6 shadow-sm transition hover:shadow-md">
                <h4 className="mb-2 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h4>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA Section ================= */}
      <section className="bg-blue-600 py-16">
        <div className="container-max text-center">
          <h3 className="mb-4 text-3xl font-bold text-white">
            Ready to transform your real estate business?
          </h3>
          <p className="mb-8 text-lg text-blue-100">
            Join hundreds of successful real estate agencies using our CRM
          </p>
          <Link
            href="/auth/register"
            className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 shadow hover:bg-gray-100"
          >
            Start Your Free Trial Today
          </Link>
        </div>
      </section>

      {/* ================= Footer ================= */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="container-max text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Real Estate CRM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

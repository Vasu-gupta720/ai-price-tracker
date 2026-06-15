import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Rabbit, Shield, Bell } from "lucide-react";
import AddProductForm from "@/components/ui/AddProductForm";

export default function Home() {

  const user = null;

  const products = [];
  
  const FEATURES = [
    {
      icon: Rabbit,
      title: "Lightning Fast",
      description:
        "Deal Drop extracts prices in seconds, handling JavaScript and dynamic content",
    },
    {
      icon: Shield,
      title: "Always Reliable",
      description:
        "Works across all major e-commerce sites with built-in anti-bot protection",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get notified instantly when prices drop below your target",
    },
  ];
  return (
    <main className="min-h-screen bg-linear-to-br from-orange-100 via-white to-orange-100  "> 
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Image 
              src="/deal-drop-logo.png" 
              alt="Deal Drop Logo"
              width={600} 
              height={400} 
              className="h-10 w-auto"
            />
          </div>

          {/* {auth button} */}
          <Button variant="default" size="default">
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
        </div>
      </header>

      <section className="px-4 py-20"> 
        <div className="max-w-7xl mx-auto text-center"> 
           <h2 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Never Miss a Price Drop
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Track prices from any e-commerce site. Get instant alerts when
            prices drop. Save money effortlessly.
          </p>

          {/* {add product button} */}
          <AddProductForm  user = {user} />

        {/* Features Grid */}
        {products.length === 0 && (
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-white p-6 rounded-xl border border-gray-200"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

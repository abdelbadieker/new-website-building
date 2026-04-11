export default function SiteRoot() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-400"></div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-500">
              EcoMate
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="font-medium text-slate-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" className="font-medium text-slate-600 hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#testimonials" className="font-medium text-slate-600 hover:text-blue-600 transition-colors">Success Stories</a>
          </nav>
          <div className="flex items-center space-x-4">
            <a href="/login" className="font-medium text-slate-600 hover:text-blue-600 transition-colors">Log In</a>
            <a href="/register" className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-500/20 transition-all">Start Free Trial</a>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              The Complete E-commerce OS for <span className="text-blue-600">Algeria</span>
            </h1>
            <p className="mt-6 text-xl text-slate-600">
              Everything you need to build, manage, and scale your online store. Tailored for local merchants, built for scale.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
               <a href="/register" className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-1">
                 Get Started for Free
               </a>
               <a href="#demo" className="px-8 py-4 rounded-full bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 font-semibold text-lg transition-all">
                 Book a Demo
               </a>
            </div>
          </div>
          
          <div className="mt-20 rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
             <div className="bg-slate-100 flex items-center px-4 py-3 border-b border-slate-200">
               <div className="flex space-x-2">
                 <div className="w-3 h-3 rounded-full bg-red-400"></div>
                 <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                 <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
               </div>
             </div>
             <div className="aspect-video bg-slate-50 flex items-center justify-center">
               <p className="text-slate-400 font-medium">Dashboard Preview Placeholder</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

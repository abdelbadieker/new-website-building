import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Bot, Package, ShoppingBag, Users, BarChart3, Truck, Star } from 'lucide-react';
import { PartnershipsMarquee } from '@/components/PartnershipsMarquee';

export default function LandingPage() {
  return (
    <>
      {/* NAV */}
      <nav id="nav">
        <div className="logo cursor-pointer">Eco<span>Mate</span></div>
        <ul className="nl">
          <li><a href="#features">Features</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#how">How It Works</a></li>
        </ul>
        <div className="nr">
          <ThemeToggle />
          <Link href="/login" className="bgh">Sign In</Link>
          <Link href="/register" className="bpc">Try It Now →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hg1"></div><div className="hg2"></div>
        <div className="hi-wrap">
          <div className="hbadge"><span className="hbdot"></span>All-in-One SaaS Platform for Algerian Business</div>
          <h1 className="hhline">
            <span className="hh1">Build your</span>
            <span className="hh2" style={{ paddingRight: '0.1em' }}>Business</span>
            <span className="hh3">without the <span className="hh3c">complexity.</span></span>
          </h1>
          <p className="hsub">EcoMate centralizes every tool Algerian SMEs need into one platform — AI chatbot automation, order management, CRM. No technical knowledge required.</p>
          <div className="hact">
            <Link href="/register" className="bh1">
              Start Now
              <svg className="arri" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <a href="#features" className="bh2-live">
              <span className="live-dot"></span>Discover Features
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
          <div className="hstats">
            <div className="hs"><span className="hsn"><span className="hsg">6</span></span><span className="hsl">Tools in one platform</span></div>
            <div className="hs"><span className="hsn">98<span className="hsg">%</span></span><span className="hsl">AI response rate</span></div>
            <div className="hs"><span className="hsn">24<span className="hsg">/7</span></span><span className="hsl">Always-on automation</span></div>
            <div className="hs"><span className="hsn"><span className="hsg">0</span></span><span className="hsl">Missed orders</span></div>
          </div>
        </div>

        {/* Floating cards */}
        <div className="fc fc1">
          <div className="fct">Revenue Today</div>
          <div className="fcrow"><span style={{fontSize:'22px'}}>💰</span><span className="fcm fcg">127,400 DA</span></div>
          <div className="fctag">↑ +23.4% vs yesterday</div>
          <div className="fcspark">
            <div className="fsb" style={{height:'40%'}}></div><div className="fsb" style={{height:'55%'}}></div>
            <div className="fsb a" style={{height:'70%'}}></div><div className="fsb a" style={{height:'60%'}}></div>
            <div className="fsb p" style={{height:'90%'}}></div><div className="fsb a" style={{height:'80%'}}></div>
            <div className="fsb p" style={{height:'100%'}}></div>
          </div>
        </div>
        <div className="fc fc2">
          <div className="fct">New Order ✅</div>
          <div className="fcrow"><span style={{fontSize:'20px'}}>📦</span>
            <div style={{marginLeft:'8px'}}>
              <div style={{fontFamily:'var(--font-poppins)', fontSize:'14px', fontWeight:'700'}}>Order #2847</div>
              <div style={{fontSize:'11px', color:'rgba(255,255,255,.35)', marginTop:'2px'}}>Confirmed by AI · 2 min ago</div>
            </div>
          </div>
        </div>
        <div className="fc fc3">
          <div className="fct">AI Response Rate</div>
          <div className="fcm" style={{fontSize:'26px'}}>98.7<span style={{fontSize:'15px', color:'rgba(255,255,255,.35)'}}>%</span></div>
          <div className="fctag" style={{marginTop:'6px'}}>← 3.4k messages handled</div>
        </div>
      </section>

      <PartnershipsMarquee />

      {/* INTEGRATIONS */}
      <div className="integ-section">
        <div className="integ-inner">
          <span className="integ-label">Connects seamlessly with the platforms your customers already use</span>
          <div className="integ-grid">
            <div className="integ-col">
              <div className="integ-badge">All Social Platforms</div>
              <div className="integ-col-title">Where your customers message you</div>
              <div className="integ-logos">
                <span className="integ-pill"><span className="ip-dot blue"></span>Facebook</span>
                <span className="integ-pill"><span className="ip-dot pink"></span>Instagram</span>
                <span className="integ-pill"><span className="ip-dot green"></span>WhatsApp</span>
                <span className="integ-pill" style={{color:'rgba(255,255,255,.25)', borderStyle:'dashed'}}>+ More</span>
              </div>
            </div>
            <div className="integ-divider"></div>
            <div className="integ-col">
              <div className="integ-badge">Algerian Delivery Network</div>
              <div className="integ-col-title">Shipping partners across all wilayas</div>
              <div className="integ-logos">
                <span className="integ-pill"><span className="ip-dot dz"></span>Home Delivery</span>
                <span className="integ-pill"><span className="ip-dot dz"></span>Office Pickup</span>
                <span className="integ-pill"><span className="ip-dot dz"></span>Express Delivery</span>
                <span className="integ-pill" style={{color:'rgba(255,255,255,.25)', borderStyle:'dashed'}}>All 58 Wilayas</span>
              </div>
            </div>
            <div className="integ-divider"></div>
            <div className="integ-col">
              <div className="integ-badge">Business Tools</div>
              <div className="integ-col-title">Keep using the tools you love</div>
              <div className="integ-logos">
                <span className="integ-pill"><span className="ip-dot sheets"></span>Google Sheets</span>
                <span className="integ-pill"><span className="ip-dot gray"></span>Excel Export</span>
                <span className="integ-pill"><span className="ip-dot gray"></span>PDF Reports</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="powered-section">
        <div className="cap-header">
          <span className="cap-dot"></span>
          <span className="cap-label">What EcoMate delivers for your business — every single day</span>
          <span className="cap-dot"></span>
        </div>
        <div className="powered-track">
          <div className="pw-item"><span className="pw-chip">⚡&nbsp;<span className="pw-chip-val g">&#60; 2s</span>&nbsp;reply speed</span></div><div className="pw-sep"></div>
          <div className="pw-item"><span className="pw-chip">💬&nbsp;<span className="pw-chip-val w">3</span>&nbsp;languages supported</span></div><div className="pw-sep"></div>
          <div className="pw-item"><span className="pw-chip">🤖&nbsp;<span className="pw-chip-val g">98.7%</span>&nbsp;AI response rate</span></div><div className="pw-sep"></div>
          <div className="pw-item"><span className="pw-chip">📦&nbsp;<span className="pw-chip-val g">24/7</span>&nbsp;orders automated</span></div><div className="pw-sep"></div>
          <div className="pw-item"><span className="pw-chip">🌍&nbsp;<span className="pw-chip-val w">58</span>&nbsp;wilayas covered</span></div><div className="pw-sep"></div>
          <div className="pw-item"><span className="pw-chip">🔄&nbsp;<span className="pw-chip-val g">0</span>&nbsp;missed messages</span></div><div className="pw-sep"></div>
          <div className="pw-item"><span className="pw-chip">📊&nbsp;<span className="pw-chip-val g">Real-time</span>&nbsp;dashboard data</span></div><div className="pw-sep"></div>
          <div className="pw-item"><span className="pw-chip">🔒&nbsp;<span className="pw-chip-val w">End-to-end</span>&nbsp;data security</span></div><div className="pw-sep"></div>
        </div>
      </div>

      {/* FEATURES BENTO (REVAMPED) */}
      <section id="features" className="py-32 px-5 relative bg-[#0a1628] rounded-b-[40px]">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <p className="text-[#2563EB] font-bold tracking-widest uppercase text-xs mb-4 flex items-center justify-center gap-2">
            <span className="w-4 h-[2px] bg-[#2563EB]"></span>
            Everything You Need
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight font-poppins">
            All tools. <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-200">One platform.</span><br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-emerald-300">Zero fragmentation.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Stop juggling a dozen different tools. EcoMate brings every capability your Algerian business needs into one seamless, affordable system.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="md:col-span-2 relative group bg-[#0f1c33] border border-slate-800 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-300 overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
              <Bot className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 font-poppins">AI Sales Chatbot</h3>
            <p className="text-slate-400 leading-relaxed max-w-md">Deployed across all your social platforms. Responds 24/7 in Arabic, French and English — handles product questions, takes orders, and confirms deliveries fully automatically.</p>
            <div className="mt-8 flex gap-3 flex-wrap relative z-10">
              <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">✓ Natural Language</span>
              <span className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-full">✓ Multi-Language</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative group bg-[#0f1c33] border border-slate-800 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-300 overflow-hidden shadow-xl">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
              <BarChart3 className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 font-poppins">Real-time Analytics</h3>
            <p className="text-slate-400 leading-relaxed">Revenue, top products, order volume, and conversion rates — visualized clearly.</p>
          </div>

          {/* Card 3 */}
          <div className="relative group bg-[#0f1c33] border border-slate-800 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-300 overflow-hidden shadow-xl">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
              <Package className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 font-poppins">Order Management</h3>
            <p className="text-slate-400 leading-relaxed">Cash-on-delivery tracking, payment status, and delivery sync all in one panel.</p>
          </div>

          {/* Card 4 */}
          <div className="relative group bg-[#0f1c33] border border-slate-800 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-300 overflow-hidden shadow-xl">
            <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
              <ShoppingBag className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 font-poppins">Product Catalog</h3>
            <p className="text-slate-400 leading-relaxed">Add products once—they sync automatically across chatbot and dashboard.</p>
          </div>

          {/* Card 5 */}
          <div className="relative group bg-[#0f1c33] border border-slate-800 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-300 overflow-hidden shadow-xl">
             <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 font-poppins">Customer CRM</h3>
            <p className="text-slate-400 leading-relaxed">Every customer interaction and purchase history tracked automatically.</p>
          </div>

          {/* Card 6 */}
          <div className="md:col-span-3 relative group bg-[#0f1c33] border border-slate-800 rounded-3xl p-8 hover:border-blue-500/30 transition-all duration-300 overflow-hidden shadow-xl flex flex-col md:flex-row items-center gap-8">
             <div className="w-16 h-16 shrink-0 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center">
              <Truck className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3 font-poppins">Delivery Partner Integration</h3>
              <p className="text-slate-400 leading-relaxed max-w-3xl">Integrated with all major Algerian delivery companies. Tracking codes sync automatically, customers get live status updates via AI — zero manual work required across all 58 wilayas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" className="py-32 px-5 relative bg-[#07101f] overflow-hidden">
        <div className="ctag2"></div>
        <div className="max-w-7xl mx-auto text-center mb-16 relative z-10">
          <p className="text-[#10B981] font-bold tracking-widest uppercase text-xs mb-4 flex items-center justify-center gap-2">
            <span className="w-4 h-[2px] bg-[#10B981]"></span>
            Trusted by Merchants
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 font-poppins">
            Hear from our <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-emerald-300">Community.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
            Hundreds of Algerian businesses are saving time and scaling their revenue using EcoMate.
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all shadow-xl">
            <Star className="w-4 h-4 text-emerald-400" fill="currentColor" />
            Submit a Review from Dashboard
          </Link>
        </div>

        {/* Marquee effect */}
        <div className="relative w-full overflow-hidden py-10">
           <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#07101f] to-transparent z-10 pointer-events-none"></div>
           <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#07101f] to-transparent z-10 pointer-events-none"></div>
           
           <div className="flex animate-mqani gap-6 w-max hover:[animation-play-state:paused]">
             {[
               { name: "Ahmed B.", biz: "AlgeriaTech Store", copy: "Since integrating EcoMate, my page's response time went to 0. The bot is extremely smart and my sales have doubled simply because clients get answers instantly." },
               { name: "Sarah M.", biz: "Boutique Dz", copy: "Order tracking with COD used to be a nightmare. EcoMate handles the delivery confirmations and tracks Yalidine perfectly. Highly recommended!" },
               { name: "Yacine Kh", biz: "Cosmetics Algiers", copy: "Best investment for our business this year. We fired 2 customer service agents because the AI handles 95% of incoming messages seamlessly." },
               { name: "Ahmed B.", biz: "AlgeriaTech Store", copy: "Since integrating EcoMate, my page's response time went to 0. The bot is extremely smart and my sales have doubled simply because clients get answers instantly." },
               { name: "Sarah M.", biz: "Boutique Dz", copy: "Order tracking with COD used to be a nightmare. EcoMate handles the delivery confirmations and tracks Yalidine perfectly. Highly recommended!" },
               { name: "Yacine Kh", biz: "Cosmetics Algiers", copy: "Best investment for our business this year. We fired 2 customer service agents because the AI handles 95% of incoming messages seamlessly." }
             ].map((r, i) => (
                <div key={i} className="w-[350px] md:w-[420px] p-8 rounded-3xl bg-[#0a1628] border border-slate-800 shrink-0 shadow-lg cursor-default hover:border-emerald-500/30 transition-colors">
                  <div className="flex gap-1 mb-5">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-amber-400" fill="currentColor" />)}
                  </div>
                  <p className="text-slate-300 leading-relaxed mb-8 italic">&quot;{r.copy}&quot;</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center font-bold text-white text-lg shadow-inner">{r.name[0]}</div>
                    <div>
                      <div className="text-white font-bold">{r.name}</div>
                      <div className="text-slate-500 text-sm">{r.biz}</div>
                    </div>
                  </div>
                </div>
             ))}
           </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how">
        <div className="ctr">
          <p className="stag">Simple Process</p>
          <h2 className="st">From zero to selling <span>in 4 steps.</span></h2>
          <p className="sd">We handle the complexity so you can focus on what matters — growing your business.</p>
        </div>
        <div className="hwg">
          <div className="hwcon"></div>
          <div className="hws">
            <div className="hwb"><div className="hwbn">1</div>📋</div>
            <h3 className="hwt">Tell Us Your Business</h3>
            <p className="hwd">Sign up and describe your activity, products, and goals.</p>
          </div>
          <div className="hws">
            <div className="hwb"><div className="hwbn">2</div>⚙️</div>
            <h3 className="hwt">We Set Everything Up</h3>
            <p className="hwd">Our team configures your AI chatbot, product catalog, and dashboard.</p>
          </div>
          <div className="hws">
            <div className="hwb"><div className="hwbn">3</div>🔗</div>
            <h3 className="hwt">Connect Your Channels</h3>
            <p className="hwd">Link your social pages and your delivery partner effortlessly.</p>
          </div>
          <div className="hws">
            <div className="hwb"><div className="hwbn">4</div>🚀</div>
            <h3 className="hwt">Start Scaling</h3>
            <p className="hwd">Watch as AI answers questions and closes sales 24/7.</p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing">
        <div className="ctr">
          <p className="stag">Clear Pricing</p>
          <h2 className="st">Simple, transparent pricing.</h2>
          <p className="sd">Join EcoMate today. Upgrade when you are ready to scale.</p>
        </div>
        <div className="pgrid">
          <div className="pc">
            <div className="pn">Starter</div>
            <div className="pp">2,500<sup>DA</sup></div>
            <span className="ppr">/month</span>
            <ul className="pfl">
              <li>1 Store</li>
              <li>Basic AI Chatbot</li>
              <li>Order Management</li>
              <li>Email Support</li>
            </ul>
            <Link href="/register"><button className="pb">Get Started</button></Link>
          </div>
          <div className="pc pop">
            <div className="pbdg">Most Popular</div>
            <div className="pn">Growth</div>
            <div className="pp">5,900<sup>DA</sup></div>
            <span className="ppr">/month</span>
            <ul className="pfl">
              <li>Up to 3 Stores</li>
              <li>Advanced AI Chatbot (Multi-language)</li>
              <li>CRM & Analytics</li>
              <li>Delivery Integration</li>
              <li>Priority Support</li>
            </ul>
            <Link href="/register"><button className="pb">Get Started</button></Link>
          </div>
          <div className="pc">
            <div className="pn">Enterprise</div>
            <div className="pp">14,900<sup>DA</sup></div>
            <span className="ppr">/month</span>
            <ul className="pfl">
              <li>Unlimited Stores</li>
              <li>Custom AI Training</li>
              <li>Dedicated Account Manager</li>
              <li>API Access</li>
            </ul>
            <Link href="/register"><button className="pb">Contact Sales</button></Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta">
        <div className="ctag2"></div>
        <h2 className="ct">Ready to automate your <span className="hi">Sales?</span></h2>
        <p className="csub">Join hundreds of merchants in Algeria who have centralized their operations and skyrocketed their revenue with EcoMate.</p>
        <div className="cacts">
          <Link href="/register" className="bcta">Get Started Now</Link>
          <Link href="/login" className="bctag">Sign In to Dashboard</Link>
        </div>
        <p className="cnote">Cancel anytime.</p>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="fg">
          <div className="fb">
            <span className="logo">Eco<span style={{background: 'linear-gradient(135deg,var(--s),var(--g))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Mate</span></span>
            <p>Empowering Algerian businesses with professional e-commerce automation tailored for the local market.</p>
          </div>
          <div className="fb">
            <h4 className="fc2h">Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#">Guides</a></li>
            </ul>
          </div>
          <div className="fb">
            <h4 className="fc2h">Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="fb">
            <h4 className="fc2h">Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="fbot">
          <p className="fcp">© 2026 EcoMate. Built for scale in <span>Algeria</span>.</p>
          <div className="fbdgs">
            <span className="fbdg">Secure</span>
            <span className="fbdg">Lightning Fast</span>
          </div>
        </div>
      </footer>
    </>
  );
}

import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LandingPage() {
  return (
    <>
      {/* NOISE & EFFECTS */}
      <div className="noise"></div>

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
            <span className="hh2">Business</span>
            <span className="hh3">without the <span className="hh3c">complexity.</span></span>
          </h1>
          <p className="hsub">EcoMate centralizes every tool Algerian SMEs need into one platform — AI chatbot automation, order management, CRM. No technical knowledge required.</p>
          <div className="hact">
            <Link href="/register" className="bh1">
              Start Free Trial
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

      {/* FEATURES BENTO */}
      <section id="features">
        <p className="stag">Everything You Need</p>
        <h2 className="st">Six tools. <span>One platform.</span><br/><span className="grn">Zero fragmentation.</span></h2>
        <p className="sd">Stop juggling a dozen different tools. EcoMate brings every capability your Algerian business needs into one seamless, affordable system — powered by real AI, built for real results.</p>
        <div className="bento">

          {/* B1: AI Chatbot */}
          <div className="bc b1">
            <div className="bci">🤖</div>
            <h3>AI Sales Chatbot</h3>
            <p>Deployed across all your social platforms. Responds 24/7 in Arabic, French and English — handles product questions, takes orders, and confirms deliveries fully automatically.</p>
            <span className="btag">✓ Arabic · French · English</span>
            <div className="mcht">
              <div className="mm u">أبغي Black Hoodie، مقاس L</div>
              <div className="mm b">
                Added to cart! Confirm your address to complete the order 📦
                <div className="caction-row" style={{marginTop:'7px'}}>
                  <button className="cact-btn primary">✅ Confirm Order</button>
                  <button className="cact-btn secondary">🛍️ Continue Shopping</button>
                </div>
              </div>
              <div className="mconf">✅ Order #3821 confirmed automatically</div>
            </div>
          </div>

          {/* B2: Order Mgmt */}
          <div className="bc b2">
            <div className="bci g">📦</div>
            <h3>Order & COD Management</h3>
            <p>All orders in one dashboard. Cash-on-delivery tracking, payment status, and delivery sync — all automatic. Know the status of every order in real time.</p>
            <div className="trkl">
              <div className="tri"><div className="trd dn"></div><span className="trt dn">Order placed</span></div>
              <div className="tri"><div className="trd dn"></div><span className="trt dn">Confirmed by AI</span></div>
              <div className="tri"><div className="trd ac"></div><span className="trt">In delivery</span></div>
              <div className="tri"><div className="trd pd"></div><span className="trt">Delivered</span></div>
            </div>
          </div>

          {/* B3: Product Catalog */}
          <div className="bc b3">
            <div className="bci b2c">🛍️</div>
            <h3>Product Catalog</h3>
            <p>Add products once — they sync automatically across your chatbot, your website, and your dashboard. Always in sync, always up to date.</p>
            <div className="mch">
              <div className="mb" style={{flex:1, height:'40%'}}></div><div className="mb" style={{flex:1, height:'65%'}}></div>
              <div className="mb p" style={{flex:1, height:'100%'}}></div><div className="mb" style={{flex:1, height:'80%'}}></div>
              <div className="mb gp" style={{flex:1, height:'90%'}}></div>
            </div>
          </div>

          {/* B5: CRM */}
          <div className="bc b5">
            <div className="bci g">👥</div>
            <h3>CRM — Customer Relations</h3>
            <p>Every customer interaction, purchase history, and preference tracked automatically. Build loyalty and repeat business without any extra effort on your side.</p>
            <div className="mch">
              <div className="mb" style={{flex:1, height:'30%'}}></div><div className="mb" style={{flex:1, height:'55%'}}></div>
              <div className="mb" style={{flex:1, height:'70%'}}></div><div className="mb p" style={{flex:1, height:'85%'}}></div>
              <div className="mb gp" style={{flex:1, height:'100%'}}></div>
            </div>
          </div>

          {/* B7: Analytics */}
          <div className="bc b7">
            <div className="bci g">📊</div>
            <h3>Analytics & Sales Dashboard</h3>
            <p>Real-time revenue, top products, order volume, and conversion rates — visualized clearly for better business decisions every day.</p>
            <div className="mch" style={{height:'46px', gap:'5px'}}>
              <div className="mb" style={{flex:1, height:'45%'}}></div><div className="mb" style={{flex:1, height:'60%'}}></div>
              <div className="mb p" style={{flex:1, height:'80%'}}></div><div className="mb" style={{flex:1, height:'65%'}}></div>
              <div className="mb gp" style={{flex:1, height:'100%'}}></div><div className="mb" style={{flex:1, height:'75%'}}></div>
              <div className="mb p" style={{flex:1, height:'90%'}}></div><div className="mb gp" style={{flex:1, height:'100%'}}></div>
            </div>
          </div>

          {/* B8: Delivery */}
          <div className="bc b8">
            <div className="bci b2c">🚚</div>
            <h3>Delivery Partner Integration</h3>
            <p>Integrated with all major Algerian delivery companies. Tracking codes sync automatically, customers get live status updates via AI — zero manual work required across all 58 wilayas.</p>
            <div className="trkl" style={{marginTop:'14px'}}>
              <div className="tri"><div className="trd dn"></div><span className="trt dn">Shipping partner ↔ Auto-sync</span></div>
              <div className="tri"><div className="trd dn"></div><span className="trt dn">Tracking code ↔ Imported</span></div>
              <div className="tri"><div className="trd ac"></div><span className="trt">Customer notified via AI</span></div>
            </div>
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
          <p className="sd">Try EcoMate free for 14 days. No credit card required. Upgrade when you are ready to scale.</p>
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
            <Link href="/register"><button className="pb">Start Free Trial</button></Link>
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
            <Link href="/register"><button className="pb">Start Free Trial</button></Link>
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
          <Link href="/register" className="bcta">Start 14-Day Free Trial</Link>
          <Link href="/login" className="bctag">Sign In to Dashboard</Link>
        </div>
        <p className="cnote">No credit card required. Cancel anytime.</p>
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

export default function Page() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: 40 }}>
      <div style={{ width: 80, height: 80, borderRadius: 20, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, fontSize: 36 }}>??</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', marginBottom: 10 }}>Chatbot Control</h1>
      <p style={{ fontSize: 15, color: '#64748b', maxWidth: 420, lineHeight: 1.6, marginBottom: 28 }}>Configure and manage the AI chatbot. Set up automated responses, conversation flows, and training data.</p>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 999, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', fontSize: 13, fontWeight: 600, color: '#3b82f6' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
        Coming Soon
      </div>
    </div>
  );
}

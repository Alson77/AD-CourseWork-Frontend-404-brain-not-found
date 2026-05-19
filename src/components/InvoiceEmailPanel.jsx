import { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import api from '../utils/api';

export default function InvoiceEmailPanel({ invoiceId, defaultEmail = '' }) {
  const [email, setEmail] = useState(defaultEmail);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [smtpReady, setSmtpReady] = useState(null);

  useEffect(() => {
    setEmail(defaultEmail);
  }, [defaultEmail, invoiceId]);

  useEffect(() => {
    api.get('/api/invoices/email-configured')
      .then((res) => setSmtpReady(res.data?.configured === true))
      .catch(() => setSmtpReady(false));
  }, []);

  const handleSend = async () => {
    if (!email.trim()) {
      setErr('Enter customer email address.');
      return;
    }
    try {
      setSending(true);
      setErr('');
      setMsg('');
      const { data } = await api.post(`/api/invoices/${invoiceId}/send-email`, { email: email.trim() });
      setMsg(data.message || 'Invoice sent.');
    } catch (e) {
      const status = e.response?.status;
      const serverMsg = e.response?.data?.message;
      if (status === 503) {
        setErr(serverMsg || 'Email is not configured on the server. Add SMTP settings in appsettings.json and restart the backend.');
      } else {
        setErr(serverMsg || 'Failed to send email. Check SMTP settings and the recipient address.');
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="no-print" style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px' }}>
      <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Send invoice by email</p>
      {smtpReady === false && (
        <p style={{ fontSize: '0.8rem', color: '#b45309', marginBottom: '0.5rem' }}>
          SMTP is not configured. Set <code>Smtp:FromEmail</code>, <code>Username</code>, and <code>Password</code> in{' '}
          <code>vehicle-parts-backend/appsettings.json</code>, then restart <code>dotnet run</code>.
        </p>
      )}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="customer@email.com"
          style={{ flex: 1, minWidth: '200px' }}
        />
        <button type="button" className="btn-primary" onClick={handleSend} disabled={sending || smtpReady === false}>
          <Mail size={15} /> {sending ? 'Sending…' : 'Send Email'}
        </button>
      </div>
      {err && <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '0.5rem' }}>{err}</p>}
      {msg && <p style={{ color: '#16a34a', fontSize: '0.8rem', marginTop: '0.5rem' }}>{msg}</p>}
    </div>
  );
}

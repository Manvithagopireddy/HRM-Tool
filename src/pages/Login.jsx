import React, { useState } from 'react';
import { Users, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, error, setError } = useAuth();
  const [email, setEmail]       = useState('admin@peoplecore.com');
  const [password, setPassword] = useState('admin123');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    login(email, password);
    setLoading(false);
  };

  const demoUsers = [
    { label: 'Admin',    email: 'admin@peoplecore.com', pw: 'admin123' },
    { label: 'HR Staff', email: 'hr@peoplecore.com',    pw: 'hr12345'  },
  ];

  return (
    <div className="login-page">
      {/* Animated background orbs */}
      <div style={{
        position: 'absolute', top: '-15%', right: '-8%',
        width: '640px', height: '640px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 65%)',
        pointerEvents: 'none', animation: 'float 8s ease-in-out infinite',
      }}/>
      <div style={{
        position: 'absolute', bottom: '-20%', left: '-10%',
        width: '520px', height: '520px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.11) 0%, transparent 65%)',
        pointerEvents: 'none', animation: 'float 10s ease-in-out infinite reverse',
      }}/>

      <div style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 1 }}>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '62px', height: '62px', borderRadius: '18px',
            background: '#1e1e1e',
            border: '1px solid rgba(255,255,255,0.18)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
            marginBottom: '18px',
          }}>
            <Users color="white" size={30}/>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.6px', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
            People<span style={{ color: 'var(--text-secondary)' }}>Core</span>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Sparkles size={13} style={{ color: 'var(--accent-secondary)' }}/>
            Enterprise HR Suite
          </div>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Welcome back
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Sign in to your workspace to continue
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Error Alert */}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '12px 14px', marginBottom: '20px',
                background: 'var(--danger-soft)', border: '1px solid rgba(244,63,94,0.3)',
                borderLeft: '3px solid var(--danger)',
                borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--danger)',
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }}/>
                {error}
              </div>
            )}

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{
                  position: 'absolute', left: '13px', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-muted)',
                }}/>
                <input
                  id="login-email"
                  className="form-control"
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="you@peoplecore.com"
                  style={{ paddingLeft: '40px' }}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{
                  position: 'absolute', left: '13px', top: '50%',
                  transform: 'translateY(-50%)', color: 'var(--text-muted)',
                }}/>
                <input
                  id="login-password"
                  className="form-control"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter your password"
                  style={{ paddingLeft: '40px', paddingRight: '44px' }}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  id="toggle-password"
                  onClick={() => setShowPass(p => !p)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none', border: 'none',
                    cursor: 'pointer', color: 'var(--text-muted)', display: 'flex',
                    padding: '4px', borderRadius: '6px', transition: 'var(--transition)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '0.95rem', marginTop: '6px', borderRadius: 'var(--radius-md)' }}
            >
              {loading
                ? <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.35)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}/>
                    Signing in...
                  </span>
                : <><LogIn size={16}/> Sign In</>
              }
            </button>
          </form>

          {/* Demo Credentials */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(255,255,255,0.025)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-glass)',
          }}>
            <div style={{
              fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <span style={{ flex: 1, height: '1px', background: 'var(--border)' }}/>
              Demo Credentials
              <span style={{ flex: 1, height: '1px', background: 'var(--border)' }}/>
            </div>
            {demoUsers.map(d => (
              <button
                key={d.email}
                type="button"
                onClick={() => { setEmail(d.email); setPassword(d.pw); setError(''); }}
                style={{
                  display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 10px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                  background: 'none', border: 'none', transition: 'var(--transition)',
                  marginBottom: '4px',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{d.label}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{d.email}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          © 2026 PeopleCore Enterprise Suite · All rights reserved
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Login;

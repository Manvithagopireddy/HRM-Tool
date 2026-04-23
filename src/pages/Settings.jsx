import React, { useState } from 'react';
import {
  User, Bell, Shield, Palette, Database, Globe, Save,
  Moon, Sun, Eye, EyeOff, Check, AlertCircle
} from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';


const settingsSections = ['Profile', 'Notifications', 'Security', 'Appearance', 'Company'];

const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    style={{
      width:'44px', height:'24px', borderRadius:'100px', border:'none', cursor:'pointer',
      background: value ? 'var(--accent-primary)' : 'var(--bg-hover)',
      position:'relative', transition:'background 0.2s', flexShrink:0,
    }}
  >
    <div style={{
      position:'absolute', top:'3px', left: value ? '23px' : '3px',
      width:'18px', height:'18px', borderRadius:'50%', background:'white',
      transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.3)',
    }}/>
  </button>
);

const Section = ({ title, children }) => (
  <div style={{marginBottom:'32px'}}>
    <div style={{fontWeight:700,fontSize:'0.95rem',marginBottom:'16px',color:'var(--text-primary)',paddingBottom:'10px',borderBottom:'1px solid var(--border)'}}>{title}</div>
    {children}
  </div>
);

const Row = ({ label, description, children }) => (
  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px',padding:'12px 0',borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
    <div style={{flex:1}}>
      <div style={{fontWeight:600,fontSize:'0.875rem'}}>{label}</div>
      {description && <div style={{fontSize:'0.78rem',color:'var(--text-muted)',marginTop:'2px'}}>{description}</div>}
    </div>
    <div>{children}</div>
  </div>
);

const Settings = () => {
  useDocumentTitle('Settings');
  const [activeTab, setActiveTab] = useState('Profile');
  const [saved, setSaved] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const [profile, setProfile] = useState({ name:'Admin User', email:'admin@peoplecore.com', phone:'+1 (555) 000-0000', role:'HR Manager', bio:'' });
  const [notifs, setNotifs] = useState({ email:true, browser:true, payroll:true, attendance:false, recruitment:true, weekly:true });
  const [appearance, setAppearance] = useState({ theme:'dark', density:'default', animations:true, sidebar:'expanded' });
  const [company, setCompany] = useState({ name:'PeopleCore Corp', industry:'Technology', size:'51-200', timezone:'America/New_York', currency:'USD', website:'https://peoplecore.com' });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabIcons = { Profile:<User size={16}/>, Notifications:<Bell size={16}/>, Security:<Shield size={16}/>, Appearance:<Palette size={16}/>, Company:<Globe size={16}/> };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Settings</h1>
          <div className="page-subtitle">Manage your account preferences and system configuration</div>
        </div>
        <div className="page-header-actions">
          {saved && <span className="badge badge-success" style={{padding:'8px 14px'}}><Check size={14}/> Changes saved!</span>}
          <button className="btn btn-primary" onClick={handleSave}><Save size={16}/>Save Changes</button>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'220px 1fr',gap:'24px',alignItems:'start'}}>
        {/* Settings Nav */}
        <div className="card" style={{padding:'10px',position:'sticky',top:'calc(var(--topbar-height) + 24px)'}}>
          {settingsSections.map(tab=>(
            <button key={tab} className={`nav-item ${activeTab===tab?'active':''}`} onClick={()=>setActiveTab(tab)}
              style={{width:'100%',justifyContent:'flex-start',margin:'1px 0',borderRadius:'var(--radius-sm)'}}>
              {tabIcons[tab]}<span>{tab}</span>
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="card">
          {activeTab === 'Profile' && (
            <>
              <Section title="Personal Information">
                <div style={{display:'flex',alignItems:'center',gap:'16px',marginBottom:'20px',padding:'16px',background:'var(--bg-surface)',borderRadius:'var(--radius-md)',border:'1px solid var(--border)'}}>
                  <div className="avatar avatar-xl" style={{background:'var(--grad-primary)',color:'white'}}>AD</div>
                  <div>
                    <button className="btn btn-sm btn-secondary">Change Photo</button>
                    <div style={{fontSize:'0.75rem',color:'var(--text-muted)',marginTop:'6px'}}>JPG, PNG up to 2MB</div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-control" value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-control" type="email" value={profile.email} onChange={e=>setProfile(p=>({...p,email:e.target.value}))}/>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-control" value={profile.phone} onChange={e=>setProfile(p=>({...p,phone:e.target.value}))}/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Job Title</label>
                    <input className="form-control" value={profile.role} onChange={e=>setProfile(p=>({...p,role:e.target.value}))}/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea className="form-control" value={profile.bio} onChange={e=>setProfile(p=>({...p,bio:e.target.value}))} placeholder="Tell us about yourself..."/>
                </div>
              </Section>
            </>
          )}

          {activeTab === 'Notifications' && (
            <Section title="Notification Preferences">
              {[
                { key:'email', label:'Email Notifications', desc:'Receive notifications via email' },
                { key:'browser', label:'Browser Notifications', desc:'Get real-time browser push notifications' },
                { key:'payroll', label:'Payroll Alerts', desc:'Get notified when payroll is processed' },
                { key:'attendance', label:'Attendance Alerts', desc:'Notify on employee attendance issues' },
                { key:'recruitment', label:'Recruitment Updates', desc:'Alerts for new applications and stage changes' },
                { key:'weekly', label:'Weekly Summary', desc:'Receive a weekly digest of key metrics' },
              ].map(n=>(
                <Row key={n.key} label={n.label} description={n.desc}>
                  <Toggle value={notifs[n.key]} onChange={v=>setNotifs(p=>({...p,[n.key]:v}))}/>
                </Row>
              ))}
            </Section>
          )}

          {activeTab === 'Security' && (
            <>
              <Section title="Change Password">
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <div style={{position:'relative'}}>
                    <input className="form-control" type={showPass?'text':'password'} placeholder="Enter current password" style={{paddingRight:'40px'}}/>
                    <button onClick={()=>setShowPass(p=>!p)} style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'var(--text-muted)',cursor:'pointer',display:'flex'}}>
                      {showPass?<EyeOff size={16}/>:<Eye size={16}/>}
                    </button>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input className="form-control" type="password" placeholder="Min 8 characters"/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input className="form-control" type="password" placeholder="Repeat new password"/>
                  </div>
                </div>
                <button className="btn btn-primary btn-sm"><Shield size={14}/>Update Password</button>
              </Section>
              <Section title="Two-Factor Authentication">
                <Row label="Enable 2FA" description="Add an extra layer of security to your account">
                  <Toggle value={false} onChange={()=>{}}/>
                </Row>
                <div style={{display:'flex',gap:'8px',alignItems:'center',padding:'12px',background:'var(--warning-soft)',borderRadius:'var(--radius-md)',border:'1px solid var(--warning)',marginTop:'8px'}}>
                  <AlertCircle size={16} color="var(--warning)"/>
                  <span style={{fontSize:'0.8rem',color:'var(--warning)'}}>2FA is not enabled. We strongly recommend enabling it for added security.</span>
                </div>
              </Section>
            </>
          )}

          {activeTab === 'Appearance' && (
            <Section title="Display Preferences">
              <Row label="Theme" description="Choose your preferred color scheme">
                <div style={{display:'flex',gap:'8px'}}>
                  {['dark','light'].map(t=>(
                    <button key={t} onClick={()=>setAppearance(p=>({...p,theme:t}))}
                      className={`btn btn-sm ${appearance.theme===t?'btn-primary':'btn-secondary'}`}>
                      {t==='dark'?<Moon size={14}/>:<Sun size={14}/>} {t.charAt(0).toUpperCase()+t.slice(1)}
                    </button>
                  ))}
                </div>
              </Row>
              <Row label="Animations" description="Enable or disable UI micro-animations">
                <Toggle value={appearance.animations} onChange={v=>setAppearance(p=>({...p,animations:v}))}/>
              </Row>
              <Row label="Sidebar Mode" description="Choose how the sidebar behaves">
                <select className="form-control" style={{width:'auto',padding:'5px 12px',fontSize:'0.8rem'}} value={appearance.sidebar} onChange={e=>setAppearance(p=>({...p,sidebar:e.target.value}))}>
                  <option value="expanded">Expanded</option>
                  <option value="collapsed">Collapsed</option>
                  <option value="hidden">Hidden</option>
                </select>
              </Row>
            </Section>
          )}

          {activeTab === 'Company' && (
            <Section title="Company Information">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input className="form-control" value={company.name} onChange={e=>setCompany(p=>({...p,name:e.target.value}))}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Industry</label>
                  <select className="form-control" value={company.industry} onChange={e=>setCompany(p=>({...p,industry:e.target.value}))}>
                    {['Technology','Finance','Healthcare','Retail','Education','Manufacturing'].map(i=><option key={i}>{i}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Company Size</label>
                  <select className="form-control" value={company.size} onChange={e=>setCompany(p=>({...p,size:e.target.value}))}>
                    {['1-10','11-50','51-200','201-500','500+'].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Timezone</label>
                  <select className="form-control" value={company.timezone} onChange={e=>setCompany(p=>({...p,timezone:e.target.value}))}>
                    {['America/New_York','America/Los_Angeles','Europe/London','Asia/Kolkata','Asia/Tokyo'].map(tz=><option key={tz}>{tz}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Currency</label>
                  <select className="form-control" value={company.currency} onChange={e=>setCompany(p=>({...p,currency:e.target.value}))}>
                    {['USD','EUR','GBP','INR','JPY'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Website</label>
                  <input className="form-control" type="url" value={company.website} onChange={e=>setCompany(p=>({...p,website:e.target.value}))}/>
                </div>
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

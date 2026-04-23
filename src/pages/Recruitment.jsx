import React, { useState } from 'react';
import { Plus, Briefcase, MapPin, Clock, Users, ChevronRight, X, Search } from 'lucide-react';
import { jobs } from '../data/mockData';
import { useHRM } from '../context/HRMContext';
import { useToast } from '../context/ToastContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

const KANBAN_STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];
const stageColors = { Applied:'var(--text-muted)', Screening:'var(--info)', Interview:'var(--warning)', Offer:'var(--accent-primary)', Hired:'var(--success)' };

const priorityBadge = (p) => {
  if(p==='High') return <span className="badge badge-danger">{p}</span>;
  if(p==='Medium') return <span className="badge badge-warning">{p}</span>;
  return <span className="badge badge-muted">{p}</span>;
};
const Stars = ({count}) => <div className="stars">{[1,2,3,4,5].map(i=><span key={i} className={`star ${i<=count?'':'empty'}`}>★</span>)}</div>;

const CandidateCard = ({candidate,onClick}) => (
  <div className="kanban-card" onClick={()=>onClick(candidate)}>
    <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
      <div className="avatar avatar-sm" style={{background:candidate.avatarColor,color:'white'}}>{candidate.avatar}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:700,fontSize:'0.85rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{candidate.name}</div>
        <div style={{fontSize:'0.72rem',color:'var(--text-muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{candidate.email}</div>
      </div>
    </div>
    <Stars count={candidate.rating}/>
    <div style={{fontSize:'0.72rem',color:'var(--text-muted)',marginTop:'6px'}}>Applied {candidate.appliedDate}</div>
  </div>
);

const CandidateModal = ({candidate,onClose,onMove}) => {
  const job = jobs.find(j=>j.id===candidate.jobId);
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal slide-up" style={{maxWidth:'440px'}}>
        <div className="modal-header"><span className="modal-title">Candidate Profile</span><button className="modal-close" onClick={onClose}><X size={16}/></button></div>
        <div className="modal-body">
          <div style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'20px'}}>
            <div className="avatar avatar-lg" style={{background:candidate.avatarColor,color:'white'}}>{candidate.avatar}</div>
            <div><div style={{fontWeight:800,fontSize:'1.1rem'}}>{candidate.name}</div><div style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>{candidate.email}</div><div style={{marginTop:'6px'}}><Stars count={candidate.rating}/></div></div>
          </div>
          <div style={{padding:'14px',background:'var(--bg-surface)',borderRadius:'var(--radius-md)',marginBottom:'16px'}}>
            <div style={{fontSize:'0.72rem',color:'var(--text-muted)',fontWeight:700,textTransform:'uppercase',marginBottom:'8px'}}>Applied For</div>
            <div style={{fontWeight:700}}>{job?.title}</div>
            <div style={{fontSize:'0.8rem',color:'var(--text-muted)',marginTop:'2px'}}>{job?.department} · {job?.location}</div>
          </div>
          <div style={{marginBottom:'12px'}}>
            <div style={{fontSize:'0.72rem',color:'var(--text-muted)',fontWeight:700,textTransform:'uppercase',marginBottom:'8px'}}>Move Stage</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
              {KANBAN_STAGES.map(s=><button key={s} className={`filter-chip ${candidate.stage===s?'active':''}`} onClick={()=>onMove(candidate.id,s)}>{s}</button>)}
            </div>
          </div>
          <div style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>Applied on {candidate.appliedDate}</div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <button className="btn btn-success">Send Offer</button>
        </div>
      </div>
    </div>
  );
};

const Recruitment = () => {
  useDocumentTitle('Recruitment');
  const { candidates, moveCandidate } = useHRM();
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState('all');
  const [viewCandidate, setViewCandidate] = useState(null);
  const [jobSearch, setJobSearch] = useState('');
  const [activeTab, setActiveTab] = useState('kanban');

  const filteredCandidates = candidates.filter(c=>selectedJob==='all'||c.jobId===selectedJob);
  const filteredJobs = jobs.filter(j=>!jobSearch||j.title.toLowerCase().includes(jobSearch.toLowerCase()));

  const handleMove = (id, stage) => {
    moveCandidate(id, stage);
    if(viewCandidate?.id===id) setViewCandidate(v=>({...v,stage}));
    toast(`Candidate moved to ${stage}`, 'info');
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Recruitment</h1>
          <div className="page-subtitle">Track candidates through your hiring pipeline</div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={()=>toast('Job posting feature coming soon!','info')}><Plus size={16}/>Post New Job</button>
        </div>
      </div>

      <div className="kpi-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        {[
          {label:'Open Positions',value:jobs.filter(j=>j.status==='Open').length,color:'primary'},
          {label:'Total Applicants',value:candidates.length,color:'info'},
          {label:'In Interview',value:candidates.filter(c=>c.stage==='Interview').length,color:'warning'},
          {label:'Hired',value:candidates.filter(c=>c.stage==='Hired').length,color:'success'},
        ].map(k=>(
          <div key={k.label} className={`kpi-card accent-${k.color}`}>
            <div className={`kpi-icon ${k.color}`}><Briefcase size={22}/></div>
            <div className="kpi-body"><div className="kpi-value">{k.value}</div><div className="kpi-label">{k.label}</div></div>
          </div>
        ))}
      </div>

      <div className="tabs">
        {['kanban','jobs'].map(t=><button key={t} className={`tab-btn ${activeTab===t?'active':''}`} onClick={()=>setActiveTab(t)}>{t==='kanban'?'Candidate Pipeline':'Job Listings'}</button>)}
      </div>

      {activeTab==='kanban'&&(
        <>
          <div style={{display:'flex',gap:'8px',marginBottom:'16px',flexWrap:'wrap'}}>
            <button className={`filter-chip ${selectedJob==='all'?'active':''}`} onClick={()=>setSelectedJob('all')}>All Jobs</button>
            {jobs.filter(j=>j.status==='Open').map(j=><button key={j.id} className={`filter-chip ${selectedJob===j.id?'active':''}`} onClick={()=>setSelectedJob(j.id)}>{j.title}</button>)}
          </div>
          <div className="kanban-board">
            {KANBAN_STAGES.map(stage=>{
              const stageCands=filteredCandidates.filter(c=>c.stage===stage);
              return (
                <div key={stage} className="kanban-col">
                  <div className="kanban-col-header">
                    <div style={{display:'flex',alignItems:'center',gap:'8px'}}><div style={{width:'10px',height:'10px',borderRadius:'50%',background:stageColors[stage]}}/>{stage}</div>
                    <span className="nav-badge" style={{background:'var(--bg-hover)',color:'var(--text-secondary)'}}>{stageCands.length}</span>
                  </div>
                  <div className="kanban-col-body">
                    {stageCands.length===0
                      ? <div style={{textAlign:'center',padding:'24px',color:'var(--text-muted)',fontSize:'0.8rem'}}>No candidates</div>
                      : stageCands.map(c=><CandidateCard key={c.id} candidate={c} onClick={setViewCandidate}/>)
                    }
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab==='jobs'&&(
        <>
          <div className="table-search" style={{maxWidth:'320px',marginBottom:'16px'}}>
            <Search size={16} color="var(--text-muted)"/>
            <input value={jobSearch} onChange={e=>setJobSearch(e.target.value)} placeholder="Search job titles..."/>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            {filteredJobs.map(job=>(
              <div key={job.id} className="card" style={{padding:'18px 22px',display:'flex',alignItems:'center',gap:'16px',flexWrap:'wrap'}}>
                <div style={{width:42,height:42,background:'var(--accent-primary-soft)',borderRadius:'var(--radius-md)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <Briefcase size={20} color="var(--accent-primary)"/>
                </div>
                <div style={{flex:1,minWidth:'200px'}}>
                  <div style={{fontWeight:700,fontSize:'0.95rem'}}>{job.title}</div>
                  <div style={{display:'flex',gap:'12px',marginTop:'5px',flexWrap:'wrap'}}>
                    <span style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'0.78rem',color:'var(--text-muted)'}}><MapPin size={12}/>{job.location}</span>
                    <span style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'0.78rem',color:'var(--text-muted)'}}><Clock size={12}/>{job.type}</span>
                    <span style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'0.78rem',color:'var(--text-muted)'}}><Users size={12}/>{job.applications} applicants</span>
                  </div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'10px',flexWrap:'wrap'}}>
                  <span className="badge badge-primary">{job.department}</span>
                  {priorityBadge(job.priority)}
                  <span className={`badge ${job.status==='Open'?'badge-success':'badge-muted'}`}>{job.status}</span>
                  <div style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>{job.openedDate}</div>
                  <button className="btn btn-sm btn-ghost">View <ChevronRight size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {viewCandidate&&<CandidateModal candidate={viewCandidate} onClose={()=>setViewCandidate(null)} onMove={handleMove}/>}
    </div>
  );
};

export default Recruitment;

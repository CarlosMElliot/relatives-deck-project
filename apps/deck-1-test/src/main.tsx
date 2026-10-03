import React,{useEffect,useState}from'react';
import{createRoot}from'react-dom/client';
import'./style.css';
import{questions}from'./questions';

type Ans=Record<number,string>;
const DURATION=15*60;
const startedAt={current:''};

function App(){
  const[phase,setPhase]=useState<'start'|'test'|'done'>('start');
  const[name,setName]=useState('');
  const[ans,setAns]=useState<Ans>({});
  const[left,setLeft]=useState(DURATION);
  const[section,setSection]=useState(0);
  const[showReview,setShowReview]=useState(true);
  const[reason,setReason]=useState('');

  const sections=[...new Set(questions.map(q=>q.part))];
  const currentPart=sections[section];
  const currentQuestions=questions.filter(q=>q.part===currentPart);
  const correct=questions.filter(q=>ans[q.id]===q.answer).length;
  const score=Math.round(correct/questions.length*100);
  const answered=Object.keys(ans).length;

  const logAttempt=async(finalReason:string)=>{
    try{
      await fetch('/api/log-result',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          name:name.trim(),
          score,
          correct,
          total:questions.length,
          status:finalReason,
          startedAt:startedAt.current,
          submittedAt:new Date().toISOString()
        })
      });
    }catch{}
  };

  const submit=(why='Submitted by student')=>{
    setReason(why);
    void logAttempt(why);
    setPhase('done');
    window.scrollTo({top:0,behavior:'smooth'});
  };

  useEffect(()=>{
    if(phase!=='test')return;
    const id=setInterval(()=>{
      setLeft(x=>{
        if(x<=1){
          clearInterval(id);
          setTimeout(()=>submit('Time expired'),0);
          return 0;
        }
        return x-1;
      });
    },1000);
    return()=>clearInterval(id);
  },[phase,ans]);

  const start=()=>{
    if(name.trim().split(/\s+/).length<2){
      alert('Please enter your full name.');
      return;
    }
    setAns({});
    setLeft(DURATION);
    setSection(0);
    setReason('');
    startedAt.current=new Date().toISOString();
    setPhase('test');
  };

  const go=(n:number)=>{
    setSection(n);
    window.scrollTo({top:0,behavior:'smooth'});
  };

  if(phase==='start')return <main className="start-shell">
    <section className="hero">
      <div className="brand">
        <span>ERC</span>
        <div><b>ERC Academy</b><small>English Response on Command</small></div>
      </div>
      <div className="eyebrow">DECK 1 COMPREHENSION TEST</div>
      <h1>Relative Clauses</h1>
      <p className="lead">A focused 15-minute check of the grammar taught in Deck 1: meaning, clause type, subject/object/possessive roles, omission, where/when/why, punctuation, and everyday error correction.</p>

      <div className="meta">
        <div><b>30</b><small>Questions</small></div>
        <div><b>15 min</b><small>Time limit</small></div>
        <div><b>100</b><small>Points</small></div>
      </div>

      <label className="name-field">
        <span>Student full name</span>
        <input autoFocus autoComplete="name" placeholder="e.g. Carlos Mercado" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&start()}/>
      </label>

      <div className="note">
        <b>Before you begin</b>
        <p>The timer starts as soon as you press Start. Answer every item. When you finish, you will see your score plus each correct and incorrect answer with feedback.</p>
      </div>

      <button className="primary wide" onClick={start}>Start 15-minute test →</button>
    </section>
  </main>;

  if(phase==='done')return <main className="result-shell">
    <section className="card result-head">
      <div className="eyebrow">RESULTS</div>
      <h1>{score}/100</h1>
      <p><b>{name}</b> · {correct} correct of {questions.length} · {reason}</p>
      <div className="result-actions">
        <button className="secondary" onClick={()=>setShowReview(v=>!v)}>{showReview?'Hide answer review':'Show answer review'}</button>
        <button className="primary" onClick={()=>location.reload()}>Take again</button>
      </div>
    </section>

    {showReview&&<section className="card review">
      {questions.map(q=>{
        const ok=ans[q.id]===q.answer;
        return <article key={q.id} className={ok?'ok':'bad'}>
          <div className="review-top">
            <b>{q.id}. {q.text}</b>
            <span>{ok?'✓ Correct':'✕ Incorrect'}</span>
          </div>
          <p>Your answer: <strong>{ans[q.id]||'No answer'}</strong><br/>Correct answer: <strong>{q.answer}</strong></p>
          <small>{q.feedback}</small>
        </article>;
      })}
    </section>}
  </main>;

  return <main className="test-shell">
    <header>
      <div><b>{name}</b><small>Deck 1 · Relative Clauses</small></div>
      <div className={left<=180?'timer urgent':'timer'}>
        <small>TIME LEFT</small>
        <b>{Math.floor(left/60)}:{String(left%60).padStart(2,'0')}</b>
      </div>
    </header>

    <div className="progress">
      <div><b>{currentPart}</b><span>{answered}/{questions.length} answered</span></div>
      <div className="bar"><i style={{width:(answered/questions.length*100)+'%'}}/></div>
    </div>

    <section className="card">
      <div className="section-meta"><span>Section {section+1} of {sections.length}</span><span>{currentQuestions.length} questions</span></div>
      <h2>{currentPart}</h2>
      <p className="instruction">{currentQuestions[0]?.instruction}</p>

      {currentQuestions.map(q=><article className="q" key={q.id}>
        <h3>{q.id}. {q.text}</h3>
        {q.options.map((o,j)=><label key={o}>
          <input type="radio" name={'q'+q.id} checked={ans[q.id]===o} onChange={()=>setAns({...ans,[q.id]:o})}/>
          <b>{String.fromCharCode(65+j)}.</b><span>{o}</span>
        </label>)}
      </article>)}

      <div className="nav">
        {section>0&&<button className="secondary" onClick={()=>go(section-1)}>← Previous</button>}
        {section<sections.length-1
          ?<button className="primary" onClick={()=>go(section+1)}>Next section →</button>
          :<button className="primary" onClick={()=>confirm('Submit your test now?')&&submit()}>Submit test</button>}
      </div>
    </section>
  </main>;
}

createRoot(document.getElementById('root')!).render(<App/>);

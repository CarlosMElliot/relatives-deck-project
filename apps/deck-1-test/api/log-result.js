const OWNER='CarlosMElliot';
const REPO='relatives-deck-project';
const PATH='apps/deck-1-test/logs/results.jsonl';

export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  const token=process.env.GITHUB_RESULTS_TOKEN;
  if(!token)return res.status(503).json({error:'Results logging is not configured'});

  const b=req.body||{};
  const clean=x=>String(x??'').replace(/[\r\n]/g,' ').slice(0,300);
  const entry={
    name:clean(b.name),
    score:Number(b.score)||0,
    correct:Number(b.correct)||0,
    total:Number(b.total)||30,
    status:clean(b.status),
    startedAt:clean(b.startedAt),
    submittedAt:clean(b.submittedAt),
    loggedAt:new Date().toISOString()
  };

  try{
    const h={
      Authorization:`Bearer ${token}`,
      Accept:'application/vnd.github+json',
      'X-GitHub-Api-Version':'2022-11-28',
      'User-Agent':'erc-deck1-test'
    };

    const get=async path=>{
      const url=`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
      const r=await fetch(url,{headers:h});
      if(r.status===404)return{url,sha:null,content:''};
      if(!r.ok)throw new Error('read failed');
      const j=await r.json();
      return{url,sha:j.sha,content:Buffer.from(j.content,'base64').toString('utf8')};
    };

    const put=async(path,message,content,sha)=>{
      const url=`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
      const r=await fetch(url,{
        method:'PUT',
        headers:{...h,'Content-Type':'application/json'},
        body:JSON.stringify({
          message,
          content:Buffer.from(content).toString('base64'),
          ...(sha?{sha}:{})
        })
      });
      if(!r.ok)throw new Error('write failed');
    };

    const raw=await get(PATH);
    const rows=raw.content.trim()
      ?raw.content.trim().split('\n').filter(Boolean).map(x=>{try{return JSON.parse(x)}catch{return null}}).filter(Boolean)
      :[];

    rows.push(entry);
    await put(PATH,`Log Deck 1 test result: ${entry.name||'student'} - ${entry.score}/100`,raw.content+JSON.stringify(entry)+'\n',raw.sha);

    const esc=x=>String(x??'').replace(/\|/g,'\\|');
    const head='| # | Student | Score | Correct | Status | Started (UTC) | Submitted (UTC) | Logged (UTC) |\n|---:|---|---:|---:|---|---|---|---|\n';
    const table=head+rows.map((r,i)=>`| ${i+1} | ${esc(r.name)} | ${r.score}/100 | ${r.correct}/${r.total} | ${esc(r.status)} | ${esc(r.startedAt)} | ${esc(r.submittedAt)} | ${esc(r.loggedAt)} |`).join('\n')+'\n';

    const mdPath='apps/deck-1-test/logs/RESULTS.md';
    const md=await get(mdPath);
    await put(mdPath,`Update Deck 1 results: ${entry.name||'student'}`,'# Deck 1 Student Test Results\n\n'+table,md.sha);

    return res.status(200).json({ok:true});
  }catch{
    return res.status(500).json({error:'Could not log result'});
  }
}

import { useState, useEffect, useRef, useCallback } from "react";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#f5f8fa;--surface:#fff;--card:#fff;--border:#dde3ea;--border2:#c5cdd6;
  --accent:#ff5c35;--accent-h:#e04a25;--green:#00a870;--red:#e5374a;--yellow:#d4840a;--blue:#0091ae;
  --text:#1a2738;--text2:#516f90;--text3:#99acc2;--active-bg:#fff8f6;
  --font:'Lexend',sans-serif;
}
html,body{height:100%;background:var(--bg);color:var(--text);font-family:var(--font);font-size:14px;}
.shell{display:grid;grid-template-columns:260px 1fr;grid-template-rows:56px 1fr;height:100vh;overflow:hidden;}
.topbar{grid-column:1/-1;display:flex;align-items:center;background:var(--surface);border-bottom:2px solid var(--border);box-shadow:0 1px 4px rgba(0,0,0,.06);}
.sidebar{background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden;}
.main{display:flex;flex-direction:column;overflow:hidden;background:var(--bg);}
.tb-brand{display:flex;align-items:center;gap:10px;padding:0 20px;border-right:1px solid var(--border);height:100%;min-width:260px;}
.tb-logo{width:30px;height:30px;background:var(--accent);border-radius:7px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:14px;}
.tb-name{font-size:16px;font-weight:700;color:var(--text);}
.tb-progress{flex:1;padding:0 24px;display:flex;align-items:center;gap:12px;}
.tb-bar{flex:1;height:5px;background:var(--border);border-radius:5px;overflow:hidden;}
.tb-fill{height:100%;background:var(--accent);border-radius:5px;transition:width .4s ease;}
.tb-pct{font-size:12px;color:var(--text2);min-width:52px;font-weight:600;}
.tb-stats{display:flex;height:100%;}
.tb-stat{padding:0 16px;display:flex;flex-direction:column;justify-content:center;border-left:1px solid var(--border);min-width:72px;}
.tb-val{font-size:20px;font-weight:700;line-height:1;}
.tb-val.g{color:var(--green);}.tb-val.r{color:var(--red);}.tb-val.y{color:var(--yellow);}.tb-val.b{color:var(--blue);}
.tb-lbl{font-size:10px;color:var(--text3);margin-top:2px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;}
.tb-status{padding:0 20px;border-left:1px solid var(--border);height:100%;display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text2);font-weight:600;white-space:nowrap;}
.sdot{width:9px;height:9px;border-radius:50%;background:var(--text3);flex-shrink:0;}
.sdot.live{background:var(--green);box-shadow:0 0 0 3px rgba(0,168,112,.15);animation:sp 1.5s infinite;}
.sdot.paused{background:var(--yellow);}
.sdot.calling{background:var(--accent);animation:sp 1s infinite;}
@keyframes sp{0%,100%{opacity:1;}50%{opacity:.3;}}
.sb-head{padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
.sb-title{font-size:11px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.07em;}
.sb-count{background:var(--accent);color:#fff;font-size:11px;font-weight:700;border-radius:12px;padding:2px 9px;}
.sb-search{padding:8px 12px;border-bottom:1px solid var(--border);}
.sb-search input{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:7px;color:var(--text);font-family:var(--font);font-size:13px;padding:7px 11px;outline:none;transition:border-color .15s;font-weight:500;}
.sb-search input:focus{border-color:var(--accent);}
.sb-search input::placeholder{color:var(--text3);}
.queue{flex:1;overflow-y:auto;}
.queue::-webkit-scrollbar{width:4px;}
.queue::-webkit-scrollbar-thumb{background:var(--border);}
.qi{padding:10px 14px 10px 12px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .1s;position:relative;border-left:3px solid transparent;}
.qi:hover{background:var(--bg);}
.qi.active{background:var(--active-bg);border-left-color:var(--accent);}
.qi.done{opacity:.4;}
.qi-num{font-size:10px;color:var(--text3);margin-bottom:2px;font-weight:600;}
.qi-name{font-size:13px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:38px;}
.qi-co{font-size:11px;color:var(--text2);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:500;}
.qi-tag{position:absolute;right:10px;top:50%;transform:translateY(-50%);font-size:10px;padding:2px 7px;border-radius:4px;font-weight:700;}
.tag-ans{background:#e6f7f2;color:var(--green);}
.tag-na{background:#fde8ea;color:var(--red);}
.tag-book{background:#fff3e0;color:var(--yellow);}
.tag-skip{background:var(--bg);color:var(--text3);}
.contact-area{flex:1;overflow-y:auto;padding:18px;}
.contact-card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:20px;margin-bottom:14px;box-shadow:0 1px 4px rgba(0,0,0,.05);animation:fu .18s ease;}
@keyframes fu{from{opacity:0;transform:translateY(5px);}to{opacity:1;transform:none;}}
.cc-top{display:grid;grid-template-columns:54px 1fr auto;gap:14px;align-items:start;}
.avatar{width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,#ff5c35,#ff9a00);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:#fff;flex-shrink:0;}
.cc-name{font-size:19px;font-weight:700;color:var(--text);margin-bottom:3px;}
.cc-title{font-size:12px;color:var(--text2);margin-bottom:10px;font-weight:500;}
.cc-meta{display:flex;flex-wrap:wrap;gap:6px;}
.mpill{font-size:12px;color:var(--text2);background:var(--bg);border:1px solid var(--border);border-radius:20px;padding:4px 11px;display:flex;align-items:center;gap:5px;font-weight:500;}
.mpill a{color:var(--blue);text-decoration:none;}
.mpill a:hover{text-decoration:underline;}
.timer-block{text-align:right;}
.timer-val{font-size:30px;font-weight:700;color:var(--red);line-height:1;font-variant-numeric:tabular-nums;}
.timer-val.idle{color:var(--text3);}
.timer-sub{font-size:10px;color:var(--text3);margin-top:3px;font-weight:600;text-transform:uppercase;}
.hs-btn-wrap{margin-top:14px;}
.hs-open-btn{display:flex;align-items:center;gap:8px;background:#ff5c35;color:#fff;border:none;border-radius:8px;padding:11px 20px;font-family:var(--font);font-size:14px;font-weight:700;cursor:pointer;transition:background .15s;text-decoration:none;}
.hs-open-btn:hover{background:#e04a25;}
.hs-open-btn.calling{background:var(--green);}
.hs-open-btn.calling:hover{background:#009060;}
.action-bar{background:var(--surface);border-top:1px solid var(--border);padding:12px 18px;display:flex;flex-direction:column;gap:10px;box-shadow:0 -2px 6px rgba(0,0,0,.04);}
.action-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
.btn{font-family:var(--font);font-size:13px;font-weight:600;border-radius:7px;padding:8px 16px;cursor:pointer;transition:all .15s;white-space:nowrap;outline:none;border:1px solid var(--border);background:var(--surface);color:var(--text2);}
.btn:hover:not(:disabled){background:var(--bg);border-color:var(--border2);color:var(--text);}
.btn:disabled{opacity:.3;cursor:not-allowed;}
.btn.success{background:var(--green);color:#fff;border-color:var(--green);}
.btn.success:hover:not(:disabled){background:#009060;}
.btn.danger{background:var(--red);color:#fff;border-color:var(--red);}
.btn.danger:hover:not(:disabled){background:#c42d3e;}
.btn.orange{background:var(--accent);color:#fff;border-color:var(--accent);}
.btn.orange:hover:not(:disabled){background:var(--accent-h);}
.btn.pause-btn{background:#fff3cd;color:var(--yellow);border-color:#f0c040;font-weight:600;}
.demo-panel{background:#fffbf5;border:1px solid #f0c040;border-radius:10px;padding:18px;margin-bottom:14px;animation:fu .18s ease;}
.demo-title{font-size:14px;font-weight:700;color:var(--yellow);margin-bottom:14px;}
.demo-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.field{display:flex;flex-direction:column;gap:5px;}
.field.full{grid-column:1/-1;}
.field label{font-size:11px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.06em;}
.field input,.field select,.field textarea{background:#fff;border:1px solid var(--border);border-radius:7px;color:var(--text);font-family:var(--font);font-size:13px;padding:8px 11px;outline:none;transition:border-color .15s;width:100%;font-weight:500;}
.field input:focus,.field textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(255,92,53,.1);}
.field textarea{resize:none;min-height:64px;}
.log-box{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px;flex:1;min-height:0;display:flex;flex-direction:column;box-shadow:0 1px 3px rgba(0,0,0,.04);}
.log-title{font-size:11px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px;}
.log-scroll{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:5px;}
.log-scroll::-webkit-scrollbar{width:3px;}
.log-scroll::-webkit-scrollbar-thumb{background:var(--border);}
.log-row{display:flex;gap:8px;font-size:12px;line-height:1.4;}
.log-t{color:var(--text3);flex-shrink:0;font-weight:500;}
.log-msg{color:var(--text2);font-weight:500;}
.log-msg.s{color:var(--green);}.log-msg.e{color:var(--red);}.log-msg.w{color:var(--yellow);}.log-msg.b{color:var(--blue);}
.toggle-row{display:flex;align-items:center;gap:8px;cursor:pointer;user-select:none;}
.toggle{width:34px;height:19px;border-radius:10px;background:var(--border2);position:relative;transition:background .2s;flex-shrink:0;}
.toggle.on{background:var(--green);}
.toggle::after{content:'';position:absolute;top:2px;left:2px;width:15px;height:15px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.2);}
.toggle.on::after{transform:translateX(15px);}
.tlabel{font-size:13px;font-weight:600;color:var(--text2);}
.tlabel.on{color:var(--text);}
.setup{min-height:100vh;display:flex;align-items:flex-start;justify-content:center;padding:40px 40px 80px;background:var(--bg);overflow-y:auto;}
.setup-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:36px;width:100%;max-width:540px;margin:auto;box-shadow:0 2px 12px rgba(0,0,0,.07);}
.setup-logo{display:flex;align-items:center;gap:10px;margin-bottom:6px;}
.setup-icon{width:38px;height:38px;background:var(--accent);border-radius:9px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:17px;}
.setup-name{font-size:22px;font-weight:700;color:var(--text);}
.setup-sub{font-size:13px;color:var(--text2);margin-bottom:28px;line-height:1.6;font-weight:500;}
.setup-sec{font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;margin:20px 0 12px;padding-bottom:8px;border-bottom:1px solid var(--border);}
.help{font-size:11px;color:var(--text3);margin-top:5px;line-height:1.5;font-weight:500;}
.tab-row{display:flex;gap:2px;margin-bottom:14px;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:3px;}
.tab{flex:1;padding:7px;text-align:center;font-size:13px;font-weight:600;cursor:pointer;border-radius:6px;color:var(--text2);transition:all .15s;}
.tab.active{background:var(--card);color:var(--text);box-shadow:0 1px 4px rgba(0,0,0,.08);}
.sfield{display:flex;flex-direction:column;gap:5px;margin-bottom:12px;}
.sfield label{font-size:11px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.06em;}
.sfield input,.sfield textarea,.sfield select{background:#fff;border:1px solid var(--border);border-radius:7px;color:var(--text);font-family:var(--font);font-size:13px;padding:9px 11px;outline:none;transition:border-color .15s;width:100%;font-weight:500;}
.sfield input:focus,.sfield textarea:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(255,92,53,.1);}
.sfield textarea{resize:none;}
.setup-btn{width:100%;padding:13px;font-size:14px;font-family:var(--font);font-weight:700;background:var(--accent);color:#fff;border:none;border-radius:8px;cursor:pointer;margin-top:8px;transition:background .15s;}
.setup-btn:hover:not(:disabled){background:var(--accent-h);}
.setup-btn:disabled{opacity:.35;cursor:not-allowed;}
.paused-hint{background:#fff8f0;border:1px solid #f0c040;border-radius:8px;padding:10px 14px;font-size:13px;color:var(--yellow);font-weight:600;margin-bottom:14px;}
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;color:var(--text3);}
.empty-icon{font-size:42px;}.empty p{font-size:14px;font-weight:600;}
.divider{width:1px;background:var(--border);height:30px;margin:0 2px;flex-shrink:0;}
.countdown-bar{background:var(--active-bg);border:1px solid var(--accent);border-radius:8px;padding:10px 16px;margin-bottom:14px;display:flex;align-items:center;gap:12px;}
.cd-text{font-size:13px;font-weight:600;color:var(--accent);flex:1;}
.cd-num{font-size:22px;font-weight:700;color:var(--accent);min-width:28px;text-align:center;}
.cd-track{flex:2;height:4px;background:var(--border);border-radius:4px;overflow:hidden;}
.cd-fill{height:100%;background:var(--accent);border-radius:4px;transition:width 1s linear;}
.btn.cancel-cd{font-size:12px;padding:5px 12px;border-color:var(--border2);color:var(--text2);}
`;

const initials=n=>(n||"").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()||"?";
const fmtTime=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
const ts=()=>new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"});
const eom=()=>{const d=new Date();return new Date(d.getFullYear(),d.getMonth()+1,0).toISOString().split("T")[0];};
const mergeTpl=(t,c)=>t.replace(/{{first_name}}/g,c.name?.split(" ")[0]||"there").replace(/{{company}}/g,c.company||"your company");

function useHS(key){
  return useCallback(async(path,opts={})=>{
    const r=await fetch(`https://api.hubapi.com${path}`,{...opts,headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json",...(opts.headers||{})}});
    const j=await r.json();
    if(!r.ok)throw new Error(j.message||`HS ${r.status}`);
    return j;
  },[key]);
}

function parseCSV(text){
  const lines=text.trim().split("\n");
  const headers=lines[0].split(",").map(h=>h.trim().toLowerCase().replace(/[^a-z0-9_]/g,"_"));
  return lines.slice(1).map(line=>{
    const vals=line.match(/(".*?"|[^,]+|(?<=,)(?=,)|(?<=,)$|^(?=,))/g)||line.split(",");
    const obj={};
    headers.forEach((h,i)=>{obj[h]=(vals[i]||"").replace(/^"|"$/g,"").trim();});
    return{
      id:obj.id||obj.contact_id||Math.random().toString(36).slice(2),
      name:obj.name||obj.full_name||`${obj.first_name||""} ${obj.last_name||""}`.trim()||"Unknown",
      company:obj.company||obj.company_name||obj.organization||"",
      phone:obj.phone||obj.mobile_phone||obj.phone_number||obj.work_phone||"",
      email:obj.email||obj.work_email||"",
      title:obj.title||obj.job_title||"",
      linkedin:obj.linkedin_url||obj.linkedin||obj.person_linkedin_url||"",
      hs_id:obj.hs_id||obj.hubspot_id||obj.contact_id||"",
    };
  }).filter(c=>c.name&&c.name!=="Unknown"||c.company);
}

function Setup({onSubmit}){
  const [tab,setTab]=useState("csv");
  const [form,setForm]=useState({
    hsToken:"",portalId:"",listId:"",repName:"",
    autoDialDelay:"3",
    noAnswerEmail:`Hi {{first_name}},\n\nI just tried reaching you — wanted to connect about how Corgi Insurance helps startups like {{company}} get coverage sorted fast.\n\nWould love 15 minutes this week: [CALENDAR LINK]\n\nBest,\n[YOUR NAME]`,
    noAnswerSms:"Hey {{first_name}}, tried calling — [YOUR NAME] from Corgi Insurance. Mind if I send a quick overview? 📋",
  });
  const [csvData,setCsvData]=useState(null);
  const [csvName,setCsvName]=useState("");
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const handleCSV=e=>{
    const file=e.target.files[0];if(!file)return;
    const r=new FileReader();
    r.onload=ev=>{setCsvData(parseCSV(ev.target.result));setCsvName(file.name);};
    r.readAsText(file);
  };
  const canSubmit=form.hsToken&&form.portalId&&(tab==="csv"?csvData?.length>0:true);
  return(
    <div className="setup"><style>{S}</style>
    <div className="setup-card">
      <div className="setup-logo"><div className="setup-icon">C</div><div className="setup-name">Corgi Dialer</div></div>
      <div className="setup-sub">Auto-dialer with HubSpot sync and deal creation.</div>

      <div className="setup-sec">HubSpot</div>
      <div className="sfield"><label>Private App Token *</label>
        <input type="password" placeholder="pat-na-xxxxxxxx..." value={form.hsToken} onChange={e=>set("hsToken",e.target.value)}/>
        <div className="help">HubSpot → Settings → Integrations → Private Apps → Create app</div>
      </div>
      <div className="sfield"><label>Portal ID *</label>
        <input placeholder="12345678" value={form.portalId} onChange={e=>set("portalId",e.target.value)}/>
        <div className="help">Found in HubSpot URL: app.hubspot.com/contacts/<strong>XXXXXXXX</strong>/contacts</div>
      </div>

      <div className="setup-sec">Contact Queue</div>
      <div className="tab-row">
        <div className={`tab ${tab==="csv"?"active":""}`} onClick={()=>setTab("csv")}>Apollo CSV</div>
        <div className={`tab ${tab==="hubspot"?"active":""}`} onClick={()=>setTab("hubspot")}>HubSpot List</div>
      </div>
      {tab==="csv"?(
        <div className="sfield">
          <label>Apollo CSV Export</label>
          <input type="file" accept=".csv" onChange={handleCSV} style={{padding:"8px 11px"}}/>
          {csvData&&<div className="help" style={{color:"var(--green)"}}>✓ {csvData.length} contacts loaded — {csvName}</div>}
          <div className="help">Export from Apollo: Name, Company, Phone, Email, Title, LinkedIn URL</div>
        </div>
      ):(
        <div className="sfield"><label>List ID (blank = all contacts)</label>
          <input placeholder="12345" value={form.listId} onChange={e=>set("listId",e.target.value)}/>
          <div className="help">HubSpot → Contacts → Lists → open list → last number in URL</div>
        </div>
      )}

      <div className="setup-sec">Rep</div>
      <div className="sfield"><label>Your Name (BDR)</label>
        <input placeholder="David" value={form.repName} onChange={e=>set("repName",e.target.value)}/>
      </div>

      <div className="setup-sec">Auto-Dial</div>
      <div className="sfield"><label>Delay Between Calls</label>
        <select value={form.autoDialDelay} onChange={e=>set("autoDialDelay",e.target.value)}>
          <option value="0">No delay — instant</option>
          <option value="1">1 second</option>
          <option value="2">2 seconds</option>
          <option value="3">3 seconds</option>
          <option value="4">4 seconds</option>
          <option value="5">5 seconds</option>
        </select>
        <div className="help">Time before auto-opening the next contact in HubSpot</div>
      </div>

      <div className="setup-sec">No-Answer Follow-up Templates</div>
      <div className="sfield"><label>Email Template</label>
        <textarea rows={5} value={form.noAnswerEmail} onChange={e=>set("noAnswerEmail",e.target.value)}/>
      </div>
      <div className="sfield"><label>SMS Template</label>
        <textarea rows={2} value={form.noAnswerSms} onChange={e=>set("noAnswerSms",e.target.value)}/>
        <div className="help">Use &#123;&#123;first_name&#125;&#125; and &#123;&#123;company&#125;&#125;</div>
      </div>

      <button className="setup-btn" disabled={!canSubmit} onClick={()=>onSubmit({...form,csvData,sourceTab:tab})}>
        Launch Dialer →
      </button>
    </div></div>
  );
}

function Dialer({config}){
  const hs=useHS(config.hsToken);
  const [contacts,setContacts]=useState([]);
  const [idx,setIdx]=useState(0);
  const [loading,setLoading]=useState(false);
  const [callState,setCallState]=useState("idle");
  const [callSec,setCallSec]=useState(0);
  const [outcomes,setOutcomes]=useState({});
  const [stats,setStats]=useState({answered:0,noAnswer:0,booked:0,skipped:0});
  const [log,setLog]=useState([]);
  const [search,setSearch]=useState("");
  const [showDemo,setShowDemo]=useState(false);
  const [demoForm,setDemoForm]=useState({datetime:"",ae_name:"",notes:""});
  const [emailOn,setEmailOn]=useState(true);
  const [smsOn,setSmsOn]=useState(true);
  const [countdown,setCountdown]=useState(0);
  const countdownRef=useRef(null);
  const timerRef=useRef(null);
  const logRef=useRef(null);
  const hsTabRef=useRef(null);

  const addLog=useCallback((text,type="")=>{
    setLog(l=>[...l.slice(-100),{time:ts(),text,type}]);
    setTimeout(()=>logRef.current?.scrollTo({top:99999,behavior:"smooth"}),50);
  },[]);

  useEffect(()=>{
    setLoading(true);
    if(config.sourceTab==="csv"&&config.csvData){
      setContacts(config.csvData);
      addLog(`✓ Loaded ${config.csvData.length} contacts from CSV`,"s");
      setLoading(false);return;
    }
    (async()=>{
      try{
        let list=[];
        if(config.listId){
          const d=await hs(`/contacts/v1/lists/${config.listId}/contacts/all?count=100&property=firstname&property=lastname&property=company&property=phone&property=email&property=jobtitle`);
          list=(d.contacts||[]).map(c=>({id:String(c.vid),hs_id:String(c.vid),name:`${c.properties?.firstname?.value||""} ${c.properties?.lastname?.value||""}`.trim()||"Unknown",company:c.properties?.company?.value||"",phone:c.properties?.phone?.value||"",email:c.properties?.email?.value||"",title:c.properties?.jobtitle?.value||""}));
        }else{
          const d=await hs(`/crm/v3/objects/contacts?limit=100&properties=firstname,lastname,company,phone,email,jobtitle`);
          list=(d.results||[]).map(c=>({id:c.id,hs_id:c.id,name:`${c.properties?.firstname||""} ${c.properties?.lastname||""}`.trim()||"Unknown",company:c.properties?.company||"",phone:c.properties?.phone||"",email:c.properties?.email||"",title:c.properties?.jobtitle||""}));
        }
        setContacts(list);addLog(`✓ Loaded ${list.length} contacts from HubSpot`,"s");
      }catch(e){addLog(`✗ Failed: ${e.message}`,"e");}
      finally{setLoading(false);}
    })();
  },[]);

  // Pre-resolve HubSpot IDs for all CSV contacts after load
  useEffect(()=>{
    if(!contacts.length||config.sourceTab!=="csv")return;
    const resolve=async()=>{
      addLog("Resolving contacts in HubSpot...","b");
      let found=0;
      const updated=[...contacts];
      for(let i=0;i<updated.length;i++){
        const c=updated[i];
        if(c.hs_id&&!c.hs_id.match(/^[a-z0-9]{6,}$/))continue;
        const id=await lookupHSContact(c);
        if(id){updated[i]={...c,hs_id:id};found++;}
        // small delay to avoid rate limiting
        if(i%10===9)await new Promise(r=>setTimeout(r,500));
      }
      setContacts(updated);
      addLog(`✓ Resolved ${found}/${updated.length} contacts to HubSpot IDs`,"s");
    };
    resolve();
  },[contacts.length]);

  useEffect(()=>{
    if(callState==="incall"){timerRef.current=setInterval(()=>setCallSec(s=>s+1),1000);}
    else{clearInterval(timerRef.current);if(callState==="idle")setCallSec(0);}
    return()=>clearInterval(timerRef.current);
  },[callState]);
  const current=contacts[idx];
  const filtered=search?contacts.filter(c=>`${c.name} ${c.company}`.toLowerCase().includes(search.toLowerCase())):contacts;

  const getOwner=async email=>{try{const d=await hs(`/crm/v3/owners?email=${encodeURIComponent(email)}&limit=1`);return d.results?.[0]?.id||null;}catch{return null;}};

  const lookupHSContact=async contact=>{
    // If we have a HS id already use it
    if(contact.hs_id&&!contact.hs_id.startsWith("rand"))return contact.hs_id;
    // Search by email
    if(contact.email){
      try{
        const d=await hs(`/crm/v3/objects/contacts/search`,{method:"POST",body:JSON.stringify({filterGroups:[{filters:[{propertyName:"email",operator:"EQ",value:contact.email}]}],limit:1})});
        if(d.results?.[0])return d.results[0].id;
      }catch{}
    }
    // Search by phone
    if(contact.phone){
      try{
        const d=await hs(`/crm/v3/objects/contacts/search`,{method:"POST",body:JSON.stringify({filterGroups:[{filters:[{propertyName:"phone",operator:"EQ",value:contact.phone}]}],limit:1})});
        if(d.results?.[0])return d.results[0].id;
      }catch{}
    }
    return null;
  };

  const logCall=async(contact,disposition,duration)=>{
    try{
      const hsId=await lookupHSContact(contact);
      if(!hsId){addLog("! Contact not found in HubSpot — call not logged","w");return;}
      await hs("/engagements/v1/engagements",{method:"POST",body:JSON.stringify({
        engagement:{active:true,type:"CALL"},
        associations:{contactIds:[hsId]},
        metadata:{status:disposition==="answered"?"COMPLETED":"NO_ANSWER",durationMilliseconds:duration*1000,
          body:disposition==="answered"?`Call connected. Duration: ${fmtTime(duration)}. Rep: ${config.repName}`:`No answer. Rep: ${config.repName}`}
      })});
      addLog("✓ Call logged to HubSpot","s");
      return hsId;
    }catch(e){addLog(`! Call log failed: ${e.message}`,"w");return null;}
  };

  const logFollowUp=async(contact,type,hsId)=>{
    try{
      const id=hsId||await lookupHSContact(contact);
      if(!id)return;
      const isEmail=type==="email";
      const body=mergeTpl(isEmail?config.noAnswerEmail:config.noAnswerSms,contact);
      await hs("/engagements/v1/engagements",{method:"POST",body:JSON.stringify({
        engagement:{active:true,type:isEmail?"EMAIL":"NOTE"},
        associations:{contactIds:[id]},
        metadata:isEmail?{subject:`Tried to reach you, ${contact.name.split(" ")[0]}`,body,from:{email:"bdr@corgi.com"},to:[{email:contact.email}]}:{body:`[SMS] → ${contact.phone}: ${body}`}
      })});
      addLog(`✓ ${type} follow-up logged`,"s");
    }catch(e){addLog(`! ${type} failed: ${e.message}`,"w");}
  };

  const createDeal=async(contact,demo,hsId)=>{
    try{
      addLog("Creating deal in HubSpot...","b");
      const id=hsId||await lookupHSContact(contact);
      const deal=await hs("/crm/v3/objects/deals",{method:"POST",body:JSON.stringify({properties:{
        dealname:contact.company||contact.name,
        pipeline:"default",dealstage:"appointmentscheduled",
        closedate:eom(),hs_timestamp:Date.now(),
        description:`Booked by ${config.repName}. AE: ${demo.ae_name||"TBD"}. ${demo.notes||""}`,
        dealtype:"newbusiness",
      }})});
      addLog(`✓ Deal created: ${contact.company||contact.name}`,"s");
      if(id){
        await hs(`/crm/v3/associations/deals/contacts/batch/create`,{method:"POST",body:JSON.stringify({inputs:[{from:{id:deal.id},to:{id},type:"deal_to_contact"}]})});
      }
      if(demo.datetime&&id){
        await hs("/engagements/v1/engagements",{method:"POST",body:JSON.stringify({
          engagement:{active:true,type:"MEETING"},
          associations:{contactIds:[id],dealIds:[deal.id]},
          metadata:{title:"Demo — Corgi Insurance",body:demo.notes||"",startTime:new Date(demo.datetime).getTime(),endTime:new Date(demo.datetime).getTime()+30*60*1000}
        })});
        addLog("✓ Meeting logged","s");
      }
    }catch(e){addLog(`✗ Deal failed: ${e.message}`,"e");}
  };

  const openInHubSpot=async contact=>{
    let hsId=contact.hs_id&&!contact.hs_id.match(/^[a-z0-9]{6,}$/)?contact.hs_id:null;
    if(!hsId){
      addLog(`Looking up ${contact.name} in HubSpot...`,"b");
      hsId=await lookupHSContact(contact);
      if(hsId)setContacts(prev=>prev.map(c=>c.id===contact.id?{...c,hs_id:hsId}:c));
    }
    const base=`https://app-na2.hubspot.com/contacts/${config.portalId}`;
    const phone=contact.phone?contact.phone.replace(/\s/g,""):"";
    let url;
    if(hsId){
      url=`${base}/record/0-1/${hsId}${phone?`?hs_call_phone_number=${encodeURIComponent(phone)}`:""}`;
    } else if(phone){
      url=`${base}/objects/0-1/views/all/list?query=${encodeURIComponent(phone)}`;
      addLog(`! No HubSpot ID — searching by phone`,"w");
    } else {
      url=`${base}/objects/0-1/views/all/list?query=${encodeURIComponent(contact.name)}`;
      addLog(`! No HubSpot ID — searching by name`,"w");
    }
    if(hsTabRef.current&&!hsTabRef.current.closed){
      hsTabRef.current.location.href=url;
    } else {
      hsTabRef.current=window.open(url,"hubspot_dialer");
    }
    addLog(`📋 Opened ${contact.name} in HubSpot — click Call`,"b");
    return hsId;
  };

  const startCall=async()=>{
    if(!current)return;
    await openInHubSpot(current);
    setCallState("incall");
    addLog(`📞 Calling ${current.name} — ${current.phone||"no phone"}`);
  };

  const confirmDemo=async()=>{
    if(!current)return;
    const duration=callSec;
    setCallState("idle");setShowDemo(false);
    setStats(s=>({...s,booked:s.booked+1}));setOutcomes(o=>({...o,[current.id]:"book"}));
    const hsId=await logCall(current,"answered",duration);
    await createDeal(current,demoForm,hsId);
    setDemoForm({datetime:"",ae_name:"",notes:""});
    addLog(`🎯 Demo booked — ${current.company}`,"s");
    advance();
  };

  const applyOutcome=async outcome=>{
    if(!current)return;
    const duration=callSec;
    setCallState("idle");setShowDemo(false);setOutcomes(o=>({...o,[current.id]:outcome}));
    if(outcome==="answered"){
      setStats(s=>({...s,answered:s.answered+1}));
      addLog(`✓ Answered — ${current.name}`,"s");
      await logCall(current,"answered",duration);
    } else if(outcome==="no_answer"){
      setStats(s=>({...s,noAnswer:s.noAnswer+1}));
      addLog("No answer — logging follow-ups...","w");
      const hsId=await logCall(current,"no_answer",duration);
      if(emailOn&&current.email)await logFollowUp(current,"email",hsId);
      else if(!emailOn)addLog("Email skipped (off)","w");
      if(smsOn&&current.phone)await logFollowUp(current,"sms",hsId);
      else if(!smsOn)addLog("SMS skipped (off)","w");
    } else if(outcome==="skip"){
      setStats(s=>({...s,skipped:s.skipped+1}));
      addLog(`Skipped ${current.name}`);
    }
    advance();
  };

  const advance=(skipCount=0)=>{
    const nextIdx=idx+1+skipCount;
    if(nextIdx>=contacts.length){addLog("🏁 Queue complete!","s");return;}
    const next=contacts[nextIdx];
    if(!next.phone){
      setOutcomes(o=>({...o,[next.id]:"skip"}));
      setStats(s=>({...s,skipped:s.skipped+1}));
      addLog(`No phone — skipped ${next.name}`);
      setIdx(nextIdx);
      advance(skipCount+1);
      return;
    }
    setIdx(nextIdx);
    const delay=parseInt(config.autoDialDelay||"0");
    if(delay===0){
      openInHubSpot(next).then(()=>{setCallState("incall");addLog(`📞 Calling ${next.name}`);});
    } else {
      setCountdown(delay);
      clearInterval(countdownRef.current);
      countdownRef.current=setInterval(()=>{
        setCountdown(c=>{
          if(c<=1){
            clearInterval(countdownRef.current);
            setCountdown(0);
            setContacts(prev=>{
              const nc=prev[nextIdx];
              if(nc){openInHubSpot(nc).then(()=>{setCallState("incall");addLog(`📞 Calling ${nc.name}`);});}
              return prev;
            });
            return 0;
          }
          return c-1;
        });
      },1000);
    }
  };

  const cancelCountdown=()=>{
    clearInterval(countdownRef.current);
    setCountdown(0);
    addLog("Auto-dial cancelled","w");
  };

  const progress=contacts.length?(idx/contacts.length)*100:0;
  const statusLabel=callState==="incall"?`In Call ${fmtTime(callSec)}`:callState==="paused"?"Paused":loading?"Loading...":"Ready";

  return(
    <><style>{S}</style>
    <div className="shell">
      <div className="topbar">
        <div className="tb-brand"><div className="tb-logo">C</div><span className="tb-name">Corgi Dialer</span></div>
        <div className="tb-progress">
          <div className="tb-bar"><div className="tb-fill" style={{width:`${progress}%`}}/></div>
          <span className="tb-pct">{idx} / {contacts.length}</span>
        </div>
        <div className="tb-stats">
          <div className="tb-stat"><div className="tb-val g">{stats.answered}</div><div className="tb-lbl">Answered</div></div>
          <div className="tb-stat"><div className="tb-val r">{stats.noAnswer}</div><div className="tb-lbl">No Answer</div></div>
          <div className="tb-stat"><div className="tb-val y">{stats.booked}</div><div className="tb-lbl">Booked</div></div>
          <div className="tb-stat"><div className="tb-val b">{stats.skipped}</div><div className="tb-lbl">Skipped</div></div>
        </div>
        <div className="tb-status">
          <div className={`sdot ${callState==="incall"?"live":callState==="paused"?"paused":""}`}/>
          {statusLabel}
        </div>
      </div>

      <div className="sidebar">
        <div className="sb-head"><span className="sb-title">Queue</span><span className="sb-count">{contacts.length-Object.keys(outcomes).length} left</span></div>
        <div className="sb-search"><input placeholder="Search contacts..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
        <div className="queue">
          {loading&&<div style={{padding:14,fontSize:13,color:"var(--text3)",fontWeight:500}}>Loading contacts...</div>}
          {filtered.map(c=>{
            const ri=contacts.indexOf(c);
            return(
              <div key={c.id} className={`qi ${ri===idx?"active":""} ${outcomes[c.id]?"done":""}`} onClick={()=>{setCallState("idle");setIdx(ri);setShowDemo(false);}}>
                <div className="qi-num">{ri+1}</div>
                <div className="qi-name">{c.name}</div>
                <div className="qi-co">{c.company}</div>
                {outcomes[c.id]==="answered"&&<span className="qi-tag tag-ans">ANS</span>}
                {outcomes[c.id]==="no_answer"&&<span className="qi-tag tag-na">N/A</span>}
                {outcomes[c.id]==="book"&&<span className="qi-tag tag-book">📅</span>}
                {outcomes[c.id]==="skip"&&<span className="qi-tag tag-skip">SKP</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="main">
        <div className="contact-area">
          {!current&&!loading&&<div className="empty"><div className="empty-icon">✅</div><p>Queue complete!</p></div>}
          {current&&(
            <div className="contact-card">
              <div className="cc-top">
                <div className="avatar">{initials(current.name)}</div>
                <div>
                  <div className="cc-name">{current.name}</div>
                  <div className="cc-title">{current.title}{current.title&&current.company?" · ":""}{current.company}</div>
                  <div className="cc-meta">
                    {current.phone&&<div className="mpill">📞 {current.phone}</div>}
                    {current.email&&<div className="mpill">✉ {current.email}</div>}
                    {current.linkedin&&<div className="mpill">🔗 <a href={current.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></div>}
                    <div className="mpill">{idx+1} of {contacts.length}</div>
                  </div>
                  <div className="hs-btn-wrap">
                    <button className={`hs-open-btn ${callState==="incall"?"calling":""}`} onClick={()=>openInHubSpot(current)}>
                      {callState==="incall"?"🟢 Open in HubSpot":"🔗 Open in HubSpot to Call"}
                    </button>
                  </div>
                </div>
                <div className="timer-block">
                  <div className={`timer-val ${callState==="idle"?"idle":""}`}>{fmtTime(callSec)}</div>
                  <div className="timer-sub">{callState==="idle"?"ready":"in call"}</div>
                </div>
              </div>
            </div>
          )}

          {countdown>0&&(
            <div className="countdown-bar">
              <span className="cd-text">Opening next contact in HubSpot in</span>
              <span className="cd-num">{countdown}</span>
              <div className="cd-track"><div className="cd-fill" style={{width:`${(countdown/parseInt(config.autoDialDelay||"3"))*100}%`}}/></div>
              <button className="btn cancel-cd" onClick={cancelCountdown}>Cancel</button>
            </div>
          )}

          {showDemo&&(
            <div className="demo-panel">
              <div className="demo-title">📅 Book Demo — {current?.company}</div>
              <div className="demo-grid">
                <div className="field"><label>Demo Date & Time</label><input type="datetime-local" value={demoForm.datetime} onChange={e=>setDemoForm(f=>({...f,datetime:e.target.value}))}/></div>
                <div className="field"><label>AE Name</label><input placeholder="Anton Burton" value={demoForm.ae_name} onChange={e=>setDemoForm(f=>({...f,ae_name:e.target.value}))}/></div>
                <div className="field"><label>Source</label><input value="Outbound Cold Approach" readOnly style={{opacity:.6}}/></div>
                <div className="field"><label>Close Date</label><input value={eom()} readOnly style={{opacity:.6}}/></div>
                <div className="field full"><label>Call Notes</label><textarea placeholder="Key pain points, what resonated, next steps..." value={demoForm.notes} onChange={e=>setDemoForm(f=>({...f,notes:e.target.value}))}/></div>
              </div>
              <div style={{display:"flex",gap:8,marginTop:14}}>
                <button className="btn orange" style={{flex:1,padding:"11px",fontSize:14}} onClick={confirmDemo}>✓ Confirm Demo Booked</button>
                <button className="btn" onClick={()=>setShowDemo(false)}>Cancel</button>
              </div>
            </div>
          )}

          <div className="log-box">
            <div className="log-title">Activity Log</div>
            <div className="log-scroll" ref={logRef}>
              {log.length===0&&<div style={{fontSize:12,color:"var(--text3)",fontWeight:500}}>Waiting for activity...</div>}
              {log.map((l,i)=><div key={i} className="log-row"><span className="log-t">{l.time}</span><span className={`log-msg ${l.type}`}>{l.text}</span></div>)}
            </div>
          </div>
        </div>

        <div className="action-bar">
          <div className="action-row">
            <button className="btn orange" style={{fontSize:14,padding:"9px 22px"}} onClick={startCall} disabled={!current||callState==="incall"}>
              {callState==="incall"?"📞 Calling...":"📞 Start Call"}
            </button>
            <button className="btn orange" onClick={()=>{setCallState("paused");setShowDemo(true);}} disabled={!current}>📅 Demo Booked</button>
            <div className="divider"/>
            <button className="btn success" onClick={()=>applyOutcome("answered")} disabled={!current}>✓ Answered</button>
            <button className="btn danger" onClick={()=>applyOutcome("no_answer")} disabled={!current}>✗ No Answer</button>
            <button className="btn" onClick={()=>applyOutcome("skip")} disabled={!current}>Skip →</button>
            <div style={{marginLeft:"auto",display:"flex",gap:6}}>
              <button className="btn" onClick={()=>{setCallState("idle");setIdx(i=>Math.max(0,i-1));clearInterval(countdownRef.current);setCountdown(0);}} disabled={idx===0}>← Prev</button>
              <button className="btn" onClick={()=>{setCallState("idle");setIdx(i=>Math.min(contacts.length-1,i+1));clearInterval(countdownRef.current);setCountdown(0);}} disabled={idx>=contacts.length-1}>Next →</button>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:20,paddingTop:8,borderTop:"1px solid var(--border)"}}>
            <span style={{fontSize:12,fontWeight:700,color:"var(--text2)"}}>No-Answer Follow-ups:</span>
            <div className="toggle-row" onClick={()=>setEmailOn(v=>!v)}>
              <div className={`toggle ${emailOn?"on":""}`}/><span className={`tlabel ${emailOn?"on":""}`}>✉ Email {emailOn?"On":"Off"}</span>
            </div>
            <div className="toggle-row" onClick={()=>setSmsOn(v=>!v)}>
              <div className={`toggle ${smsOn?"on":""}`}/><span className={`tlabel ${smsOn?"on":""}`}>💬 SMS {smsOn?"On":"Off"}</span>
            </div>
          </div>
        </div>
      </div>
    </div></>
  );
}

export default function App(){
  const [config,setConfig]=useState(null);
  if(!config)return <Setup onSubmit={setConfig}/>;
  return <Dialer config={config}/>;
}

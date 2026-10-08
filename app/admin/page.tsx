"use client";
import {useMemo,useState} from "react";
type R={id:number;created_at:string;source:string|null;answers:Record<string,string|string[]>};
const labels:Record<string,string>={business:"Business",outlets:"Locations",role:"Role",pain:"Main problems",channels:"Customer channels",repetitive:"Repeated questions",missed:"Delayed/missed requests",lost:"Lost enquiries",automate:"Tasks to remove",systems:"Current tools",value_score:"Value of solving it",price:"Reasonable monthly price",biggest:"Biggest problem",contact:"Contact"};
function vals(rows:R[],key:string){const m=new Map<string,number>();rows.forEach(r=>{const v=r.answers?.[key],a=Array.isArray(v)?v:v?[v]:[];a.forEach(x=>m.set(x,(m.get(x)||0)+1))});return [...m.entries()].sort((a,b)=>b[1]-a[1])}
const pct=(n:number,t:number)=>t?Math.round(n*100/t):0;
export default function Dashboard(){
const[rows,setRows]=useState<R[]>([]),[error,setError]=useState(""),[loading,setLoading]=useState(true);
async function load(){setLoading(true);setError("");const r=await fetch("/api/admin/responses",{cache:"no-store"});if(!r.ok){setError("Could not load responses.");setLoading(false);return}const d=await r.json();setRows(d.responses||[]);setLoading(false)}
useState(()=>{load()});
const m=useMemo(()=>{const t=rows.length;return{t,lost:rows.filter(r=>["Sometimes","Often"].includes(String(r.answers?.lost))).length,rep:rows.filter(r=>["A lot","A significant amount"].includes(String(r.answers?.repetitive))).length,high:rows.filter(r=>["Very valuable","Extremely valuable"].includes(String(r.answers?.value_score))).length,pay:rows.filter(r=>!["I wouldn’t pay for it","It depends on the results it delivers"].includes(String(r.answers?.price))).length}},[rows]);
async function download(){const r=await fetch("/api/admin/export");if(!r.ok)return;const b=await r.blob(),u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download="hospitality-survey-responses.csv";a.click();URL.revokeObjectURL(u)}
if(!auth)return <main className="admin-shell"><section className="admin-card"><div className="eyebrow">Private research</div><h1>Survey dashboard</h1><p>Enter the admin password to view responses.</p><input className="admin-input" type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&load()} placeholder="Admin password"/><button className="admin-button" onClick={load} disabled={loading}>{loading?"Checking…":"Open dashboard"}</button>{error&&<p className="admin-error">{error}</p>}</section></main>;

"use client";
import {useEffect,useState} from "react";
type R={id:number;created_at:string;source:string|null;answers:Record<string,string|string[]>};
export default function Research(){
const[rows,setRows]=useState<R[]>([]),[error,setError]=useState(""),[loading,setLoading]=useState(true);
useEffect(()=>{fetch("/api/research",{cache:"no-store"}).then(r=>r.json()).then(d=>setRows(d.responses||[])).catch(()=>setError("Could not load responses.")).finally(()=>setLoading(false))},[]);
return <main className="admin-shell"><section className="admin-card admin-wide"><div className="eyebrow">Research</div><h1>Hospitality survey</h1><p>Live customer responses.</p>{error&&<p className="admin-error">{error}</p>}{loading?<p>Loading…</p>:<div className="admin-breakdown">{rows.length===0?<p>No responses yet.</p>:rows.map(r=><details key={r.id}><summary>#{r.id} · {new Date(r.created_at).toLocaleString()} {r.source?"· "+r.source:""}</summary><div className="admin-detail">{Object.entries(r.answers||{}).map(([k,v])=><p key={k}><strong>{k}:</strong> {Array.isArray(v)?v.join(", "):String(v)}</p>)}</div></details>)}</div>}</section></main>
}
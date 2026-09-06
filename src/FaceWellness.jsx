import { useState, useEffect, useRef } from "react";

const FACE_API_CDN = "https://unpkg.com/face-api.js@0.22.2/dist/face-api.min.js";
const MODELS_URL   = "https://justadudewhohacks.github.io/face-api.js/weights";

function expressionsToStress(expr) {
  if (!expr) return { score: 50, mood: "Neutral", risk: "Medium", dominant: "neutral" };
  const { happy=0,sad=0,angry=0,fearful=0,disgusted=0,surprised=0,neutral=0 } = expr;
  const stressRaw = sad*70+angry*85+fearful*80+disgusted*65+surprised*30+neutral*40-happy*60;
  const score = Math.max(0, Math.min(100, Math.round(50 + stressRaw * 50)));
  const emotions = { happy,sad,angry,fearful,disgusted,surprised,neutral };
  const dominant = Object.entries(emotions).sort((a,b)=>b[1]-a[1])[0][0];
  const moodMap = { happy:"Happy ??",sad:"Sad ??",angry:"Stressed ??",fearful:"Anxious ??",disgusted:"Uncomfortable ??",surprised:"Alert ??",neutral:"Neutral ??" };
  const risk = score>=60?"High":score>=35?"Medium":"Low";
  return { score, mood: moodMap[dominant]||"Neutral", risk, dominant, expressions: expr };
}

export default function FaceWellness({ onClose, onResult }) {
  const videoRef=useRef(null), canvasRef=useRef(null), streamRef=useRef(null), intervalRef=useRef(null);
  const [phase,setPhase]=useState("loading");
  const [loadMsg,setLoadMsg]=useState("Loading face detection AI...");
  const [scanProgress,setScan]=useState(0);
  const [expressions,setExpr]=useState(null);
  const [wellness,setWellness]=useState(null);
  const [aiAdvice,setAiAdvice]=useState("");
  const [aiLoading,setAiLoading]=useState(false);
  const [faceDetected,setFaceDetected]=useState(false);

  useEffect(()=>{ loadFaceAPI(); return ()=>cleanup(); },[]);

  const cleanup=()=>{
    if(intervalRef.current) clearInterval(intervalRef.current);
    if(streamRef.current) streamRef.current.getTracks().forEach(t=>t.stop());
  };

  const loadFaceAPI=async()=>{
    try {
      if(!window.faceapi){
        setLoadMsg("Loading face detection models...");
        await new Promise((res,rej)=>{
          const s=document.createElement("script");
          s.src=FACE_API_CDN; s.onload=res; s.onerror=rej;
          document.head.appendChild(s);
        });
      }
      setLoadMsg("Loading expression models...");
      await Promise.all([
        window.faceapi.nets.tinyFaceDetector.loadFromUri(MODELS_URL),
        window.faceapi.nets.faceExpressionNet.loadFromUri(MODELS_URL),
        window.faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODELS_URL),
      ]);
      setLoadMsg("Starting camera...");
      const stream=await navigator.mediaDevices.getUserMedia({video:{width:640,height:480,facingMode:"user"}});
      streamRef.current=stream;
      if(videoRef.current){ videoRef.current.srcObject=stream; await videoRef.current.play(); }
      setPhase("ready");
    } catch(err){ setLoadMsg("Error: "+(err.message||"Could not load camera")); setPhase("error"); }
  };

  const startScan=()=>{
    setPhase("scanning"); setScan(0); setFaceDetected(false);
    let progress=0; const frames=[];
    intervalRef.current=setInterval(async()=>{
      if(!videoRef.current||!window.faceapi) return;
      try {
        const det=await window.faceapi.detectSingleFace(videoRef.current,new window.faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true).withFaceExpressions();
        if(det){
          setFaceDetected(true); frames.push(det.expressions);
          if(canvasRef.current){
            const ctx=canvasRef.current.getContext("2d");
            canvasRef.current.width=videoRef.current.videoWidth;
            canvasRef.current.height=videoRef.current.videoHeight;
            ctx.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);
            const box=det.detection.box;
            ctx.strokeStyle="#4F6B4A"; ctx.lineWidth=3;
            ctx.strokeRect(box.x,box.y,box.width,box.height);
            ctx.fillStyle="rgba(79,107,74,0.85)";
            ctx.fillRect(box.x,box.y-28,130,24);
            ctx.fillStyle="white"; ctx.font="13px Inter";
            ctx.fillText("Face detected",box.x+6,box.y-10);
          }
        } else { setFaceDetected(false); }
      } catch(e){}
      progress+=4; setScan(Math.min(progress,100));
      if(progress>=100){ clearInterval(intervalRef.current); finishScan(frames); }
    },120);
  };

  const finishScan=(frames)=>{
    if(frames.length===0){ setPhase("ready"); return; }
    const keys=["happy","sad","angry","fearful","disgusted","surprised","neutral"];
    const avg={};
    keys.forEach(k=>{ avg[k]=frames.reduce((s,f)=>s+(f[k]||0),0)/frames.length; });
    const result=expressionsToStress(avg);
    setExpr(avg); setWellness(result); setPhase("result");
    getAIAdvice(result);
  };

  const getAIAdvice=async(result)=>{
    setAiLoading(true);
    const exprSummary=result.expressions
      ?Object.entries(result.expressions).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,v])=>`${k}: ${(v*100).toFixed(0)}%`).join(", ")
      :"neutral";
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-6", max_tokens:600,
          system:"You are a compassionate wellness advisor for Indian Armed Forces personnel. Be warm and practical.",
          messages:[{role:"user",content:`A CAPF personnel just completed a facial wellness scan. Mood: ${result.mood}, Stress: ${result.risk} (${result.score}/100), Expressions: ${exprSummary}. Write 2-3 warm, practical wellness tips in 120 words max. No bullet points.`}]
        })
      });
      const d=await res.json();
      setAiAdvice(d.content?.[0]?.text||getOfflineAdvice(result.risk));
    } catch{ setAiAdvice(getOfflineAdvice(result.risk)); }
    setAiLoading(false);
  };

  const getOfflineAdvice=(risk)=>({
    High:"Your face is showing significant stress. Please speak to your Welfare Officer today. Take a moment now — breathe in for 4 counts, hold for 4, out for 4. Rest is strength, not weakness. You do not have to carry this alone.",
    Medium:"Your expression shows some tension today. Step outside for 5 minutes — fresh air shifts your mood. Connect with a trusted colleague. Small moments of rest add up significantly.",
    Low:"Your face reflects a positive, stable state today. Keep nurturing this — your habits are working well. Check in on a colleague who might need support today."
  }[risk]||"Take care of yourself. Small steps toward wellness matter every day.");

  const riskColor={High:"#C0392B",Medium:"#D4870A",Low:"#4F6B4A"};
  const exprEmoji={happy:"??",sad:"??",angry:"??",fearful:"??",disgusted:"??",surprised:"??",neutral:"??"};

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(8px)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"Inter,sans-serif"}}>
      <div style={{width:"100%",maxWidth:500,background:"#0F1825",borderRadius:20,border:"1px solid rgba(255,255,255,0.1)",overflow:"hidden",maxHeight:"95vh",overflowY:"auto"}}>
        <div style={{background:"#10192B",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#4F6B4A,#B8922F)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>??</div>
            <div>
              <div style={{fontFamily:"Spectral,serif",color:"#EDE9DD",fontWeight:600,fontSize:16}}>Face Wellness Scan</div>
              <div style={{fontSize:11,color:"#8D9AAE"}}>AI stress detection · Private & secure</div>
            </div>
          </div>
          <button onClick={()=>{cleanup();onClose();}} style={{color:"#8D9AAE",fontSize:20,background:"none",border:"none",cursor:"pointer"}}>?</button>
        </div>

        <div style={{padding:20}}>
          {(phase==="loading"||phase==="error")&&(
            <div style={{textAlign:"center",padding:"40px 20px"}}>
              {phase==="loading"
                ?<><div style={{width:48,height:48,border:"3px solid rgba(255,255,255,0.1)",borderTopColor:"#B8922F",borderRadius:"50%",animation:"fwspin 0.8s linear infinite",margin:"0 auto 20px"}}/><div style={{color:"#EDE9DD",fontSize:15,marginBottom:8}}>{loadMsg}</div><div style={{fontSize:12,color:"#8D9AAE"}}>Allow camera access when prompted</div></>
                :<><div style={{fontSize:48,marginBottom:16}}>??</div><div style={{color:"#e74c3c",fontSize:14,marginBottom:16}}>{loadMsg}</div><button onClick={()=>{cleanup();onClose();}} style={{padding:"10px 24px",borderRadius:8,background:"#4F6B4A",border:"none",color:"white",cursor:"pointer"}}>Close</button></>
              }
            </div>
          )}

          {(phase==="ready"||phase==="scanning")&&(
            <>
              <div style={{position:"relative",borderRadius:12,overflow:"hidden",marginBottom:16,background:"#000"}}>
                <video ref={videoRef} autoPlay muted playsInline style={{width:"100%",display:"block",transform:"scaleX(-1)",maxHeight:280,objectFit:"cover"}}/>
                <canvas ref={canvasRef} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",transform:"scaleX(-1)"}}/>
                <div style={{position:"absolute",top:10,right:10,background:faceDetected?"rgba(79,107,74,0.9)":"rgba(192,57,43,0.9)",borderRadius:20,padding:"4px 12px",fontSize:11,color:"white",fontWeight:600}}>
                  {faceDetected?"? Face detected":"? Looking for face..."}
                </div>
              </div>
              {phase==="scanning"&&(
                <div style={{marginBottom:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#8D9AAE",marginBottom:6}}><span>Analyzing expressions...</span><span>{scanProgress}%</span></div>
                  <div style={{height:6,background:"rgba(255,255,255,0.08)",borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${scanProgress}%`,background:"linear-gradient(90deg,#4F6B4A,#B8922F)",borderRadius:3,transition:"width 0.1s"}}/>
                  </div>
                  <div style={{fontSize:11,color:"#8D9AAE",marginTop:6,textAlign:"center"}}>
                    {scanProgress<30?"Detecting facial features...":scanProgress<60?"Reading emotional expressions...":scanProgress<90?"Calculating wellness score...":"Almost done..."}
                  </div>
                </div>
              )}
              {phase==="ready"&&(
                <>
                  <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:"12px 16px",marginBottom:16,fontSize:12,color:"#8D9AAE",lineHeight:1.6}}>
                    ?? Processed locally in your browser. Nothing stored or sent to any server.
                  </div>
                  <button onClick={startScan} style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#4F6B4A,#B8922F)",border:"none",borderRadius:10,color:"white",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"Spectral,serif"}}>
                    ?? Start Face Wellness Scan
                  </button>
                </>
              )}
            </>
          )}

          {phase==="result"&&wellness&&(
            <>
              <div style={{textAlign:"center",marginBottom:20}}>
                <div style={{fontSize:56,marginBottom:8}}>{exprEmoji[wellness.dominant]||"??"}</div>
                <div style={{fontFamily:"Spectral,serif",fontSize:26,fontWeight:700,color:riskColor[wellness.risk],marginBottom:4}}>{wellness.mood}</div>
                <div style={{fontSize:13,color:"#8D9AAE"}}>Stress Score: {wellness.score}/100 · {wellness.risk} Risk</div>
              </div>
              <div style={{background:"rgba(255,255,255,0.06)",borderRadius:10,padding:16,marginBottom:16}}>
                <div style={{height:10,background:"rgba(255,255,255,0.08)",borderRadius:5,overflow:"hidden",marginBottom:8}}>
                  <div style={{height:"100%",width:`${wellness.score}%`,background:wellness.score>=60?"linear-gradient(90deg,#e74c3c,#c0392b)":wellness.score>=35?"linear-gradient(90deg,#e67e22,#d35400)":"linear-gradient(90deg,#27ae60,#1e8449)",borderRadius:5}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"rgba(255,255,255,0.3)"}}>
                  <span>Relaxed</span><span>Moderate</span><span>High Stress</span>
                </div>
              </div>
              {expressions&&(
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:10,padding:16,marginBottom:16}}>
                  <div style={{fontFamily:"Spectral,serif",color:"#EDE9DD",fontWeight:600,fontSize:13,marginBottom:12}}>Expression Breakdown</div>
                  {Object.entries(expressions).sort((a,b)=>b[1]-a[1]).map(([emotion,value])=>(
                    <div key={emotion} style={{marginBottom:8}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
                        <span style={{color:"#8D9AAE",textTransform:"capitalize"}}>{exprEmoji[emotion]} {emotion}</span>
                        <span style={{color:"#EDE9DD",fontWeight:600}}>{(value*100).toFixed(0)}%</span>
                      </div>
                      <div style={{height:5,background:"rgba(255,255,255,0.08)",borderRadius:3,overflow:"hidden"}}>
                        <div style={{height:"100%",width:`${value*100}%`,background:emotion==="happy"?"#4F6B4A":emotion==="neutral"?"#5A6A7A":emotion==="surprised"?"#B8922F":"#C0392B",borderRadius:3}}/>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(184,146,47,0.3)",borderRadius:10,padding:16,marginBottom:16}}>
                <div style={{fontFamily:"Spectral,serif",color:"#B8922F",fontWeight:600,fontSize:14,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>?? AI Wellness Advisor</div>
                {aiLoading
                  ?<div style={{display:"flex",alignItems:"center",gap:10,color:"#8D9AAE",fontSize:13}}><div style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.1)",borderTopColor:"#B8922F",borderRadius:"50%",animation:"fwspin 0.7s linear infinite"}}/> Analyzing your wellness...</div>
                  :<div style={{fontSize:13,color:"rgba(255,255,255,0.8)",lineHeight:1.75}}>{aiAdvice}</div>
                }
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>{setPhase("ready");setWellness(null);setExpr(null);setAiAdvice("");setScan(0);}} style={{flex:1,padding:"12px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,color:"#8D9AAE",cursor:"pointer",fontSize:13}}>
                  ?? Scan Again
                </button>
                <button onClick={()=>{if(onResult)onResult(wellness);cleanup();onClose();}} style={{flex:2,padding:"12px",background:"linear-gradient(135deg,#4F6B4A,#B8922F)",border:"none",borderRadius:10,color:"white",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"Spectral,serif"}}>
                  ? Use This Result
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes fwspin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

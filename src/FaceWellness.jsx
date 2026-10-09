import { useState, useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

const LABELS = ["angry","disgust","fear","happy","neutral","sad","surprise"];
const MODEL_URL = "/emotion_model/model.json";
const API_URL = "https://veersense-backend.onrender.com";

// stress weight for each emotion, same order as LABELS
const STRESS_WEIGHTS = [0.9, 0.7, 0.85, 0, 0.2, 0.75, 0.4];

function predictStress(probs) {
  let raw = 0;
  probs.forEach((p, i) => { raw += (p || 0) * STRESS_WEIGHTS[i]; });
  const score = Math.max(0, Math.min(100, Math.round(raw * 100)));
  const dominant = LABELS[probs.indexOf(Math.max(...probs))];
  const risk = score >= 60 ? "High" : score >= 35 ? "Medium" : "Low";
  const moodMap = {
    angry:"Stressed", disgust:"Uncomfortable", fear:"Anxious",
    happy:"Happy", neutral:"Neutral", sad:"Sad", surprise:"Alert"
  };
  return { score, risk, dominant, mood: moodMap[dominant] || "Neutral", probs };
}

export default function FaceWellness({ onClose, onResult }) {
  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const streamRef  = useRef(null);
  const timerRef   = useRef(null);
  const modelRef   = useRef(null);
  const mountedRef = useRef(true);

  const [phase,    setPhase]    = useState("init");
  const [progress, setProgress] = useState(0);
  const [result,   setResult]   = useState(null);
  const [advice,   setAdvice]   = useState("");
  const [loadMsg,  setLoadMsg]  = useState("Starting camera...");
  const [probBars, setProbBars] = useState([]);

  useEffect(() => {
    mountedRef.current = true;
    startCamera();
    return () => { mountedRef.current = false; stop(); };
  }, []);

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      setPhase("init");
      setLoadMsg("Starting camera...");
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera is not available. The page must be opened over HTTPS.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false
      });
      if (!mountedRef.current) {
        stream.getTracks().forEach(t => t.stop());
        return;
      }
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      setPhase("ready");
    } catch (e) {
      console.error("Camera error:", e);
      let msg = "Camera error: " + e.message;
      if (e.name === "NotAllowedError") {
        msg = "Camera permission was denied. Click the camera icon in the browser address bar, allow access, then try again.";
      } else if (e.name === "NotFoundError") {
        msg = "No camera was found on this device.";
      } else if (e.name === "NotReadableError") {
        msg = "The camera is being used by another app. Close it and try again.";
      }
      setLoadMsg(msg);
      setPhase("error");
    }
  };

  const analyzeFrame = async (allProbs) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !modelRef.current || video.videoWidth === 0) return;

    const ctx = canvas.getContext("2d");
    canvas.width = 48;
    canvas.height = 48;
    const size = Math.min(video.videoWidth, video.videoHeight);
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;
    ctx.drawImage(video, sx, sy, size, size, 0, 0, 48, 48);
    const imageData = ctx.getImageData(0, 0, 48, 48);

    const input = tf.tidy(() =>
      tf.browser.fromPixels(imageData, 1).toFloat().div(255.0).expandDims(0)
    );
    try {
      const pred = modelRef.current.predict(input);
      const outputs = Array.isArray(pred) ? pred : [pred];
      const probs = Array.from(await outputs[0].data());
      outputs.forEach(t => t.dispose());
      if (probs.length === LABELS.length) {
        allProbs.push(probs);
        setProbBars(probs);
      }
    } catch (e) {
      console.error("Frame analysis error:", e);
    } finally {
      input.dispose();
    }
  };

  const scan = async () => {
    setPhase("loading");
    setLoadMsg("Loading AI emotion model...");
    setProgress(0);
    setProbBars([]);

    try {
      if (!modelRef.current) {
        await tf.ready();
        modelRef.current = await tf.loadGraphModel(MODEL_URL);
      }
    } catch (e) {
      console.error("Model load error:", e);
      setLoadMsg("Could not load the emotion model. Check that " + MODEL_URL + " exists in the public folder.");
      setPhase("problem");
      return;
    }

    setPhase("scanning");
    let p = 0;
    let busy = false;
    const allProbs = [];

    timerRef.current = setInterval(async () => {
      if (!busy) {
        busy = true;
        await analyzeFrame(allProbs);
        busy = false;
      }
      p += 5;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(timerRef.current);
        finish(allProbs);
      }
    }, 200);
  };

  const finish = (allProbs) => {
    if (allProbs.length === 0) {
      setLoadMsg("No face data was captured. Make sure your face is visible and well lit, then try again.");
      setPhase("problem");
      return;
    }

    const avg = new Array(LABELS.length).fill(0);
    allProbs.forEach(p => p.forEach((v, i) => { avg[i] += v; }));
    avg.forEach((v, i) => { avg[i] = v / allProbs.length; });

    const r = predictStress(avg);
    setResult(r);
    setProbBars(avg);
    setPhase("result");
    getAdvice(r);
  };

  const getAdvice = async (r) => {
    try {
      const res = await fetch(API_URL + "/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: "My facial scan result: Mood=" + r.mood + ", Risk=" + r.risk +
              ", Score=" + r.score + "/100, Emotion=" + r.dominant +
              ". Give 2 specific wellness tips in 70 words max. Be encouraging."
          }],
          context: { role: "personnel", risk: r.risk, score: r.score }
        })
      });
      const d = await res.json();
      if (!res.ok) throw new Error(JSON.stringify(d));
      setAdvice(d.reply || getDefault(r.risk));
    } catch (e) {
      console.error("Advice error:", e);
      setAdvice(getDefault(r.risk));
    }
  };

  const getDefault = (risk) => ({
    High:   "Your face shows significant stress. Please speak to your Welfare Officer today. Take slow deep breaths — 4 counts in, hold 4, out 4. You are stronger than you feel right now.",
    Medium: "Some tension is visible. Step outside for 5 minutes and breathe fresh air. Connect with a trusted colleague — sharing lightens the load significantly.",
    Low:    "You look calm and positive today! Keep nurturing this energy. Check in on a colleague who might need your support."
  }[risk] || "Take care of yourself today.");

  const RC = { High: "#e74c3c", Medium: "#e67e22", Low: "#27ae60" };
  const EI = {
    angry: "Stressed", disgust: "Uncomfortable", fear: "Anxious",
    happy: "Happy", neutral: "Neutral", sad: "Sad", surprise: "Alert"
  };
  const EM = {
    angry: "😤", disgust: "😒", fear: "😨",
    happy: "😊", neutral: "😐", sad: "😔", surprise: "😮"
  };

  const showCam = phase === "ready" || phase === "loading" || phase === "scanning";

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 300,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16, fontFamily: "Inter,sans-serif"
    }}>
      <div style={{
        width: "100%", maxWidth: 460, background: "#0F1825", borderRadius: 18,
        border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden",
        maxHeight: "95vh", overflowY: "auto"
      }}>

        {/* Header */}
        <div style={{
          background: "#10192B", padding: "14px 18px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.08)"
        }}>
          <div>
            <div style={{ color: "#EDE9DD", fontWeight: 600, fontSize: 15 }}>
              Face Wellness Scan
            </div>
            <div style={{ color: "#8D9AAE", fontSize: 11, marginTop: 2 }}>
              AI stress detection · Private · Your trained model
            </div>
          </div>
          <button onClick={() => { stop(); onClose(); }}
            style={{ color: "#8D9AAE", background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>
            X
          </button>
        </div>

        <div style={{ padding: 18 }}>

          {/* Init */}
          {phase === "init" && (
            <div style={{ textAlign: "center", padding: "30px 20px" }}>
              <div style={{
                width: 36, height: 36,
                border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "#B8922F",
                borderRadius: "50%", animation: "fws 0.8s linear infinite",
                margin: "0 auto 14px"
              }}/>
              <div style={{ color: "#EDE9DD" }}>{loadMsg}</div>
            </div>
          )}

          {/* Camera error */}
          {phase === "error" && (
            <div style={{ textAlign: "center", padding: "30px 20px" }}>
              <div style={{ color: "#e74c3c", marginBottom: 14, lineHeight: 1.6 }}>{loadMsg}</div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <button onClick={startCamera}
                  style={{ padding: "8px 20px", background: "#4F6B4A", border: "none", borderRadius: 8, color: "white", cursor: "pointer" }}>
                  Try Again
                </button>
                <button onClick={() => { stop(); onClose(); }}
                  style={{ padding: "8px 20px", background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, color: "#EDE9DD", cursor: "pointer" }}>
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Model / scan problem */}
          {phase === "problem" && (
            <div style={{ textAlign: "center", padding: "30px 20px" }}>
              <div style={{ color: "#e67e22", marginBottom: 14, lineHeight: 1.6 }}>{loadMsg}</div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <button onClick={() => { setProgress(0); setProbBars([]); setPhase("ready"); }}
                  style={{ padding: "8px 20px", background: "#4F6B4A", border: "none", borderRadius: 8, color: "white", cursor: "pointer" }}>
                  Back
                </button>
                <button onClick={() => { stop(); onClose(); }}
                  style={{ padding: "8px 20px", background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, color: "#EDE9DD", cursor: "pointer" }}>
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Camera view - always mounted so the video element exists */}
          <div style={{ display: showCam ? "block" : "none" }}>
            <div style={{ position: "relative", borderRadius: 12, overflow: "hidden", marginBottom: 14, background: "#000" }}>
              <video ref={videoRef} autoPlay muted playsInline
                style={{ width: "100%", display: "block", maxHeight: 240, objectFit: "cover", transform: "scaleX(-1)" }}/>
              <canvas ref={canvasRef} style={{ display: "none" }}/>
              {phase === "scanning" && (
                <div style={{
                  position: "absolute", top: 8, right: 8,
                  background: "rgba(79,107,74,0.9)", borderRadius: 20,
                  padding: "3px 10px", fontSize: 11, color: "white"
                }}>
                  Scanning... {progress}%
                </div>
              )}
            </div>

            {/* Live emotion bars */}
            {phase === "scanning" && probBars.length > 0 && (
              <div style={{
                background: "rgba(255,255,255,0.04)", borderRadius: 10,
                padding: 12, marginBottom: 12
              }}>
                <div style={{ color: "#EDE9DD", fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
                  Live Emotion Detection
                </div>
                {LABELS.map((label, i) => (
                  <div key={label} style={{ marginBottom: 5 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}>
                      <span style={{ color: "#8D9AAE" }}>{EM[label]} {EI[label]}</span>
                      <span style={{ color: "#EDE9DD", fontWeight: 600 }}>
                        {((probBars[i] || 0) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
                      <div style={{
                        height: "100%",
                        width: ((probBars[i] || 0) * 100) + "%",
                        background: label === "happy" ? "#27ae60" : label === "neutral" ? "#5A6A7A" : "#e67e22",
                        borderRadius: 2, transition: "width 0.2s"
                      }}/>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Progress bar */}
            {phase === "scanning" && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3 }}>
                  <div style={{
                    height: "100%", width: progress + "%",
                    background: "linear-gradient(90deg,#4F6B4A,#B8922F)",
                    borderRadius: 3, transition: "width 0.2s"
                  }}/>
                </div>
              </div>
            )}

            {/* Loading model */}
            {phase === "loading" && (
              <div style={{ textAlign: "center", padding: "12px 0", color: "#8D9AAE", fontSize: 13 }}>
                <div style={{
                  width: 24, height: 24,
                  border: "2px solid rgba(255,255,255,0.1)", borderTopColor: "#B8922F",
                  borderRadius: "50%", animation: "fws 0.7s linear infinite",
                  margin: "0 auto 8px"
                }}/>
                {loadMsg}
              </div>
            )}

            {/* Start button */}
            {phase === "ready" && (
              <button onClick={scan} style={{
                width: "100%", padding: "14px",
                background: "linear-gradient(135deg,#4F6B4A,#B8922F)",
                border: "none", borderRadius: 10, color: "white",
                fontSize: 15, fontWeight: 700, cursor: "pointer"
              }}>
                Start Face Wellness Scan
              </button>
            )}
          </div>

          {/* Result */}
          {phase === "result" && result && (
            <div>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 48, marginBottom: 6 }}>{EM[result.dominant] || "😐"}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: RC[result.risk], marginBottom: 4 }}>
                  {result.mood}
                </div>
                <div style={{ color: "#8D9AAE", fontSize: 13 }}>
                  Stress Score: {result.score}/100 - {result.risk} Risk
                </div>
              </div>

              <div style={{ height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 5, marginBottom: 16 }}>
                <div style={{
                  height: "100%", width: result.score + "%",
                  background: RC[result.risk], borderRadius: 5, transition: "width 1s"
                }}/>
              </div>

              {result.probs && (
                <div style={{
                  background: "rgba(255,255,255,0.04)", borderRadius: 10,
                  padding: 14, marginBottom: 14
                }}>
                  <div style={{ color: "#EDE9DD", fontWeight: 600, fontSize: 13, marginBottom: 10 }}>
                    Emotion Analysis (Custom Trained Model)
                  </div>
                  {LABELS.map((label, i) => (
                    <div key={label} style={{ marginBottom: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 2 }}>
                        <span style={{ color: "#8D9AAE" }}>{EM[label]} {EI[label]}</span>
                        <span style={{ color: "#EDE9DD", fontWeight: 600 }}>
                          {((result.probs[i] || 0) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 2 }}>
                        <div style={{
                          height: "100%",
                          width: ((result.probs[i] || 0) * 100) + "%",
                          background: label === "happy" ? "#27ae60"
                            : label === "neutral" ? "#5A6A7A"
                            : label === "surprise" ? "#B8922F"
                            : "#e74c3c",
                          borderRadius: 2
                        }}/>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{
                background: "rgba(184,146,47,0.1)",
                border: "1px solid rgba(184,146,47,0.3)",
                borderRadius: 10, padding: 14, marginBottom: 14
              }}>
                <div style={{ color: "#B8922F", fontWeight: 600, fontSize: 13, marginBottom: 8 }}>
                  AI Wellness Advisor
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.82)", lineHeight: 1.75 }}>
                  {advice || "Loading personalized advice..."}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => {
                  setPhase("ready");
                  setResult(null);
                  setAdvice("");
                  setProgress(0);
                  setProbBars([]);
                }} style={{
                  flex: 1, padding: "11px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, color: "#8D9AAE", cursor: "pointer", fontSize: 13
                }}>
                  Scan Again
                </button>
                <button onClick={() => {
                  if (onResult) onResult(result);
                  stop();
                  onClose();
                }} style={{
                  flex: 2, padding: "11px",
                  background: "linear-gradient(135deg,#4F6B4A,#B8922F)",
                  border: "none", borderRadius: 8,
                  color: "white", cursor: "pointer", fontSize: 13, fontWeight: 600
                }}>
                  Use This Result
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
      <style>{"@keyframes fws{to{transform:rotate(360deg)}}"}</style>
    </div>
  );
}
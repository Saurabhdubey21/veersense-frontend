"""
Fixes App.jsx: replaces the broken direct-to-Anthropic fetch() call in the
ChatModal component with a call to your own backend's /chat endpoint.

USAGE:
  1. Copy this file into your frontend project folder (same folder as src/App.jsx,
     or adjust APP_JSX_PATH below).
  2. Run:  python fix_chat_endpoint.py
  3. It will print SUCCESS or tell you exactly what didn't match (so nothing
     gets silently corrupted).

This does a targeted string replacement — it will NOT touch any other part
of the file, and it verifies the old snippet exists exactly once before
replacing it.
"""

import sys
from pathlib import Path

APP_JSX_PATH = Path("src/App.jsx")  # adjust if your file lives elsewhere

OLD_SNIPPET = '''    try {
      const history = msgs.slice(1).map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text
      }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:1000,
          system: sysPrompt,
          messages: [...history, { role:"user", content: userMsg }]
        })
      });
      const d = await res.json();
      const reply = d.content?.[0]?.text || getOfflineReply(stressResult?.risk);
      setMsgs(p => [...p, { role:"ai", text: reply }]);
    } catch {
      setMsgs(p => [...p, { role:"ai", text: getOfflineReply(stressResult?.risk) }]);
    }'''

NEW_SNIPPET = '''    try {
      const history = msgs.slice(1).map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text
      }));
      const res = await fetch("https://veersense-backend.onrender.com/chat", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          role,
          system: sysPrompt,
          message: userMsg,
          history,
          stressResult
        })
      });
      if (!res.ok) throw new Error(`Backend responded ${res.status}`);
      const d = await res.json();
      const reply = d.reply || d.message || d.text || d.content?.[0]?.text || getOfflineReply(stressResult?.risk);
      setMsgs(p => [...p, { role:"ai", text: reply }]);
    } catch (err) {
      console.error("Chat backend error:", err);
      setMsgs(p => [...p, { role:"ai", text: getOfflineReply(stressResult?.risk) }]);
    }'''


def main():
    if not APP_JSX_PATH.exists():
        print(f"ERROR: {APP_JSX_PATH} not found. Edit APP_JSX_PATH at the top of this script "
              f"to point at your App.jsx, then re-run.")
        sys.exit(1)

    text = APP_JSX_PATH.read_text(encoding="utf-8")
    count = text.count(OLD_SNIPPET)

    if count == 0:
        print("ERROR: Could not find the expected old fetch() block in App.jsx.")
        print("The file may have already been changed. No edits were made.")
        sys.exit(1)
    elif count > 1:
        print(f"ERROR: Found the snippet {count} times (expected exactly 1). "
              f"Refusing to edit automatically to avoid ambiguity.")
        sys.exit(1)

    new_text = text.replace(OLD_SNIPPET, NEW_SNIPPET)
    APP_JSX_PATH.write_text(new_text, encoding="utf-8")
    print(f"SUCCESS: Patched {APP_JSX_PATH} — chat now calls "
          f"https://veersense-backend.onrender.com/chat instead of api.anthropic.com directly.")
    print("Next: git add, commit, push, and redeploy your frontend (Vercel/Netlify/wherever it's hosted).")


if __name__ == "__main__":
    main()

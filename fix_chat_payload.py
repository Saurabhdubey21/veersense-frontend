import sys
from pathlib import Path

APP_JSX_PATH = Path("src/App.jsx")

OLD_SNIPPET = '''    try {
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

NEW_SNIPPET = '''    try {
      const history = msgs.slice(1).map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text
      }));
      const res = await fetch("https://veersense-backend.onrender.com/chat", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          messages: [...history, { role:"user", content: userMsg }],
          context: {
            role,
            risk: stressResult?.risk,
            score: stressResult?.score
          }
        })
      });
      if (!res.ok) throw new Error(`Backend responded ${res.status}`);
      const d = await res.json();
      const reply = d.reply || getOfflineReply(stressResult?.risk);
      setMsgs(p => [...p, { role:"ai", text: reply }]);
    } catch (err) {
      console.error("Chat backend error:", err);
      setMsgs(p => [...p, { role:"ai", text: getOfflineReply(stressResult?.risk) }]);
    }'''


def main():
    if not APP_JSX_PATH.exists():
        print(f"ERROR: {APP_JSX_PATH} not found. Run this from the folder that contains 'src'.")
        sys.exit(1)

    text = APP_JSX_PATH.read_text(encoding="utf-8")
    count = text.count(OLD_SNIPPET)

    if count == 0:
        print("ERROR: Could not find the expected old fetch() block in App.jsx. No edits made.")
        print("This likely means a previous fix already changed this section differently than expected.")
        sys.exit(1)
    elif count > 1:
        print(f"ERROR: Found the snippet {count} times (expected exactly 1). No edits made.")
        sys.exit(1)

    new_text = text.replace(OLD_SNIPPET, NEW_SNIPPET)
    APP_JSX_PATH.write_text(new_text, encoding="utf-8")
    print(f"SUCCESS: Patched {APP_JSX_PATH} — chat now sends the correct {{messages, context}} shape your backend expects.")


if __name__ == "__main__":
    main()

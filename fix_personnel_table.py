import sys
from pathlib import Path

APP_JSX_PATH = Path("src/App.jsx")

OLD_SNIPPET = '''            <thead>
              <tr style={{ background:"#f9fafb" }}>
                {["ID","Name","Service ID","Rank","Department"].map(h => (
                  <th key={h} style={{ padding:"10px", textAlign:"left", fontSize:10,
                    color:"#9ca3af", fontWeight:600, borderBottom:"1px solid #f3f4f6" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {personnel && personnel.length > 0 ? (
                personnel.map((p) => (
                  <tr key={p.id} style={{ borderBottom:"1px solid #f9fafb" }}>
                    <td style={{ padding:"10px", fontFamily:"monospace", fontSize:11, color:"#6b7280" }}>{p.id}</td>
                    <td style={{ padding:"10px", color:T.ink }}>{p.name}</td>
                    <td style={{ padding:"10px", color:T.ink }}>{p.service_id}</td>
                    <td style={{ padding:"10px", color:T.ink }}>{p.rank}</td>
                    <td style={{ padding:"10px", color:T.ink }}>{p.department}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding:"20px", textAlign:"center", color:"#9ca3af" }}>
                    No personnel records found.
                  </td>
                </tr>
              )}
            </tbody>'''

NEW_SNIPPET = '''            <thead>
              <tr style={{ background:"#f9fafb" }}>
                {["ID","Service No","Rank","Unit","Risk Level","Stress Score"].map(h => (
                  <th key={h} style={{ padding:"10px", textAlign:"left", fontSize:10,
                    color:"#9ca3af", fontWeight:600, borderBottom:"1px solid #f3f4f6" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {personnel && personnel.length > 0 ? (
                personnel.map((p) => (
                  <tr key={p.id} style={{ borderBottom:"1px solid #f9fafb" }}>
                    <td style={{ padding:"10px", fontFamily:"monospace", fontSize:11, color:"#6b7280" }}>{p.id}</td>
                    <td style={{ padding:"10px", color:T.ink }}>{p.service_no}</td>
                    <td style={{ padding:"10px", color:T.ink }}>{p.rank}</td>
                    <td style={{ padding:"10px", color:T.ink }}>{p.unit}</td>
                    <td style={{ padding:"10px", fontWeight:600,
                      color: p.risk_level === "High" ? T.crimsonL : p.risk_level === "Medium" ? "#D4870A" : T.olive2 }}>
                      {p.risk_level}
                    </td>
                    <td style={{ padding:"10px", color:T.ink }}>{p.stress_score}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding:"20px", textAlign:"center", color:"#9ca3af" }}>
                    No personnel records found.
                  </td>
                </tr>
              )}
            </tbody>'''


def main():
    if not APP_JSX_PATH.exists():
        print(f"ERROR: {APP_JSX_PATH} not found. Run this from the folder that contains 'src'.")
        sys.exit(1)

    text = APP_JSX_PATH.read_text(encoding="utf-8")
    count = text.count(OLD_SNIPPET)

    if count == 0:
        print("ERROR: Could not find the expected old table block in App.jsx. No edits made.")
        sys.exit(1)
    elif count > 1:
        print(f"ERROR: Found the snippet {count} times (expected exactly 1). No edits made.")
        sys.exit(1)

    new_text = text.replace(OLD_SNIPPET, NEW_SNIPPET)
    APP_JSX_PATH.write_text(new_text, encoding="utf-8")
    print(f"SUCCESS: Patched {APP_JSX_PATH} — Personnel table now shows Service No, Rank, Unit, Risk Level, Stress Score.")


if __name__ == "__main__":
    main()

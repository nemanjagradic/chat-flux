interface Props {
  firstName: string;
  url: string;
}

export default function WelcomeEmail({ firstName, url }: Props) {
  return (
    <div
      style={{
        backgroundColor: "#0a0f1e",
        padding: "40px 0",
        fontFamily: "'DM Sans', Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "560px",
          margin: "0 auto",
          backgroundColor: "#0f1729",
          borderRadius: "20px",
          overflow: "hidden",
          border: "1px solid rgba(79,142,255,0.1)",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #0f1729 0%, #1a2640 100%)",
            padding: "36px 40px 28px",
            borderBottom: "1px solid rgba(79,142,255,0.1)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "28px",
              fontWeight: 800,
              color: "#dde6ff",
              letterSpacing: "-0.5px",
            }}
          >
            Chat<span style={{ color: "#4f8eff" }}>Flow</span>
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#5c6f9a",
              marginTop: "4px",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            Connect without limits
          </div>
        </div>

        <div style={{ padding: "36px 40px" }}>
          <h2
            style={{
              color: "#dde6ff",
              fontSize: "22px",
              fontWeight: 700,
              margin: "0 0 20px",
            }}
          >
            Welcome aboard, {firstName}! 🎉
          </h2>

          <p
            style={{
              color: "#5c6f9a",
              fontSize: "15px",
              lineHeight: "1.7",
              margin: "0 0 16px",
            }}
          >
            Your account is all set up and ready to go. Start connecting with
            friends, join group chats, and experience messaging without limits.
          </p>

          <p
            style={{
              color: "#5c6f9a",
              fontSize: "15px",
              lineHeight: "1.7",
              margin: "0 0 28px",
            }}
          >
            Head over to your profile to personalize your experience — add a
            photo, set a bio, and configure your notification preferences.
          </p>

          <table
            role="presentation"
            border={0}
            cellPadding={0}
            cellSpacing={0}
            style={{ margin: "0 0 28px" }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    backgroundColor: "#4f8eff",
                    borderRadius: "11px",
                    textAlign: "center",
                    boxShadow: "0 8px 28px rgba(79,142,255,0.35)",
                  }}
                >
                  <a
                    href={url}
                    target="_blank"
                    style={{
                      display: "inline-block",
                      padding: "13px 28px",
                      color: "#ffffff",
                      textDecoration: "none",
                      fontWeight: 700,
                      fontSize: "14px",
                      letterSpacing: "0.3px",
                    }}
                  >
                    Go to Your Account →
                  </a>
                </td>
              </tr>
            </tbody>
          </table>

          <div
            style={{
              backgroundColor: "#141e35",
              borderRadius: "12px",
              border: "1px solid rgba(79,142,255,0.1)",
              padding: "20px 24px",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                color: "#5c6f9a",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginBottom: "14px",
              }}
            >
              What you can do
            </div>
            {[
              { icon: "💬", text: "Send direct messages to anyone" },
              { icon: "👥", text: "Create and join group chats" },
              { icon: "⭐", text: "Star important messages for later" },
              { icon: "🔔", text: "Customize your notification settings" },
            ].map((item, i) => (
              <table
                key={i}
                role="presentation"
                border={0}
                cellPadding={0}
                cellSpacing={0}
                style={{ marginBottom: i < 3 ? "10px" : "0" }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        fontSize: "16px",
                        paddingRight: "10px",
                        verticalAlign: "middle",
                        width: "26px",
                      }}
                    >
                      {item.icon}
                    </td>
                    <td
                      style={{
                        color: "#dde6ff",
                        fontSize: "13px",
                        verticalAlign: "middle",
                      }}
                    >
                      {item.text}
                    </td>
                  </tr>
                </tbody>
              </table>
            ))}
          </div>

          <p
            style={{
              color: "#5c6f9a",
              fontSize: "13px",
              lineHeight: "1.6",
              margin: "0",
            }}
          >
            If you have any questions, just reply to this email — we&apos;re
            always happy to help.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#141e35",
            padding: "20px 40px",
            borderTop: "1px solid rgba(79,142,255,0.1)",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#5c6f9a", fontSize: "12px", margin: "0" }}>
            — The ChatFlow Team
          </p>
        </div>
      </div>
    </div>
  );
}

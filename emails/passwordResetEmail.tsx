interface Props {
  firstName: string;
  url: string;
}

export default function PasswordResetEmail({ firstName, url }: Props) {
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
            Chat<span style={{ color: "#4f8eff" }}>Flux</span>
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
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              backgroundColor: "rgba(255,101,132,0.1)",
              border: "1px solid rgba(255,101,132,0.2)",
              fontSize: "24px",
              marginBottom: "20px",
              textAlign: "center",
              lineHeight: "52px",
            }}
          >
            🔒
          </div>

          <h2
            style={{
              color: "#dde6ff",
              fontSize: "22px",
              fontWeight: 700,
              margin: "0 0 20px",
            }}
          >
            Password Reset Request
          </h2>

          <p
            style={{
              color: "#5c6f9a",
              fontSize: "15px",
              lineHeight: "1.7",
              margin: "0 0 16px",
            }}
          >
            Hi {firstName}, we received a request to reset the password for your
            ChatFlux account.
          </p>

          <p
            style={{
              color: "#5c6f9a",
              fontSize: "15px",
              lineHeight: "1.7",
              margin: "0 0 28px",
            }}
          >
            Click the button below to choose a new password. This link is valid
            for <strong style={{ color: "#dde6ff" }}>10 minutes</strong> only.
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
                    Reset My Password →
                  </a>
                </td>
              </tr>
            </tbody>
          </table>

          <div
            style={{
              backgroundColor: "rgba(255,101,132,0.06)",
              borderRadius: "12px",
              border: "1px solid rgba(255,101,132,0.15)",
              padding: "16px 20px",
              marginBottom: "28px",
            }}
          >
            <p
              style={{
                color: "#ff6584",
                fontSize: "13px",
                lineHeight: "1.6",
                margin: "0",
                fontWeight: 500,
              }}
            >
              ⚠️ If you didn&apos;t request a password reset, you can safely
              ignore this email. Your password will remain unchanged.
            </p>
          </div>

          <p
            style={{
              color: "#5c6f9a",
              fontSize: "13px",
              lineHeight: "1.6",
              margin: "0",
            }}
          >
            For security, this link will expire in 10 minutes. If you need a new
            one, you can request another reset from the login page.
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
            — The ChatFlux Team
          </p>
        </div>
      </div>
    </div>
  );
}

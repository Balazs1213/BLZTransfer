export default function ProgressBar({ progress, text, currentStatus }) {
  let barColor = "#3b82f6"; 
  if (currentStatus === "Clean") barColor = "#10b981"; 
  if (currentStatus === "Infected" || currentStatus === "Error")
    barColor = "#ef4444"; 

  return (
    <div style={{ marginTop: "20px", width: "100%" }}>
      <div
        style={{
          background: "#e5e7eb",
          borderRadius: "8px",
          height: "16px",
          overflow: "hidden",
          width: "100%",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            background: barColor,
            height: "100%",
            transition: "width 0.5s ease-in-out, background-color 0.3s ease",
          }}
        />
      </div>
      {text && (
        <p
          style={{
            textAlign: "center",
            marginTop: "8px",
            fontSize: "14px",
            fontWeight: "500",
            color: "#374151",
          }}
        >
          {text} ({progress}%)
        </p>
      )}
    </div>
  );
}

/**
 * One tool call, end to end, through a real harness.
 *   MODEL proposes a call; PARSE turns generated text into a structured call
 *   (repairing it when the model's JSON is broken); POLICY decides whether it
 *   may run, may run unattended, or needs a human; EXECUTE is where your code
 *   actually runs it; CONTEXT folds the result back into the next request.
 * The dashed line is the trust boundary: it sits before execution, and every
 * decision on it leaves a receipt. Source paths under each stage are the
 * files in openclaw/openclaw that implement it.
 * Inline SVG so it follows the site theme (currentColor); accent is the
 * site's terracotta.
 */
const ACCENT = "#c15f3c";

const STAGES = [
  { x: 24, title: "MODEL", sub: "proposes a call", accent: false, src: ["embedded-agent-runner/", "run-loop.ts"] },
  { x: 168, title: "PARSE", sub: "JSON, repaired if broken", accent: false, src: ["run/attempt.tool-call-", "argument-repair.ts"] },
  { x: 312, title: "POLICY", sub: "allow, deny, or ask", accent: true, src: ["agent-tools.before-tool-", "call.decision.ts"] },
  { x: 472, title: "EXECUTE", sub: "your code runs it", accent: false, src: ["process/", "exec-runner.ts"] },
  { x: 616, title: "CONTEXT", sub: "result goes back", accent: false, src: ["context-engine/", "bounded-context.ts"] },
];

const HarnessToolCall = () => {
  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 760 350"
      role="img"
      aria-label="One tool call, end to end. The model proposes a call. A parser turns the generated text into a structured tool call, repairing the JSON when the model gets it wrong. A policy stage decides whether the call is allowed, denied, or needs a human approval. Your code executes it. The result is folded back into the context. The trust boundary sits between the policy stage and execution: every decision on that boundary is written to a receipt before the tool runs."
    >
      <defs>
        <marker id="ht-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="currentColor" />
        </marker>
        <marker id="ht-arrow-accent" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={ACCENT} />
        </marker>
      </defs>

      <text x={24} y={26} fontSize={15} fontWeight={700} fill="currentColor">
        One tool call, end to end
      </text>

      {/* the trust boundary, drawn before the stages it separates */}
      <line x1={452} y1={52} x2={452} y2={200} stroke={ACCENT} strokeOpacity={0.6} strokeWidth={1.6} strokeDasharray="5 4" />
      <text x={452} y={46} fontSize={10} fontWeight={700} fill={ACCENT} textAnchor="middle" opacity={0.9}>
        TRUST BOUNDARY
      </text>

      {STAGES.map((stage, i) => {
        const cx = stage.x + 60;
        const next = STAGES[i + 1];
        const isPolicy = stage.accent;

        return (
          <g key={stage.title}>
            <rect
              x={stage.x}
              y={72}
              width={120}
              height={62}
              rx={10}
              fill={isPolicy ? ACCENT : "currentColor"}
              fillOpacity={isPolicy ? 0.07 : 0.03}
              stroke={isPolicy ? ACCENT : "currentColor"}
              strokeOpacity={isPolicy ? 0.7 : 0.3}
              strokeWidth={isPolicy ? 1.8 : 1.4}
            />
            <text
              x={cx}
              y={95}
              fontSize={12}
              fontWeight={700}
              fill={isPolicy ? ACCENT : "currentColor"}
              textAnchor="middle"
            >
              {stage.title}
            </text>
            <text x={cx} y={114} fontSize={9.5} fill="currentColor" opacity={0.62} textAnchor="middle">
              {stage.sub}
            </text>

            {/* the file that implements it */}
            <text x={cx} y={152} fontSize={8.5} fill="currentColor" opacity={0.45} textAnchor="middle">
              {stage.src[0]}
            </text>
            <text x={cx} y={163} fontSize={8.5} fill="currentColor" opacity={0.45} textAnchor="middle">
              {stage.src[1]}
            </text>

            {next && (
              <line
                x1={stage.x + 120 + 3}
                y1={103}
                x2={next.x - 5}
                y2={103}
                stroke={isPolicy ? ACCENT : "currentColor"}
                strokeOpacity={isPolicy ? 0.6 : 0.4}
                strokeWidth={1.6}
                markerEnd={isPolicy ? "url(#ht-arrow-accent)" : "url(#ht-arrow)"}
              />
            )}
          </g>
        );
      })}

      {/* the receipt */}
      <rect
        x={24}
        y={210}
        width={712}
        height={88}
        rx={10}
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.22}
        strokeWidth={1.4}
      />
      <text x={44} y={236} fontSize={12.5} fontWeight={700} fill="currentColor">
        Every decision on that boundary leaves a receipt
      </text>
      <text x={44} y={258} fontSize={10.5} fill="currentColor" opacity={0.72}>
        receiptId · action · outcome · reasonCode · coverageState · policyRefs · grantRefs
      </text>
      <text x={44} y={278} fontSize={10.5} fill={ACCENT} opacity={0.9}>
        decisionBoundary: agent-tool.before-execute, written before the tool runs
      </text>

      {/* Caption */}
      <text x={380} y={326} fontSize={12.5} fill="currentColor" opacity={0.75} textAnchor="middle">
        The model proposes. Your code disposes. The receipt proves which.
      </text>
    </svg>
  );
};

export default HarnessToolCall;

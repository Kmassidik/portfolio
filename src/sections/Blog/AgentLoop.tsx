/**
 * The agent loop, honestly drawn.
 *   A task enters the harness; the model either calls one of your tools
 *   (muted box, right) and the result is pasted back into its context, or
 *   it answers without a tool call (accent, bottom left) and the loop ends.
 *   Guardrails label the harness wall. Inline SVG so it follows the site
 *   theme (currentColor); brand accent is the site's terracotta.
 */
const ACCENT = "#c15f3c";

const AgentLoop = () => {
  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 760 420"
      role="img"
      aria-label="The agent loop. A task enters your harness, the model either calls one of your tools and the result is pasted back into its context, or it answers without a tool call and the loop ends. Guardrails wrap the loop: a step cap, a tool allowlist, human approval for side effects, and a log of every step."
    >
      <defs>
        <marker id="al-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="currentColor" />
        </marker>
        <marker id="al-arrow-accent" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={ACCENT} />
        </marker>
      </defs>

      <text x={24} y={26} fontSize={15} fontWeight={700} fill="currentColor">
        An agent is a loop, not a smarter model
      </text>

      {/* task, outside the harness */}
      <g>
        <rect x={48} y={48} width={140} height={48} rx={8} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.4} />
        <text x={118} y={77} fontSize={13} fontWeight={600} fill="currentColor" textAnchor="middle">your task</text>
      </g>
      <line x1={118} y1={96} x2={118} y2={125} stroke="currentColor" strokeOpacity={0.4} strokeWidth={1.5} markerEnd="url(#al-arrow)" />

      {/* the harness wall */}
      <rect x={40} y={128} width={690} height={196} rx={10} fill="none" stroke="currentColor" strokeOpacity={0.3} strokeDasharray="5 5" />
      <text x={56} y={150} fontSize={11.5} fontWeight={600} fill="currentColor" opacity={0.5}>
        your code · the harness
      </text>

      {/* the model */}
      <g>
        <rect x={64} y={170} width={200} height={64} rx={8} fill={ACCENT} fillOpacity={0.08} stroke={ACCENT} strokeWidth={1.5} />
        <text x={164} y={196} fontSize={13.5} fontWeight={700} fill={ACCENT} textAnchor="middle">the model</text>
        <text x={164} y={215} fontSize={11} fill="currentColor" opacity={0.6} textAnchor="middle">call a tool, or answer?</text>
      </g>

      {/* your tool code */}
      <g>
        <rect x={470} y={170} width={220} height={64} rx={8} fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.4} />
        <text x={580} y={196} fontSize={13} fontWeight={700} fill="currentColor" textAnchor="middle">your tool code</text>
        <text x={580} y={215} fontSize={11} fill="currentColor" opacity={0.6} textAnchor="middle">fetch · write · query</text>
      </g>

      {/* model -> tool */}
      <line className="diagram-flow" x1={264} y1={202} x2={464} y2={202} stroke={ACCENT} strokeOpacity={0.55} strokeWidth={1.8} markerEnd="url(#al-arrow-accent)" />
      <text x={364} y={188} fontSize={11} fill={ACCENT} textAnchor="middle" opacity={0.8}>tool call (JSON)</text>

      {/* tool -> model, the result goes back */}
      <path
        d="M 580 234 L 580 272 L 164 272 L 164 240"
        fill="none"
        stroke="currentColor"
        strokeOpacity={0.4}
        strokeWidth={1.5}
        markerEnd="url(#al-arrow)"
      />
      <text x={372} y={290} fontSize={11} fill="currentColor" opacity={0.6} textAnchor="middle">
        the result is pasted back into the context
      </text>

      {/* exit: answer without a tool call */}
      <line className="diagram-flow" x1={100} y1={234} x2={100} y2={337} stroke={ACCENT} strokeOpacity={0.55} strokeWidth={1.8} markerEnd="url(#al-arrow-accent)" />
      <text x={112} y={306} fontSize={10.5} fill={ACCENT} opacity={0.8}>no tool call → answer</text>

      {/* guardrails, on the harness wall */}
      <text x={716} y={303} fontSize={10.5} fill="currentColor" opacity={0.55} textAnchor="end">
        guardrails: step cap · tool allowlist
      </text>
      <text x={716} y={317} fontSize={10.5} fill="currentColor" opacity={0.55} textAnchor="end">
        approval for side effects · step log
      </text>

      {/* final answer */}
      <g>
        <rect x={40} y={340} width={200} height={48} rx={8} fill={ACCENT} fillOpacity={0.08} stroke={ACCENT} strokeWidth={1.5} />
        <text x={140} y={369} fontSize={13} fontWeight={700} fill={ACCENT} textAnchor="middle">final answer</text>
      </g>

      {/* Caption */}
      <text x={380} y={412} fontSize={13} fill="currentColor" opacity={0.75} textAnchor="middle">
        The model proposes, the harness executes. The loop ends the first time the model answers without calling a tool.
      </text>
    </svg>
  );
};

export default AgentLoop;

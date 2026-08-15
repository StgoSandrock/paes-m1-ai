import type { PublicQuestion } from "@/lib/types";

export function VisualResource({ question }: { question: PublicQuestion }) {
  const data = question.visualData;
  if (!data) return null;
  if (data.labels && data.values) {
    const max = Math.max(...data.values);
    return <figure className="question-visual"><div className="bars">{data.values.map((value, index) => <div key={data.labels?.[index]} className="bar-item"><span style={{ height: `${Math.max(18, value / max * 120)}px` }} /><b>{value}</b><small>{data.labels?.[index]}</small></div>)}</div><figcaption>{data.caption}</figcaption></figure>;
  }
  if (data.points) return <figure className="question-visual"><svg viewBox="0 0 260 180" role="img" aria-label={data.caption}><path d="M20 90H240M130 10V170" className="axis-line"/>{data.points.map(([x, y], index) => <g key={`${x}-${y}`} transform={`translate(${130 + x * 10} ${90 - y * 10})`}><circle r="5" className={index ? "point accent" : "point"}/><text x="8" y="-7">{index ? "P'" : "P"}</text></g>)}</svg><figcaption>{data.caption}</figcaption></figure>;
  if (data.values?.length === 2) return <figure className="question-visual"><svg viewBox="0 0 260 150" role="img" aria-label={data.caption}><path d="M35 125L220 125L80 25Z" className="shape"/><path d="M80 25V125" className="guide"/><text x="110" y="145">{data.values[0]} cm</text><text x="84" y="77">{data.values[1]} cm</text></svg><figcaption>{data.caption}</figcaption></figure>;
  return <figure className="question-visual data-strip">{data.values?.map((value) => <span key={value}>{value}</span>)}<figcaption>{data.caption}</figcaption></figure>;
}

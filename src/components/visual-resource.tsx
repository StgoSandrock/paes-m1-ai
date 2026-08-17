import type { PublicQuestion } from "@/lib/types";

export function VisualResource({ question }: { question: PublicQuestion }) {
  const data = question.visualData;
  if (!data) return null;
  if (question.resourceType === "TABLE" && data.labels && data.values) {
    return <figure className="question-visual table-visual"><table><thead><tr><th>Dato</th><th>Valor</th></tr></thead><tbody>{data.values.map((value,index)=><tr key={`${data.labels?.[index]}-${index}`}><th>{data.labels?.[index]}</th><td>{value}</td></tr>)}</tbody></table><figcaption>{data.caption}</figcaption></figure>;
  }
  if (question.resourceType === "BAR_CHART" && data.labels && data.values) {
    const max = Math.max(...data.values.map(Math.abs),1);
    return <figure className="question-visual"><div className="bars">{data.values.map((value, index) => <div key={`${data.labels?.[index]}-${index}`} className="bar-item"><span style={{ height: `${Math.max(18, Math.abs(value) / max * 120)}px` }} /><b>{value}</b><small>{data.labels?.[index]}</small></div>)}</div><figcaption>{data.caption}</figcaption></figure>;
  }
  if (question.resourceType === "LINE_CHART" && data.labels && data.values) {
    const min=Math.min(...data.values);const max=Math.max(...data.values);const range=Math.max(1,max-min);const points=data.values.map((value,index)=>`${30+index*(200/Math.max(1,data.values!.length-1))},${140-(value-min)/range*105}`).join(" ");
    return <figure className="question-visual"><svg viewBox="0 0 260 180" role="img" aria-label={data.caption}><path d="M25 145H240M25 20V145" className="axis-line"/><polyline points={points} className="chart-line"/>{data.values.map((value,index)=>{const x=30+index*(200/Math.max(1,data.values!.length-1));const y=140-(value-min)/range*105;return <g key={`${value}-${index}`}><circle cx={x} cy={y} r="4" className="point accent"/><text x={x} y="165" textAnchor="middle">{data.labels?.[index]}</text></g>})}</svg><figcaption>{data.caption}</figcaption></figure>;
  }
  if (question.resourceType === "BOX_PLOT" && data.boxPlots) {
    const all=data.boxPlots.flatMap(item=>item.values);const min=Math.min(...all);const max=Math.max(...all);const scale=(value:number)=>30+(value-min)/Math.max(1,max-min)*200;
    return <figure className="question-visual"><svg viewBox="0 0 270 90" role="img" aria-label={data.caption}>{data.boxPlots.map((item,index)=>{const [low,q1,median,q3,high]=item.values;const y=25+index*38;return <g key={item.label}><text x="4" y={y+5}>{item.label}</text><path d={`M${scale(low)} ${y}H${scale(high)}M${scale(low)} ${y-7}V${y+7}M${scale(high)} ${y-7}V${y+7}`} className="axis-line"/><rect x={scale(q1)} y={y-11} width={scale(q3)-scale(q1)} height="22" className="box-shape"/><path d={`M${scale(median)} ${y-11}V${y+11}`} className="median-line"/></g>})}</svg><figcaption>{data.caption}</figcaption></figure>;
  }
  if (data.points) {const limit=Math.max(6,...data.points.flat().map(value=>Math.abs(value)));const project=([x,y]:[number,number])=>[130+x*(105/limit),90-y*(70/limit)];return <figure className="question-visual"><svg viewBox="0 0 260 180" role="img" aria-label={data.caption}><path d="M20 90H240M130 10V170" className="axis-line"/>{data.points.map((point,index)=>{const [x,y]=project(point);return <g key={`${point[0]}-${point[1]}-${index}`} transform={`translate(${x} ${y})`}><circle r="5" className={index ? "point accent" : "point"}/><text x="8" y="-7">{index ? "P'" : "P"}</text></g>})}</svg><figcaption>{data.caption}</figcaption></figure>}
  if (question.resourceType === "GEOMETRIC_FIGURE" && data.values?.length === 2) return <figure className="question-visual"><svg viewBox="0 0 260 150" role="img" aria-label={data.caption}><path d="M35 125L220 125L80 25Z" className="shape"/><path d="M80 25V125" className="guide"/><text x="110" y="145">{data.values[0]} cm</text><text x="84" y="77">{data.values[1]} cm</text></svg><figcaption>{data.caption}</figcaption></figure>;
  if (question.resourceType === "GEOMETRIC_FIGURE" && data.values?.length === 1) return <figure className="question-visual"><svg viewBox="0 0 260 150" role="img" aria-label={data.caption}><path d="M70 48L155 28L205 66L120 88ZM70 48V108L120 135V88M120 135L205 112V66" className="shape"/><text x="128" y="128">{data.values[0]} cm</text></svg><figcaption>{data.caption}</figcaption></figure>;
  return <figure className="question-visual data-strip">{data.values?.map((value) => <span key={value}>{value}</span>)}<figcaption>{data.caption}</figcaption></figure>;
}

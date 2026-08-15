import { describe, expect, it } from "vitest";
import { generateExamBlueprint } from "./blueprint";
import { buildQuestionBank } from "./questions";
import { selectUnseenQuestions } from "./selection";
describe("antirrepetición",()=>{it("excluye preguntas expuestas",()=>{const bank=buildQuestionBank();const exposed=new Set(bank.slice(0,10).map(item=>item.id));const selected=selectUnseenQuestions(bank,exposed,generateExamBlueprint());expect(selected.every(item=>!exposed.has(item.id))).toBe(true);expect(new Set(selected.map(item=>item.id)).size).toBe(selected.length)})});

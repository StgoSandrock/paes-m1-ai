import { describe, expect, it } from "vitest";
import { buildQuestionBank } from "./questions";
import { sanitizeQuestion } from "./scoring";
import { validateQuestion } from "./validation";
describe("banco",()=>{it("genera y valida 65 preguntas",()=>{const bank=buildQuestionBank();expect(bank).toHaveLength(65);const invalid=bank.filter(item=>!validateQuestion(item).valid).map(item=>({id:item.id,options:item.options,errors:validateQuestion(item).errors}));expect(invalid).toEqual([])});it("no filtra respuestas al cliente",()=>{const item=sanitizeQuestion(buildQuestionBank()[0]);expect("correctAnswer" in item).toBe(false);expect("solution" in item).toBe(false)})});

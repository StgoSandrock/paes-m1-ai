import { describe, expect, it } from "vitest";
import { buildQuestionBank } from "./questions";
import { scoreExam } from "./scoring";
describe("corrección",()=>{it("distingue correctas, incorrectas y omitidas",()=>{const bank=buildQuestionBank().slice(0,65);const result=scoreExam(bank,{[bank[0].id]:bank[0].correctAnswer,[bank[1].id]:bank[1].correctAnswer==="A"?"B":"A"});expect(result.correct).toBe(1);expect(result.incorrect).toBe(1);expect(result.unanswered).toBe(63)})});

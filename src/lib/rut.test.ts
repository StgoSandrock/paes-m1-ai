import { describe, expect, it } from "vitest";
import { formatRut, isValidRut, normalizeRut } from "./rut";
describe("RUT",()=>{it("normaliza y valida dígito verificador",()=>{expect(normalizeRut("12.345.678-5")).toBe("123456785");expect(isValidRut("12.345.678-5")).toBe(true);expect(isValidRut("12.345.678-4")).toBe(false)});it("formatea sin usarlo como identificador",()=>expect(formatRut("123456785")).toBe("12.345.678-5"))});

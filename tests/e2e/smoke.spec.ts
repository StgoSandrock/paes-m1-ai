import { expect, test } from "@playwright/test";

test("landing, acceso y panel",async({page})=>{
  const errors:string[]=[];page.on("pageerror",error=>errors.push(error.message));
  await page.goto("/");await expect(page.getByRole("heading",{name:/Practica con/})).toBeVisible();
  await page.screenshot({path:"work/qa/landing-desktop.png",fullPage:true});
  await page.getByRole("link",{name:/Ingresar/}).click();await page.getByLabel("Gmail").fill("estudiante@gmail.com");await page.getByLabel("Contraseña").fill("segura123");await page.getByRole("button",{name:"Ingresar"}).click();await expect(page.getByRole("heading",{name:/Hola, Santiago/})).toBeVisible();
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:"work/qa/dashboard-mobile.png",fullPage:true});expect(errors).toEqual([]);
});

test("generar, responder, entregar, revisar y descargar",async({page})=>{
  await page.goto("/exams/generating");await page.waitForURL(/\/exams\/[0-9a-f-]{36}$/,{timeout:15000});
  await expect(page.getByText("Pregunta 1 de 65")).toBeVisible();await page.locator(".answer-list label").first().click();
  await page.locator(".nav-grid button").nth(64).click();page.once("dialog",dialog=>dialog.accept());await page.getByRole("button",{name:/Entregar ensayo/}).click();
  await page.waitForURL(/\/results$/);await expect(page.getByText(/respuestas correctas de 65/)).toBeVisible();
  const downloadPromise=page.waitForEvent("download");await page.getByRole("button",{name:/Descargar PDF/}).click();const download=await downloadPromise;expect(download.suggestedFilename()).toMatch(/^Ensayo-M1-Corregido-/);
  await page.getByRole("link",{name:/Ver corrección/}).click();await expect(page.getByRole("heading",{name:/Revisa cada decisión/})).toBeVisible();await expect(page.locator(".review-card")).toHaveCount(65);
});

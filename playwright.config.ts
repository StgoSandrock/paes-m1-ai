import { defineConfig } from "@playwright/test";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
export default defineConfig({testDir:"./tests/e2e",use:{baseURL:"http://localhost:3000",launchOptions:executablePath?{executablePath}:undefined},webServer:{command:"npm run dev",url:"http://localhost:3000",reuseExistingServer:true}});

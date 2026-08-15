import { AppShell } from "@/components/app-shell";
import { ResultsClient } from "@/components/results-client";
export default async function ReviewPage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <AppShell><ResultsClient id={id} review/></AppShell>}

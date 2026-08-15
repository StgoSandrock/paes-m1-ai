import { ExamClient } from "@/components/exam-client";
export default async function ExamPage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <ExamClient id={id}/>}

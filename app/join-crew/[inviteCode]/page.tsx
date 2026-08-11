import { JoinCrewPage } from "@/views/JoinCrewPage";

interface JoinCrewRouteProps {
  params: Promise<{
    inviteCode: string;
  }>;
}

export default async function JoinCrewRoute({ params }: JoinCrewRouteProps) {
  const { inviteCode } = await params;
  return <JoinCrewPage inviteCode={inviteCode} />;
}

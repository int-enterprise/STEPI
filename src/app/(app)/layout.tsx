import { AppShell } from "@/components/app/AppShell";
import { CandidateProvider } from "@/store/candidate-store";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CandidateProvider>
      <AppShell>{children}</AppShell>
    </CandidateProvider>
  );
}


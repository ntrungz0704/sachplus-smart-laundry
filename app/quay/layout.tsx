import { OpsShell } from "@/components/sachplus/ops-shell";

export default function QuayLayout({ children }: { children: React.ReactNode }) {
  return <OpsShell role="staff">{children}</OpsShell>;
}

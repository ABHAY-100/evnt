import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
}

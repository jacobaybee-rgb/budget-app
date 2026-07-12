import type { ReactNode } from "react";

type PageSplitLayoutProps = {
  left: ReactNode;
  right: ReactNode;
};

export default function PageSplitLayout({
  left,
  right,
}: PageSplitLayoutProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
      {left}
      {right}
    </div>
  );
}
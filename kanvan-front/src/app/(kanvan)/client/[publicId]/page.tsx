// src/app/(kanvan)/client/[publicId]/page.tsx
import React from "react";
import DocumentClient from "@/components/project-component/DocumentClient";

export default function DocumentClientPage({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const resolvedParams = React.use(params);
  const publicId = resolvedParams.publicId;

  return (
    <div>
      <DocumentClient publicId={publicId} />
    </div>
  );
}

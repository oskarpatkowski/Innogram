'use client';

import { useRouter } from "next/router";

export default function ChatId() {
  const router = useRouter();

  return (
    <div>
      <h1>Chat Id: {router.query.id}</h1>
    </div>
  );
}

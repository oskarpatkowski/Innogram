'use client';

import { useRouter } from "next/router";

export default function EditPost() {
  const router = useRouter();
  return (
    <div>
      <h1>Edit Post: {router.query.id}</h1>
    </div>
  );
}

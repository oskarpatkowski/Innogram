import { useRouter } from "next/router";

export default function ProfilePage() {
  const router = useRouter();
  return (
    <div>
      <h1>Profile: {router.query.username}</h1>
    </div>
  );
}

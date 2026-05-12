import { useRouter } from "next/router";

export default function GroupSettings() {
  const router = useRouter();
  return (
    <div>
      <h1>Group Settings: {router.query.id}</h1>
    </div>
  );
}

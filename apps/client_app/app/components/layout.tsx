import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-row">
      <nav className="flex flex-col flex-1 items-start m-2 p-4 border-r border-gray-200">
        <h1 className="text-3xl font-bold mb-8 self-center">Innogram</h1>

        <Link
          href={"/feed"}
          className="flex items-center gap-3 mb-2 w-full px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <span className="material-symbols-outlined">home</span>
          <span className="text-lg">Home</span>
        </Link>
        <Link
          href={"/feed"}
          className="flex items-center gap-3 mb-2 w-full px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <span className="material-symbols-outlined">search</span>
          <span className="text-lg">Search</span>
        </Link>
        <Link
          href={"app/posts/create"}
          className="flex items-center gap-3 mb-2 w-full px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <span className="material-symbols-outlined">add_box</span>
          <span className="text-lg">Create</span>
        </Link>
        <Link
          href={"/feed"}
          className="flex items-center gap-3 mb-2 w-full px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="text-lg">Notifications</span>
        </Link>
        <Link
          href={"/app/profile/me"}
          className="flex items-center gap-3 mb-2 w-full px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <span className="material-symbols-outlined">person</span>
          <span className="text-lg">Account</span>
        </Link>
        <Link
          href={"/app/chat/"}
          className="flex items-center gap-3 mb-2 w-full px-4 py-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <span className="material-symbols-outlined">chat</span>
          <span className="text-lg">Chat</span>
        </Link>
      </nav>
      <main className="flex-3 items-center">{children}</main>
    </section>
  );
}

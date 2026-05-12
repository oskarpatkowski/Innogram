export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <nav>Nav</nav>
      <main>{children}</main>
    </section>
  );
}

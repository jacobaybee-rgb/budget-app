export default function BillsHeader() {
  return (
    <section className="rounded-2xl bg-zinc-950/80 px-8 py-8 shadow-xl">
      <p className="text-sm uppercase tracking-widest text-red-400">
        Bills
      </p>

      <h1 className="mt-2 text-4xl font-bold text-white">
        Monthly Bills
      </h1>

      <p className="mt-2 text-zinc-400">
        Track what bills are due, how much they cost, and whether they have
        been paid.
      </p>
    </section>
  );
}
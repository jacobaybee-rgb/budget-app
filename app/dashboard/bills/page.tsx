import BillsHeader from "@/components/bills/BillsHeader";
import BillsStats from "@/components/bills/BillsStats";
import AddBillForm from "@/components/bills/AddBillForm";
import BillsList from "@/components/bills/BillsList";

export default function BillsPage() {

  return (
    <>
      <div className="space-y-8">
        <BillsHeader />

        <BillsStats />

        <section className="px-8 p-6 grid gap-8 lg:grid-cols-[0.9fr_1.3fr]">
          <AddBillForm />
          <BillsList />
        </section>
      </div>
    </>
  );
}
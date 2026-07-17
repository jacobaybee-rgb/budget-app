import BillsHeader from "@/components/bills/BillsHeader";
import BillsStats from "@/components/bills/BillsStats";
import AddBillForm from "@/components/bills/AddBillForm";
import BillsList from "@/components/bills/BillsList";
import MonthSelector from "@/components/budget/MonthSelector";

export default function BillsPage() {

  return (
    <>
      <div className="space-y-10">
        <BillsHeader />

        <div className="flex justify-center">
          <MonthSelector />
        </div>

        <BillsStats />

        <section className="px-8 p-6 grid gap-8 lg:grid-cols-[0.9fr_1.3fr]">
          <AddBillForm />
          <BillsList />
        </section>
      </div>
    </>
  );
}
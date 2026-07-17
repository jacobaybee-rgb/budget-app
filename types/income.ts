export type IncomeSource = {
  id: string;
  source: string;
  amount: number;
  date: string;
  incomeTemplateId?: string;
};

export type IncomeTemplate = {
  id: string;
  source: string;
  amount: number;
  frequency: "monthly";
  recurringDay: number;
  startMonth: string;
  isActive: boolean;
};
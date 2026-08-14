export interface ExpenseDraft {
  id: string;
  title: string;
  desc: string;
  spenderId: number;
  selectedUserIds: number[];
  mode: "AUTO" | "MANUAL";
  totalAmount: string;
  manualShares: Record<number, string>;
}

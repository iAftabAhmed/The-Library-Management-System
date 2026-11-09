export type Settings = {
  loanDays: number;
  graceDays: number;
  finePerDay: number;
  maxFine: number;
  currency: string;
};

export type LoanRow = {
  id: number;
  copyId: string;
  memberId: string;
  memberName: string;
  titleId: number;
  title: string;
  author: string;
  category: string;
  shelf: string;
  issuedOn: string;
  dueOn: string;
  returnedOn: string | null;
  isOpen: boolean;
  isOverdue: boolean;
  daysPastDue: number;
  chargeableDays: number;
  fine: number;
  paid: number;
  balance: number;
};

export type CatalogRow = {
  id: number;
  title: string;
  author: string;
  category: string;
  isbn: string | null;
  year: number | null;
  copies: number;
  available: number;
  issued: number;
};

export type CopyRow = {
  id: string;
  shelf: string;
  status: "available" | "issued";
  loanId: number | null;
  memberId: string | null;
  memberName: string | null;
  dueOn: string | null;
  isOverdue: boolean;
};

export type HoldRow = {
  id: number;
  status: string;
  placedOn: string;
  titleId: number;
  title: string;
  author: string;
  memberId: string;
  memberName: string;
  available: number;
};

export type Suggestion = {
  id: number;
  title: string;
  author: string;
  category: string;
  reason: string;
};

export type MemberRow = {
  id: string;
  name: string;
  joinedOn: string;
  openLoans: number;
  overdueLoans: number;
};

export type Summary = {
  titles: number;
  totalCopies: number;
  availableCopies: number;
  issuedCopies: number;
  overdueCopies: number;
  members: number;
  outstandingFines: number;
  settings: Settings;
  recent: LoanRow[];
  byCategory: { category: string; loans: number }[];
};

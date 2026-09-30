export type AdminAction = "user.update" | "user.delete" | "ticket.update" | "ticket.delete";

export type AdminLogKind = "update" | "delete";

export interface FieldChange {
  field: string;
  before: string | null;
  after: string | null;
}

export interface AdminLog {
  id: string;
  adminEmail: string;
  action: AdminAction;
  targetUserId: string | null;
  targetEmail: string;
  targetExists: boolean;
  changes: FieldChange[];
  createdAt: string;
}

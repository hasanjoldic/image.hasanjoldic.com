export type OmitDefaultDBColumns<T> = Omit<T, "id" | "createdAt" | "updatedAt">;

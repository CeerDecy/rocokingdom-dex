export const getClientMessage = (
  messages: Record<string, unknown> | null | undefined,
  key: string,
  fallback: string,
) => {
  const value = key
    .split(".")
    .reduce<unknown>(
      (acc, part) =>
        acc && typeof acc === "object"
          ? (acc as Record<string, unknown>)[part]
          : undefined,
      messages ?? undefined,
    );
  return typeof value === "string" ? value : fallback;
};

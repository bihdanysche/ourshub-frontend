export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (crewId: number) => [...postKeys.lists(), crewId] as const,
};

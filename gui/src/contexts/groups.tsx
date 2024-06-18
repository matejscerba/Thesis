import React, { createContext, useContext } from "react";

interface GroupsContextInterface {
  candidates: number[];
  discarded: number[];
}

const GroupsContext = createContext<GroupsContextInterface>({
  candidates: undefined,
  discarded: undefined,
});

interface GroupsContextProviderProps extends GroupsContextInterface {
  children: React.ReactNode;
}

export function GroupsContextProvider({ candidates, discarded, children }: GroupsContextProviderProps) {
  return (
    <GroupsContext.Provider
      value={{
        candidates,
        discarded,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
}

export const useGroups = () => useContext(GroupsContext);

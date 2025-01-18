import { atom, useAtom } from "jotai";

const modalState = atom(false);

export const useCreateEventModalStore = () => {
  return useAtom(modalState);
};

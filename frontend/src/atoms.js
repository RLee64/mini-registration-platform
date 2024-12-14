import { atom } from "jotai";

export const accessTokenAtom = atom(
  sessionStorage.getItem("accessToken") || null
);

export const accessLevelAtom = atom(
  sessionStorage.getItem("accessLevel") || null
);

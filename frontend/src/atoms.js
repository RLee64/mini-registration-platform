import { atom } from "jotai";

export const accessTokenAtom = atom(
  JSON.parse(sessionStorage.getItem("accessToken")) || null
);

export const accessLevelAtom = atom(
  JSON.parse(sessionStorage.getItem("accessLevel")) || null
);

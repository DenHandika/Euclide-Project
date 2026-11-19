"use client";

import { useReducer } from "react";
import { initialSearchState, searchReducer } from "@/lib/searchState";

export default function useSubmittedSearch() {
  const [state, dispatch] = useReducer(searchReducer, initialSearchState);
  return {
    ...state,
    setDraft: (value: string) => dispatch({ type: "edit", value }),
    submit: () => dispatch({ type: "submit" }),
    clear: () => dispatch({ type: "clear" }),
  };
}

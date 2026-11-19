export interface SearchState {
  draft: string;
  query: string;
  revision: number;
}

export type SearchAction =
  | { type: "edit"; value: string }
  | { type: "submit" }
  | { type: "clear" };

export const initialSearchState: SearchState = {
  draft: "",
  query: "",
  revision: 0,
};

export function searchReducer(
  state: SearchState,
  action: SearchAction,
): SearchState {
  switch (action.type) {
    case "edit":
      return { ...state, draft: action.value };
    case "submit":
      return {
        ...state,
        query: state.draft.trim(),
        revision: state.revision + 1,
      };
    case "clear":
      return { draft: "", query: "", revision: state.revision + 1 };
  }
}

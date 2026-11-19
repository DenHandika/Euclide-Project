import { test } from "node:test";
import assert from "node:assert/strict";
import { initialSearchState, searchReducer } from "../src/lib/searchState";

test("typing and deleting draft text do not apply a search or reset pagination", () => {
  const editing = searchReducer(initialSearchState, {
    type: "edit",
    value: "literasi",
  });
  assert.equal(editing.query, "");
  assert.equal(editing.revision, 0);
  const applied = searchReducer(editing, { type: "submit" });
  const deleting = searchReducer(applied, { type: "edit", value: "" });
  assert.equal(deleting.query, "literasi");
  assert.equal(deleting.revision, applied.revision);
});

test("explicit submission applies the trimmed query and rerunning a search resets its page", () => {
  const editing = searchReducer(initialSearchState, {
    type: "edit",
    value: "  EUC-2026-0042  ",
  });
  const applied = searchReducer(editing, { type: "submit" });
  const rerun = searchReducer(applied, { type: "submit" });
  assert.equal(applied.query, "EUC-2026-0042");
  assert.equal(rerun.query, applied.query);
  assert.equal(rerun.revision, applied.revision + 1);
  assert.equal(initialSearchState.query, "");
});

test("submitting an empty field and explicit reset both clear the applied search", () => {
  const searching = {
    draft: "new draft",
    query: "previous search",
    revision: 4,
  };
  const cleared = searchReducer(searching, { type: "clear" });
  assert.deepEqual(cleared, { draft: "", query: "", revision: 5 });
  const blankDraft = searchReducer(searching, { type: "edit", value: "   " });
  assert.equal(searchReducer(blankDraft, { type: "submit" }).query, "");
  assert.equal(searching.query, "previous search");
});

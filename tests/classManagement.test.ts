import test from "node:test";
import assert from "node:assert/strict";
import {
  formatMeetings,
  readMeetings,
  validateClass,
  type ClassInput,
} from "../src/lib/classManagement";
import { MOCK_CLASS_BATCHES } from "../src/data/mockData";

const input = (): ClassInput => ({
  name: "Kelas sore",
  program: "Reguler Weekend",
  room: "Ruang B",
  tutorName: "Pengajar B",
  maxCapacity: 30,
  status: "upcoming",
  schedule: "",
  meetings: [{ day: 1, start: "16:00", end: "17:00" }],
});

test("legacy weekly schedules remain editable without changing the source", () => {
  assert.deepEqual(
    readMeetings(MOCK_CLASS_BATCHES[0])
      .map((meeting) => meeting.day)
      .sort(),
    [1, 3, 5],
  );
  assert.equal(readMeetings(MOCK_CLASS_BATCHES[3]).length, 7);
  assert.equal(
    readMeetings(MOCK_CLASS_BATCHES[0])[0].room,
    MOCK_CLASS_BATCHES[0].room,
  );
  assert.equal(
    readMeetings(MOCK_CLASS_BATCHES[0])[0].tutorName,
    MOCK_CLASS_BATCHES[0].tutorName,
  );
  assert.equal(readMeetings({ schedule: "Akan diumumkan" }).length, 0);
  const meetings = [
    { day: 5, start: "16:00", end: "17:00" },
    { day: 1, start: "10:00", end: "11:00" },
  ];
  assert.equal(
    formatMeetings(meetings),
    "Senin 10:00–11:00 WIB; Jumat 16:00–17:00 WIB",
  );
  assert.equal(meetings[0].day, 5);
});

test("multiple sessions on one day retain their own rooms and tutors", () => {
  const draft = {
    ...input(),
    room: "",
    tutorName: "",
    meetings: [
      {
        day: 1,
        start: "16:00",
        end: "17:00",
        room: "Ruang 1",
        tutorName: "Tentor A",
      },
      {
        day: 1,
        start: "17:00",
        end: "18:00",
        room: "Ruang 2",
        tutorName: "Tentor B",
      },
      {
        day: 3,
        start: "16:00",
        end: "17:00",
        room: "Ruang 3",
        tutorName: "Tentor C",
      },
    ],
  };
  assert.equal(validateClass(draft, []), null);
  assert.equal(readMeetings(draft)[1].room, "Ruang 2");
  assert.equal(readMeetings(draft)[1].tutorName, "Tentor B");
  const other = {
    ...input(),
    id: "other",
    name: "Kelas lain",
    currentStudents: 0,
    room: "Ruang 1; Ruang 2",
    tutorName: "Tentor A; Tentor B",
    meetings: draft.meetings,
  };
  assert.equal(
    validateClass(
      {
        ...input(),
        meetings: [
          {
            day: 1,
            start: "16:00",
            end: "17:00",
            room: "Ruang 2",
            tutorName: "Tentor B",
          },
        ],
      },
      [other],
    ),
    null,
  );
  assert.match(
    validateClass(
      {
        ...input(),
        meetings: [
          {
            day: 1,
            start: "17:00",
            end: "18:00",
            room: "Ruang lain",
            tutorName: "Tentor B",
          },
        ],
      },
      [other],
    )!,
    /tentor/,
  );
  assert.match(
    validateClass(
      {
        ...input(),
        meetings: [
          {
            day: 1,
            start: "17:00",
            end: "18:00",
            room: " ruang 2 ",
            tutorName: "Tentor lain",
          },
        ],
      },
      [other],
    )!,
    /ruang/,
  );
  assert.ok(
    validateClass(
      { ...draft, meetings: [{ ...draft.meetings[0], tutorName: "" }] },
      [],
    ),
  );
});

test("class validation rejects incomplete fields, invalid times and overlapping sessions", () => {
  assert.equal(validateClass(input(), []), null);
  assert.ok(validateClass({ ...input(), room: " " }, []));
  assert.ok(validateClass({ ...input(), meetings: [] }, []));
  assert.ok(
    validateClass(
      { ...input(), meetings: [{ day: 1, start: "17:00", end: "16:00" }] },
      [],
    ),
  );
  assert.ok(
    validateClass(
      { ...input(), meetings: [{ day: 1, start: "16:00", end: "24:00" }] },
      [],
    ),
  );
  assert.ok(
    validateClass(
      {
        ...input(),
        meetings: [
          ...input().meetings!,
          { day: 1, start: "16:30", end: "18:00" },
        ],
      },
      [],
    ),
  );
});

test("weekly conflicts check room and tutor while allowing adjacent sessions and self edits", () => {
  const occupied = { ...input(), id: "class-a", currentStudents: 12 };
  assert.match(
    validateClass({ ...input(), name: "Kelas lain" }, [occupied])!,
    /bentrok/,
  );
  assert.match(
    validateClass({ ...input(), name: "Kelas lain", room: "Ruang C" }, [
      occupied,
    ])!,
    /tentor/,
  );
  assert.equal(
    validateClass(
      {
        ...input(),
        name: "Kelas lain",
        meetings: [{ day: 1, start: "17:00", end: "18:00" }],
      },
      [occupied],
    ),
    null,
  );
  assert.equal(validateClass(input(), [occupied], occupied.id), null);
  assert.equal(
    validateClass({ ...input(), name: "Kelas lain" }, [
      { ...occupied, status: "completed" },
    ]),
    null,
  );
});

test("existing enrollment count constrains quota and duplicate names cannot create another class", () => {
  const occupied = { ...input(), id: "class-a", currentStudents: 12 };
  assert.ok(
    validateClass({ ...input(), maxCapacity: 11 }, [occupied], occupied.id),
  );
  assert.equal(
    validateClass({ ...input(), maxCapacity: 12 }, [occupied], occupied.id),
    null,
  );
  assert.ok(validateClass({ ...input(), name: " KELAS SORE " }, [occupied]));
  assert.ok(validateClass(input(), [], "missing"));
});

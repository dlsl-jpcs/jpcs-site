type MockRecord = Record<string, unknown> & { id?: number | string };

const records = {
  UpcomingEvents: [] as MockRecord[],
  GalleryMain: [] as MockRecord[],
  Gallery: [] as MockRecord[],
  EventsImages: [] as MockRecord[],
  ProjectsAndEvents: [] as MockRecord[],
  ContactForm: [] as MockRecord[],
};

function getCollection(name: keyof typeof records) {
  return records[name];
}

export function listRecords(
  name: keyof typeof records,
  sortBy?: string,
  ascending = true,
) {
  const collection = [...getCollection(name)];

  if (!sortBy) return collection;

  return collection.sort((first, second) => {
    const firstValue = String(first[sortBy] ?? "");
    const secondValue = String(second[sortBy] ?? "");
    return ascending
      ? firstValue.localeCompare(secondValue)
      : secondValue.localeCompare(firstValue);
  });
}

export function insertRecord(name: keyof typeof records, record: MockRecord) {
  const collection = getCollection(name);
  const nextId =
    collection.reduce((highest, item) => {
      const id = typeof item.id === "number" ? item.id : 0;
      return Math.max(highest, id);
    }, 0) + 1;
  const nextRecord = { ...record, id: record.id ?? nextId };
  collection.push(nextRecord);
  return nextRecord;
}

export function updateRecord(
  name: keyof typeof records,
  id: string | number,
  changes: MockRecord,
) {
  const collection = getCollection(name);
  const index = collection.findIndex((item) => String(item.id) === String(id));
  if (index === -1) return null;

  collection[index] = {
    ...collection[index],
    ...changes,
    id: collection[index].id,
  };
  return collection[index];
}

export function deleteRecord(name: keyof typeof records, id: string | number) {
  const collection = getCollection(name);
  const index = collection.findIndex((item) => String(item.id) === String(id));
  if (index === -1) return false;

  collection.splice(index, 1);
  return true;
}

export function addContact(record: MockRecord) {
  const nextRecord = {
    ...record,
    form_id: records.ContactForm.length + 1,
    is_read: false,
  };
  records.ContactForm.push(nextRecord);
  return nextRecord;
}

export function updateContact(id: string | number, isRead: boolean) {
  const record = records.ContactForm.find(
    (item) => String(item.form_id) === String(id),
  );
  if (!record) return null;

  record.is_read = isRead;
  return record;
}

export function deleteContact(id: string | number) {
  const index = records.ContactForm.findIndex(
    (item) => String(item.form_id) === String(id),
  );
  if (index === -1) return false;

  records.ContactForm.splice(index, 1);
  return true;
}

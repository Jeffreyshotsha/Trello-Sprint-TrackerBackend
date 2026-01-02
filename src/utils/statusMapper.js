// utils/statusMapper.js
const STATUS_MAP = {
  "TODO": "TO DO",
  "TO DO": "TO DO",
  "DOING": "DOING",
  "IN PROGRESS": "DOING",
  "DONE": "DONE",
  "NOT DONE": "NOT DONE",
  "BLOCKED": "NOT DONE"
};

export function mapLists(lists) {
  const map = {};
  for (const list of lists) {
    const normalized = list.name.trim().toUpperCase();
    if (STATUS_MAP[normalized]) {
      map[list.id] = STATUS_MAP[normalized];
    }
  }
  return map;
}

export default STATUS_MAP;
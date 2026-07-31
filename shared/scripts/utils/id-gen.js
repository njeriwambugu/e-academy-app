/* shared "next id" generation */

export function maxId(list) {
  return list.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
}

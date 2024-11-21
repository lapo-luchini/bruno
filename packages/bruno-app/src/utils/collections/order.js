import { isItemAFolder, isItemARequest } from 'utils/collections';

export const getSortedItems = (collection, item) => {
  if (!('items' in item)) {
    return { folderItems: [], requestItems: [] };
  }

  const items = item.items.toSorted((a, b) => {
    if ('seq' in a || 'seq' in b) {
      return +a.seq - +b.seq;
    }
    return a.name.localeCompare(b.name);
  });

  const requestItems = items.filter(i => isItemARequest(i));
  const folderItems = items.filter(i => isItemAFolder(i));

  return { folderItems, requestItems };
};

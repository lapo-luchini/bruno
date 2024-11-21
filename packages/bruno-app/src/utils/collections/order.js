import filter from 'lodash/filter';
import { isItemAFolder, isItemARequest } from 'utils/collections';

// we need to sort request items by seq property
const sortRequestItems = (items = []) => {
  return items.sort((a, b) => a.seq - b.seq);
};

// we need to sort folder items by name alphabetically
const sortFolderItems = (items = []) => {
  console.log('Coll item folder:', items);
  return items.sort((a, b) => a.name.localeCompare(b.name));
};

export const getSortedItems = (collection, item) => {
  const requestItems = sortRequestItems(filter(item.items, i => isItemARequest(i)));
  const folderItems = sortFolderItems(filter(item.items, i => isItemAFolder(i)));

  return { folderItems, requestItems };
};

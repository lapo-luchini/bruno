import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import { updateBrunoConfig } from 'providers/ReduxStore/slices/collections/actions';
import { useDispatch } from 'react-redux';
import { isItemAFolder, isItemARequest } from 'utils/collections';

function missingToLast(i) {
  return i == -1 ? Number.MAX_SAFE_INTEGER : i;
}

function objectSortByKey(obj) {
  return Object.fromEntries(Object.entries(obj).sort(([k1], [k2]) => k1.localeCompare(k2)));
}

export const getSortedItems = (collection, item) => {
  if (!('items' in item)) {
    return { folderItems: [], requestItems: [] };
  }

  const relName = item.pathname.slice(collection.pathname.length + 1);

  const items = item.items.toSorted((a, b) => {
    if ('seq' in a || 'seq' in b) {
      return +a.seq - +b.seq;
    }
    return a.name.localeCompare(b.name);
  });

  const requestItems = items.filter(isItemARequest);
  const folderItems = items.filter(isItemAFolder);

  if (isItemAFolder(item) && (!collection.brunoConfig.order || !collection.brunoConfig.order[relName])) {
    const dispatch = useDispatch();
    const brunoConfig = cloneDeep(collection.brunoConfig);
    if (!brunoConfig.order) {
      brunoConfig.order = {};
    }
    const baseLength = item.pathname.length + 1;
    const sortedElements = folderItems
      .map(i => i.pathname.slice(baseLength))
      .concat(requestItems.map(i => i.pathname.slice(baseLength)));
    brunoConfig.order[relName] = sortedElements;
    brunoConfig.order = objectSortByKey(brunoConfig.order);
    dispatch(updateBrunoConfig(brunoConfig, collection.uid));
    console.log('Updated config:', collection);
  }

  return { folderItems, requestItems };
};

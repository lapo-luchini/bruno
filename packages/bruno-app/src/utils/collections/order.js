import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import { updateBrunoConfig } from 'providers/ReduxStore/slices/collections/actions';
import { useDispatch } from 'react-redux';
import { isItemAFolder, isItemARequest } from 'utils/collections';

const arrayIdentical = (a, b) => a && b && a.every((v, i) => v === b[i]);

const objectSortByKey = obj => Object.fromEntries(Object.entries(obj).sort(([k1], [k2]) => k1.localeCompare(k2)));

export const getSortedItems = (collection, item) => {
  if (!('items' in item)) {
    return { folderItems: [], requestItems: [] };
  }

  const relName = item.pathname.slice(collection.pathname.length + 1);
  const baseLength = item.pathname.length + 1;
  const order = collection.brunoConfig?.order?.[relName];

  const sortedItems = item.items.toSorted((a, b) => {
    if (order) {
      let iA = order.indexOf(a.pathname.slice(baseLength));
      let iB = order.indexOf(b.pathname.slice(baseLength));
      //console.log('Compare:', a, b, iA, iB);
      if (iA != -1 && iB != -1) return iA - iB;
    }
    if ('seq' in a || 'seq' in b) {
      return +a.seq - +b.seq;
    }
    return a.name.localeCompare(b.name);
  });
  // console.log('Sorted:', item, items);

  const orderNew = sortedItems.map(i => i.pathname.slice(baseLength));

  if (!arrayIdentical(order, orderNew)) {
    console.log("Order changed:", order, orderNew);
    const dispatch = useDispatch();
    const brunoConfig = cloneDeep(collection.brunoConfig);
    if (!brunoConfig.order) {
      brunoConfig.order = {};
    }
    brunoConfig.order[relName] = orderNew;
    brunoConfig.order = objectSortByKey(brunoConfig.order);
    dispatch(updateBrunoConfig(brunoConfig, collection.uid));
  }

  const requestItems = sortedItems.filter(isItemARequest);
  const folderItems = sortedItems.filter(isItemAFolder);
  return { folderItems, requestItems };
};

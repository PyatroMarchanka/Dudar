// The dataset folder the admin chose: remembered between visits (browsers let a
// page keep a folder handle in IndexedDB), and read to count the takes in it.

const DB_NAME = 'dudahero-dataset';
const STORE = 'handles';
const KEY = 'folder';
const COUNTS_KEY = 'datasetTakeCounts';

const openDb = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

export const rememberFolder = async (handle: any) => {
  try {
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE, 'readwrite');
      transaction.objectStore(STORE).put(handle, KEY);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
    db.close();
  } catch (error) {
    // Private mode, or a browser that can't keep folder handles: it is asked for again next time
  }
};

export const recallFolder = async (): Promise<any> => {
  try {
    const db = await openDb();
    const handle = await new Promise<any>((resolve, reject) => {
      const request = db.transaction(STORE).objectStore(STORE).get(KEY);
      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(request.error);
    });
    db.close();
    return handle;
  } catch (error) {
    return null;
  }
};

// Whether the page may use the folder now. Asking needs a click.
export const folderPermission = async (handle: any, ask: boolean): Promise<boolean> => {
  try {
    const options = { mode: 'readwrite' };
    if ((await handle.queryPermission?.(options)) === 'granted') return true;
    return ask && (await handle.requestPermission?.(options)) === 'granted';
  } catch (error) {
    return false;
  }
};

export type TakeCounts = Record<string, number>;

// How many takes the folder holds for each song: every subfolder with a
// labels.json is one take of the song named in it
export const countTakesInFolder = async (folder: any): Promise<TakeCounts> => {
  const counts: TakeCounts = {};
  for await (const [, entry] of folder.entries()) {
    if (entry.kind !== 'directory') continue;
    try {
      const labels = await (await (await entry.getFileHandle('labels.json')).getFile()).text();
      const id = JSON.parse(labels)?.song?.id;
      if (typeof id === 'string' && id) counts[id] = (counts[id] ?? 0) + 1;
    } catch (error) {
      // Not a take
    }
  }
  return counts;
};

// For browsers that can't write to a folder: takes are only counted as they are downloaded
export const loadLocalCounts = (): TakeCounts => {
  try {
    const value = JSON.parse(localStorage.getItem(COUNTS_KEY) || '{}');
    return value && typeof value === 'object' ? value : {};
  } catch (error) {
    return {};
  }
};

export const saveLocalCounts = (counts: TakeCounts) => {
  try {
    localStorage.setItem(COUNTS_KEY, JSON.stringify(counts));
  } catch (error) {}
};

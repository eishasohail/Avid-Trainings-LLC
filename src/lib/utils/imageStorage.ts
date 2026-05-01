/**
 * Image storage utility using IndexedDB for persistence across browser sessions.
 * DB: avid-images, Store: images, Version: 1
 */

const DB_NAME = 'avid-images';
const STORE_NAME = 'images';
const DB_VERSION = 1;

const getDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('IndexedDB is not available on server side'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

/**
 * Saves a file blob to IndexedDB and returns a persistent key.
 */
export async function saveImage(file: File): Promise<string> {
  if (typeof window === 'undefined') return '';

  try {
    const db = await getDB();
    const key = `img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(file, key);

      request.onsuccess = () => resolve(key);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to save image to IndexedDB:', error);
    // Fallback to a temporary object URL if IndexedDB fails, 
    // although this won't persist, it prevents breaking the current session.
    return URL.createObjectURL(file);
  }
}

/**
 * Retrieves a blob from IndexedDB and returns a fresh object URL.
 */
export async function getImageUrl(key: string): Promise<string> {
  if (typeof window === 'undefined' || !key.startsWith('img-')) return key;

  try {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        const blob = request.result;
        if (blob instanceof Blob) {
          resolve(URL.createObjectURL(blob));
        } else {
          resolve('');
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to get image from IndexedDB:', error);
    return '';
  }
}

/**
 * Deletes an image from IndexedDB by key.
 */
export async function deleteImage(key: string): Promise<void> {
  if (typeof window === 'undefined' || !key.startsWith('img-')) return;

  try {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to delete image from IndexedDB:', error);
  }
}

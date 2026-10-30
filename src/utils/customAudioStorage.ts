// IndexedDB storage for Teacher's custom audio recordings

const DB_NAME = 'MisiZooPintar_AudioDB';
const STORE_NAME = 'custom_audio_recordings';
const DB_VERSION = 1;

export interface AudioSlotInfo {
  key: string;
  title: string;
  category: 'slaid' | 'haiwan';
  suggestedScript: string;
}

export const AUDIO_SLOTS: AudioSlotInfo[] = [
  {
    key: 'intro_narration',
    title: 'Slaid 1: Arahan Pengenalan Zoo',
    category: 'slaid',
    suggestedScript:
      'Selamat datang ke Misi Zoo Pintar! Mari kita mengembara di Zoo sambil belajar kemahiran Konsonan Vokal tambah Konsonan Vokal bersama haiwan-haiwan yang comel. Tekan butang Mula Pengembaraan untuk bermula.',
  },
  {
    key: 'kv_explanation',
    title: 'Slaid 2: Penerangan Kemahiran KV+KV',
    category: 'slaid',
    suggestedScript:
      'Kemahiran K V tambah K V. Huruf K ialah Konsonan, dan huruf V ialah Vokal. Contohnya, k, u bunyi ku. d, a bunyi da. ku tambah da jadi kuda!',
  },
  {
    key: 'manual_narration',
    title: 'Slaid 3: Manual Penggunaan Permainan',
    category: 'slaid',
    suggestedScript:
      'Manual penggunaan Misi Zoo Pintar. Pertama: Dengar sebutan suku kata. Kedua: Pilih suku kata yang betul. Ketiga: Kumpul tiga bintang dan markah. Keempat: Buka kunci Sijil Pencapaian anda!',
  },
  {
    key: 'map_narration',
    title: 'Slaid 4: Peta 5 Misi Zoo',
    category: 'slaid',
    suggestedScript:
      'Terdapat lima misi haiwan di Zoo Pintar: Kuda, Rusa, Kera, Babi, dan Nuri. Pilih satu misi untuk mula bermain!',
  },
  {
    key: 'kuda_speech',
    title: 'Misi 1: Sebutan Kuda (ku + da)',
    category: 'haiwan',
    suggestedScript: 'Kuda. Suku kata: k, u, ku... d, a, da... ku... da... kuda!',
  },
  {
    key: 'rusa_speech',
    title: 'Misi 2: Sebutan Rusa (ru + sa)',
    category: 'haiwan',
    suggestedScript: 'Rusa. Suku kata: r, u, ru... s, a, sa... ru... sa... rusa!',
  },
  {
    key: 'kera_speech',
    title: 'Misi 3: Sebutan Kera (ke + ra)',
    category: 'haiwan',
    suggestedScript: 'Kera. Suku kata: k, e, ke... r, a, ra... ke... ra... kera!',
  },
  {
    key: 'babi_speech',
    title: 'Misi 4: Sebutan Babi (ba + bi)',
    category: 'haiwan',
    suggestedScript: 'Babi. Suku kata: b, a, ba... b, i, bi... ba... bi... babi!',
  },
  {
    key: 'nuri_speech',
    title: 'Misi 5: Sebutan Nuri (nu + ri)',
    category: 'haiwan',
    suggestedScript: 'Nuri. Suku kata: n, u, nu... r, i, ri... nu... ri... nuri!',
  },
  {
    key: 'praise_speech',
    title: 'Slaid 11: Ucapan Tahniah & Sijil',
    category: 'slaid',
    suggestedScript:
      'Tahniah dan syabas! Anda telah berjaya menjadi Wira Zoo Pintar dan menguasai kemahiran K V tambah K V dengan cemerlang!',
  },
];

class CustomAudioStorage {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private memoryCache: Map<string, string> = new Map();

  constructor() {
    this.initDB();
  }

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB not supported'));
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  public async saveAudio(key: string, dataUrl: string): Promise<void> {
    this.memoryCache.set(key, dataUrl);

    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(dataUrl, key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      // Fallback in memory
    }
  }

  public async getAudio(key: string): Promise<string | null> {
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key) || null;
    }

    try {
      const db = await this.initDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => {
          const val = req.result as string | undefined;
          if (val) {
            this.memoryCache.set(key, val);
            resolve(val);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }

  public async deleteAudio(key: string): Promise<void> {
    this.memoryCache.delete(key);

    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch {
      // safe
    }
  }

  public async getAllAudioMap(): Promise<Record<string, string>> {
    try {
      const db = await this.initDB();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.openCursor();
        const results: Record<string, string> = {};

        req.onsuccess = () => {
          const cursor = req.result;
          if (cursor) {
            const k = cursor.key as string;
            const v = cursor.value as string;
            results[k] = v;
            this.memoryCache.set(k, v);
            cursor.continue();
          } else {
            resolve(results);
          }
        };
        req.onerror = () => resolve(Object.fromEntries(this.memoryCache.entries()));
      });
    } catch {
      return Object.fromEntries(this.memoryCache.entries());
    }
  }
}

export const customAudioStorage = new CustomAudioStorage();

import axios from 'axios';

// Konfigurasi axios instance
const api = axios.create({
  baseURL: 'https://api.quran.com/api/v4',
  timeout: 10000,
});

// Ambil semua surah
export async function getChapters(language = 'id') {
  try {
    const res = await api.get('/chapters', {
      params: { language },
    });
    return res.data.chapters;
  } catch (error) {
    console.error('Gagal mengambil data semua surah:', error);
    throw error;
  }
}

export async function getJuzs() {
  try {
    const res = await api.get('/juzs');
    const allJuzs = res.data.juzs || [];

    // Hapus duplikat berdasarkan nomor juz
    const seen = new Set();
    const filtered = allJuzs.filter(j => {
      if (seen.has(j.juz_number)) return false;
      seen.add(j.juz_number);
      return true;
    });

    return filtered;
  } catch (error) {
    console.error('Gagal mengambil data juz:', error);
    return [];
  }
}

// Ambil detail surah berdasarkan ID
export async function getChapterById(chapterId, language = 'id') {
  try {
    const res = await api.get(`/chapters/${chapterId}`, {
      params: { language },
    });
    return res.data.chapter;
  } catch (error) {
    console.error(`Gagal mengambil detail surah ${chapterId}:`, error);
    throw error;
  }
}

// Ambil ayat berdasarkan nomor surah
export async function getVersesByChapter(chapterNumber, language = 'id') {
  try {
    const res = await api.get(`/verses/by_chapter/${chapterNumber}`, {
      params: {
        language,
        translations: 33,
        words: false,
        fields: 'text_uthmani,transliteration,translation,footnotes'
      },
    });
    return res.data.verses || [];
  } catch (error) {
    console.error(`Gagal mengambil ayat dari surah ${chapterNumber}:`, error);
    return [];
  }
}

// Ambil ayat berdasarkan nomor juz
export async function getVersesByJuz(juzNumber, language = 'id') {
  try {
    const res = await api.get(`/verses/by_juz/${juzNumber}`, {
      params: {
        language,
        translations: 33,
        words: false,
        per_page: 300,
        fields: 'text_uthmani,transliteration,translation,footnotes'
      },
    });
    return res.data.verses || [];
  } catch (error) {
    console.error(`Gagal mengambil ayat dari juz ${juzNumber}:`, error);
    return [];
  }
}

// Ambil satu ayat random
export async function getRandomAyah(language = 'id') {
  try {
    const res = await api.get('/verses/random', {
      params: {
        language,
        translations: 33,
        words: true,
        word_fields: 'text_uthmani,transliteration',
      },
    });
    return res.data.verse;
  } catch (error) {
    console.error('Gagal mengambil ayat random:', error);
    throw error;
  }
}

// Ambil terjemahan tertentu berdasarkan ID
export async function getTranslationById(translationId, language = 'id') {
  try {
    const res = await api.get(`/quran/translations/${translationId}`, {
      params: { language },
    });
    return res.data.translation;
  } catch (error) {
    console.error(`Gagal mengambil terjemahan ID ${translationId}:`, error);
    throw error;
  }
}

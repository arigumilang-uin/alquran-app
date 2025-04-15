<template>
  <div>
    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4 sticky-top">
      <div class="container d-flex justify-content-between align-items-center">
        <router-link to="/" class="btn btn-outline-secondary me-3">
          <i class="bi bi-arrow-left"></i> Beranda
        </router-link>

        <a class="navbar-brand fw-bold text-brown" href="#">Al-Qur'an Digital</a>

        <!-- DROPDOWN SURAH -->
        <div class="ms-auto">
          <div class="dropdown">
            <button
              class="btn btn-outline-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ surahName || `Surah ${surahId}` }}
            </button>
            <ul class="dropdown-menu dropdown-menu-end overflow-y-auto" style="max-height: 300px;">
              <li v-for="chapter in allChapters" :key="chapter.id">
                <router-link class="dropdown-item" :to="`/surah/${chapter.id}`">
                  {{ chapter.name_simple }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <!-- JUDUL SURAH -->
    <div class="container text-center mb-4">
      <h2 class="fw-bold text-brown">Surah {{ surahName }} ({{ surahId }})</h2>
    </div>

    <!-- ISI AYAT -->
    <div class="container">
      <div v-if="loading" class="text-center text-muted my-5">
        <div class="spinner-border text-secondary" role="status"></div>
        <p class="mt-2">Memuat ayat...</p>
      </div>

      <div v-else>
        <div
          v-for="verse in verses"
          :key="verse.id"
          class="card mb-4 border-0 shadow-sm"
          style="background-color: #f8f1e4; border-radius: 1rem;"
        >
          <div class="card-body">
            <!-- Nomor Ayat -->
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge rounded-pill text-bg-secondary">
                Ayat {{ verse.verse_number }}
              </span>
            </div>

            <!-- Teks Arab -->
            <h4
              class="text-end fs-3 lh-lg"
              dir="rtl"
              style="font-family: 'Amiri', serif; color: #5c3d2e;"
            >
              {{ verse.text_uthmani }}
            </h4>

            <!-- Terjemahan -->
            <p
              v-if="verse.translations && verse.translations[0]"
              class="mt-3"
              style="color: #6c584c;"
            >
              {{ cleanTranslation(verse.translations[0].text) }}
            </p>

            <!-- Footnote -->
            <div
              v-if="verse.footnotes && verse.footnotes[0]"
              class="small mt-2"
              style="color: #856a5d;"
            >
              <strong>Catatan:</strong> {{ verse.footnotes[0].text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getVersesByChapter,
  getChapterById,
  getChapters
} from '@/services/quranAPI';

export default {
  props: {
    surahId: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      verses: [],
      surahName: '',
      allChapters: [],
      loading: true,
    };
  },

  methods: {
    async loadAyat() {
      try {
        this.loading = true;
        this.verses = await getVersesByChapter(this.surahId);
      } catch (err) {
        console.error('Gagal ambil ayat:', err);
      } finally {
        this.loading = false;
      }
    },

    async loadSurahName() {
      try {
        const data = await getChapterById(this.surahId);
        this.surahName = data.name_simple;
      } catch (err) {
        console.error('Gagal ambil nama surah:', err);
      }
    },

    async loadAllChapters() {
      try {
        const data = await getChapters();
        this.allChapters = data;
      } catch (err) {
        console.error('Gagal ambil daftar surah:', err);
      }
    },

    cleanTranslation(text) {
      return text.replace(/<sup[^>]*>.*?<\/sup>/g, '');
    },
  },

  mounted() {
    this.loadAyat();
    this.loadSurahName();
    this.loadAllChapters();
  },

  watch: {
    surahId() {
      this.loadAyat();
      this.loadSurahName();
    }
  }
};
</script>

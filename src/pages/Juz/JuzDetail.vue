<template>
  <div>
    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4 sticky-top">
      <div class="container d-flex justify-content-between align-items-center">
        <!-- Tombol Kembali -->
        <router-link to="/" class="btn btn-outline-secondary me-3">
          <i class="bi bi-arrow-left"></i> Beranda
        </router-link>

        <!-- Logo -->
        <a class="navbar-brand fw-bold text-brown" href="#">Al-Qur'an Digital</a>

        <!-- Dropdown Juz -->
        <div class="ms-auto">
          <div class="dropdown">
            <button
              class="btn btn-outline-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Juz {{ juzNumber }}
            </button>
            <ul class="dropdown-menu dropdown-menu-end overflow-y-auto" style="max-height: 300px;">
              <li v-for="n in 30" :key="n">
                <router-link class="dropdown-item" :to="`/juz/${n}`">
                  Juz {{ n }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

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
              {{ removeFootnotes(verse.translations[0].text) }}
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
import { getVersesByJuz } from '@/services/quranAPI';

export default {
  props: {
    juzNumber: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      verses: [],
      loading: true,
    };
  },
  watch: {
    juzNumber: {
      immediate: true,
      handler() {
        this.fetchVerses();
      },
    },
  },
  methods: {
    async fetchVerses() {
      try {
        this.loading = true;
        const data = await getVersesByJuz(this.juzNumber);
        this.verses = data;
      } catch (error) {
        console.error('Error fetching verses:', error);
      } finally {
        this.loading = false;
      }
    },
    removeFootnotes(text) {
      return text.replace(/<sup[^>]*>[^<]*<\/sup>/g, '');
    },
  },
};
</script>

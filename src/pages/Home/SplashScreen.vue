<template>
  <div
    class="vh-100 d-flex justify-content-center align-items-center text-white position-relative"
    :style="{ backgroundImage: 'url(' + backgroundImage + ')', backgroundSize: 'cover', backgroundPosition: 'center' }"
  >
    <!-- Overlay -->
    <div
      class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center animate__animated animate__fadeIn"
    >
      <!-- Konten -->
      <div
        class="bg-white bg-opacity-10 p-5 rounded-4 shadow w-100"
        style="backdrop-filter: blur(12px); max-width: 850px"
      >
        <!-- Judul -->
        <div class="text-center">
          <h1
            class="fw-bold display-1 animate__animated animate__fadeIn animate__delay-1s"
            style="font-family: 'Amiri', serif; text-shadow: 2px 2px 12px rgba(0,0,0,0.6);"
          >
            القرآن
          </h1>
          <h2 class="fw-medium fs-3 text-info animate__animated animate__fadeIn animate__delay-1.5s">
            Al-Qur'an
          </h2>
        </div>

        <!-- Input & Tombol -->
        <div class="mt-4 animate__animated animate__fadeInUp animate__delay-2s">
          <input
            v-model="searchQuery"
            @input="filterSurahs"
            type="text"
            placeholder="Cari nama surah..."
            class="form-control rounded-pill px-4 py-3"
          />
          <div class="d-flex justify-content-center gap-3 flex-wrap mt-3">
            <button @click="showAllSurahs" class="btn btn-outline-light rounded-pill px-4 fw-medium">
              Daftar Surah
            </button>
            <button @click="showAllJuz" class="btn btn-outline-light rounded-pill px-4 fw-medium">
              Daftar Juz
            </button>
          </div>
        </div>

        <!-- Hasil -->
        <transition name="fade">
          <div
            v-if="filteredSurahs.length || juzList.length"
            class="mt-4 animate__animated animate__fadeInUp animate__delay-2s overflow-auto pe-2"
            style="max-height: 350px;"
          >
            <ul class="list-group">
              <!-- Surah -->
              <li
                v-for="surah in filteredSurahs"
                :key="'surah-' + surah.id"
                @click="goToSurah(surah.id)"
                class="list-group-item text-white border-0 mb-2 rounded-3"
                style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(6px); cursor: pointer;"
              >
                <div class="d-flex justify-content-between w-100">
                  <span class="badge bg-light text-dark rounded-pill fs-6">
                    {{ surah.id }}
                  </span>
                  <span
                    class="fs-4"
                    style="font-family: 'Amiri', serif; text-shadow: 1px 1px 4px rgba(0,0,0,0.6);"
                  >
                    {{ surah.name_arabic }}
                  </span>
                </div>
                <div class="mt-2 small text-white-50 w-100">
                  <strong>{{ surah.name_simple }}</strong> - {{ surah.translated_name.name }} •
                  {{ surah.verses_count }} ayat
                </div>
              </li>

              <!-- Juz -->
              <li
                v-for="juz in juzList"
                :key="'juz-' + juz.juz_number"
                @click="goToJuz(juz.juz_number)"
                class="list-group-item text-white border-0 mb-2 rounded-3"
                style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(6px); cursor: pointer;"
              >
                <div>
                  <strong>Juz {{ juz.juz_number }}</strong>
                  <div class="small text-white-50 mt-1">
                    {{ getSurahsInJuz(juz).join(', ') }}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { getChapters, getJuzs } from '@/services/quranAPI.js';
import backgroundImage from '@/assets/back-ground.svg';

export default {
  data() {
    return {
      backgroundImage,
      searchQuery: '',
      allSurahs: [],
      filteredSurahs: [],
      allJuz: [],
      juzList: [],
    };
  },
  methods: {
    async fetchSurahs() {
      try {
        this.allSurahs = await getChapters();
      } catch (error) {
        console.error('Gagal memuat surah:', error);
      }
    },
    async fetchJuz() {
      try {
        const juzData = await getJuzs();
        this.allJuz = juzData;
      } catch (error) {
        console.error('Gagal memuat juz:', error);
      }
    },
    filterSurahs() {
      const query = this.searchQuery.trim().toLowerCase();
      this.juzList = [];
      this.filteredSurahs = query
        ? this.allSurahs.filter(surah =>
            surah.name_simple.toLowerCase().includes(query)
          )
        : [];
    },
    showAllSurahs() {
      this.filteredSurahs = [...this.allSurahs];
      this.juzList = [];
      this.searchQuery = '';
    },
    showAllJuz() {
      this.juzList = Array.isArray(this.allJuz) ? [...this.allJuz] : [];
      this.filteredSurahs = [];
      this.searchQuery = '';
    },
    goToSurah(id) {
      this.$router.push(`/surah/${id}`);
    },
    goToJuz(juzNumber) {
      this.$router.push(`/juz/${juzNumber}`);
    },
    getSurahsInJuz(juz) {
      const surahNumbers = Object.keys(juz.verse_mapping).map(key =>
        parseInt(key.split(':')[0])
      );
      const uniqueSurahIds = [...new Set(surahNumbers)];
      return uniqueSurahIds.map(id => {
        const surah = this.allSurahs.find(s => s.id === id);
        return surah ? surah.name_simple : `Surah ${id}`;
      });
    },
  },
  mounted() {
    this.fetchSurahs();
    this.fetchJuz();
  },
};
</script>

<style scoped>
@import 'animate.css';

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

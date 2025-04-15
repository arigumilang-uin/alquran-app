<template>
  <div class="container py-4">
    <h1 class="text-center mb-4">Daftar Juz</h1>
    <div 
      v-for="(juz, index) in juzs" 
      :key="index" 
      class="mb-4 p-3 border rounded shadow-sm bg-light"
    >
      <router-link :to="`/juz/${juz.juz_number}`" class="text-decoration-none">
        <h2 class="h5">📖 Juz {{ juz.juz_number }}</h2>
      </router-link>
      <ul class="list-unstyled mt-2">
        <li 
          v-for="(ayatRange, surahId) in juz.verse_mapping" 
          :key="surahId"
          class="mb-1"
        >
          <strong>{{ getSurahName(surahId) }}</strong>
          (Ayat: {{ ayatRange }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getJuzs, getChapters } from '@/services/quranAPI';

export default {
  data() {
    return {
      juzs: [],
      surahMap: {},
    };
  },
  methods: {
    async fetchJuzs() {
      try {
        this.juzs = await getJuzs();
      } catch (error) {
        console.error('Gagal mengambil data Juz:', error);
      }
    },
    async fetchSurahs() {
      try {
        const chapters = await getChapters();
        const map = {};
        chapters.forEach((surah) => {
          map[surah.id] = surah.name_simple;
        });
        this.surahMap = map;
      } catch (error) {
        console.error('Gagal mengambil data Surah:', error);
      }
    },
    getSurahName(id) {
      return this.surahMap[id] || `Surah ${id}`;
    },
  },
  async created() {
    await this.fetchSurahs();
    await this.fetchJuzs();
  },
};
</script>


<template>
  <div>
    <h2 class="text-center mb-4">📚 Daftar Surah</h2>
    <div class="row">
      <div v-for="surah in surahs" :key="surah.id" class="col-md-4 col-sm-6 mb-3">
        <router-link :to="`/surah/${surah.id}`" class="text-decoration-none">
          <div class="card h-100 shadow-sm">
            <div class="card-body text-center">
              <h5 class="card-title">{{ surah.name_simple }}</h5>
              <p class="card-text text-muted">Surah {{ surah.name_arabic }}</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getChapters } from '@/services/quranAPI'; // Pastikan path sesuai dengan struktur folder kamu

export default {
  data() {
    return { surahs: [] };
  },
  mounted() {
    this.loadSurahs();
  },
  methods: {
    async loadSurahs() {
      try {
        const response = await getChapters(); // Mengambil respons dari getChapters()
        this.surahs = response.data.chapters; // Mengambil data chapters dari respons
      } catch (err) {
        console.error('Error fetching surahs:', err);
      }
    },
  },
};
</script>

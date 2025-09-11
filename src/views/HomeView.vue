<script>
  /**
   * 🏠 HomeView.vue - 主頁面組件 (Main Page Component)
   *
   * 這是應用程式的主頁面，整合了地圖顯示和控制面板。
   * 主要功能：
   * - 顯示世界城市地圖
   * - 提供城市導航按鈕
   * - 提供底圖切換功能
   * - 響應式佈局設計
   *
   * 組件結構：
   * - MapTab: 地圖顯示組件
   * - 控制面板: 城市導航和底圖選擇
   */

  import MapTab from '../tabs/MapTab.vue';
  import { useDataStore } from '@/stores/dataStore.js';
  import { useDefineStore } from '@/stores/defineStore.js';
  import { ref, onMounted, computed } from 'vue';

  export default {
    name: 'HomeView',
    components: { MapTab },
    setup() {
      // 📦 存儲實例
      const dataStore = useDataStore();
      const defineStore = useDefineStore();

      /**
       * 🗺️ 設定地圖實例
       * 將 Leaflet 地圖實例傳遞給 dataStore 以便城市導航使用
       * @param {Object} map - Leaflet 地圖實例
       */
      const setMapInstance = (map) => dataStore.setMapInstance(map);

      /**
       * 🌍 導航到指定城市
       * 將地圖視圖移動到選定城市的中心位置
       * @param {string} cityId - 城市 ID
       */
      const navigateToCity = (cityId) => {
        // 更新當前城市名稱
        const city = cities.value?.find((c) => c.layerId === cityId);
        if (city) {
          console.log('🌍 切換到城市:', city.layerName);
          currentCity.value = city.layerName;
        }
        dataStore.navigateToCity(cityId);
      };

      // 移除底圖切換功能，使用預設的標準地圖

      // 📊 獲取城市列表
      const cities = computed(() => dataStore.layers[0].groupLayers);

      // 🌍 當前選中的城市（預設為西安）
      const currentCity = ref("XI'AN");

      // 🚀 初始化應用程式
      onMounted(() => {
        // 載入城市數據並導航到西安
        dataStore.loadCityLayers().then(() => {
          navigateToCity('Xian');
        });
      });

      return {
        setMapInstance,
        navigateToCity,
        cities,
        defineStore,
        currentCity,
      };
    },
  };
</script>

<template>
  <!-- 🏠 主應用程式容器 -->
  <div id="app" class="d-flex flex-column vh-100">
    <!-- 🗺️ 地圖區域容器 -->
    <div class="flex-grow-1 overflow-hidden position-relative">
      <!-- 🗺️ 地圖組件 -->
      <MapTab @map-ready="setMapInstance" :current-city="currentCity" />

      <!-- 🎛️ 左側中間控制面板 -->
      <div
        class="position-absolute"
        style="top: 50%; left: 0; transform: translateY(-50%); z-index: 1000; padding: 1rem"
      >
        <div class="bg-dark bg-opacity-75 rounded-3 p-3">
          <!-- 🌍 城市導航區域 -->
          <div class="mb-3">
            <div class="d-flex flex-column gap-1">
              <button
                v-for="city in cities"
                :key="city.layerId"
                class="btn border-0 my-city-btn my-font-sm-white px-4 py-3"
                :class="[currentCity === city.layerName ? 'active' : '']"
                @click="navigateToCity(city.layerId)"
              >
                {{ city.layerName }}
              </button>
            </div>
          </div>

          <!-- 移除底圖選擇區域，使用預設的標準地圖 -->
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  @import '../assets/css/common.css';
</style>

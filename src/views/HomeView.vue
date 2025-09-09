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
  import { ref } from 'vue';

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
        const city = cities.find((c) => c.layerId === cityId);
        if (city) {
          currentCity.value = city.layerName;
        }
        dataStore.navigateToCity(cityId);
      };

      /**
       * 🗺️ 切換底圖
       * 更改地圖的底圖樣式
       * @param {string} value - 底圖類型值
       */
      const setBasemap = (value) => defineStore.setSelectedBasemap(value);

      // 📊 獲取城市列表和底圖列表
      const cities = dataStore.layers[0].groupLayers;
      const basemaps = defineStore.basemaps;

      // 🌍 當前選中的城市（預設為第一個城市）
      const currentCity = ref(cities[0]?.layerName || '城市名稱');

      return {
        setMapInstance,
        navigateToCity,
        setBasemap,
        cities,
        basemaps,
        selectedBasemap: defineStore.selectedBasemap,
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

      <!-- 🎛️ 左上角控制面板 -->
      <div class="position-absolute top-0 start-0 p-3" style="z-index: 1000">
        <div class="bg-dark bg-opacity-75 rounded-3 p-3">
          <!-- 🌍 城市導航區域 -->
          <div>
            <h6 class="text-white mb-2">Point</h6>
            <div class="d-flex flex-column gap-1">
              <button
                v-for="city in cities"
                :key="city.layerId"
                class="btn btn-sm btn-outline-light"
                @click="navigateToCity(city.layerId)"
              >
                {{ city.layerName }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 🎛️ 右下角底圖選擇 -->
      <div class="position-absolute bottom-0 end-0 p-3" style="z-index: 1000">
        <div class="bg-dark bg-opacity-75 rounded-3 p-3">
          <h6 class="text-white mb-2">底圖選擇</h6>
          <select
            class="form-select form-select-sm"
            :value="selectedBasemap"
            @change="setBasemap($event.target.value)"
          >
            <option v-for="basemap in basemaps" :key="basemap.value" :value="basemap.value">
              {{ basemap.label }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  @import '../assets/css/common.css';
</style>

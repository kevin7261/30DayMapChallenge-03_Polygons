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
  import { ref, onMounted, onUnmounted, computed, watch } from 'vue';

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

      /**
       * 🗺️ 切換底圖
       * 更改地圖的底圖樣式
       * @param {string} value - 底圖類型值
       */
      const setBasemap = (value) => defineStore.setSelectedBasemap(value);

      /**
       * 🎨 切換到顏色主題模式
       * 根據當前城市切換到對應的顏色主題底圖
       */
      const setColorTheme = () => {
        // 獲取當前城市
        const currentCityLayer = cities.value?.find((city) => city.layerName === currentCity.value);
        if (currentCityLayer) {
          // 根據城市顏色切換底圖主題
          const colorThemeMap = {
            'city-beijing': 'city-beijing_theme', // 北京 - 專用粉紅色主題
            'city-xian': 'city-xian_theme', // 西安 - 專用金黃色主題
            'city-paris': 'city-paris_theme', // 巴黎 - 專用紫色主題
            'city-berlin': 'city-berlin_theme', // 柏林 - 專用藍色主題
            'city-rome': 'city-rome_theme', // 羅馬 - 專用青綠色主題
            'city-washington': 'city-washington_theme', // 華盛頓 - 專用深藍色主題
          };

          const themeBasemap = colorThemeMap[currentCityLayer.colorName];
          if (themeBasemap) {
            console.log('🎨 切換到城市主題底圖:', currentCityLayer.layerName, themeBasemap);
            setBasemap(themeBasemap);
          } else {
            console.warn('⚠️ 未找到對應的主題底圖:', currentCityLayer.colorName);
            // 如果沒有對應主題，切換到紅色主題
            setBasemap('red_theme');
          }
        } else {
          // 如果找不到當前城市，切換到紅色主題
          setBasemap('red_theme');
        }
      };

      // 📊 獲取城市列表和底圖列表
      const cities = computed(() => dataStore.layers[0].groupLayers);
      const basemaps = defineStore.basemaps;

      // 🌍 當前選中的城市（預設為北京）
      const currentCity = ref("XI'AN");

      // 監聽 currentCity 變化
      watch(currentCity, (newCity) => {
        console.log('🔄 currentCity 已更新為:', newCity);
      });

      // 🎨 監聽底圖切換事件
      onMounted(() => {
        // 載入城市數據並導航到西安
        dataStore.loadCityLayers().then(() => {
          // 載入完成後導航到西安
          navigateToCity('Xian');
        });

        const handleBasemapChange = (event) => {
          const { basemap } = event.detail;
          console.log('🎨 收到底圖切換事件:', basemap);
          setBasemap(basemap);
        };

        window.addEventListener('changeBasemap', handleBasemapChange);

        // 清理事件監聽器
        onUnmounted(() => {
          window.removeEventListener('changeBasemap', handleBasemapChange);
        });
      });

      return {
        setMapInstance,
        navigateToCity,
        setBasemap,
        setColorTheme,
        cities,
        basemaps,
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

      <!-- 🎛️ 左上角控制面板 -->
      <div class="position-absolute top-0 start-0 p-3" style="z-index: 1000">
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

          <!-- 🗺️ 底圖選擇區域 -->
          <div>
            <div class="d-flex flex-column gap-1">
              <!-- 地圖模式按鈕 -->
              <button
                class="btn btn-sm"
                :class="
                  defineStore.selectedBasemap === 'carto_dark' ? 'btn-light' : 'btn-outline-light'
                "
                @click="setBasemap('carto_dark')"
              >
                地圖
              </button>
              <!-- 顏色主題按鈕 -->
              <button
                class="btn btn-sm"
                :class="
                  defineStore.selectedBasemap.endsWith('_theme') ? 'btn-light' : 'btn-outline-light'
                "
                @click="setColorTheme"
              >
                顏色
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  @import '../assets/css/common.css';
</style>

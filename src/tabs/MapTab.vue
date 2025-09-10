<script>
  /**
   * 🗺️ MapTab.vue - 簡化版地圖組件 (Simplified Map Component)
   *
   * 這是一個簡化的地圖組件，專為世界城市地圖展示設計。
   * 主要功能：
   * - 顯示世界六大城市的 GeoJSON 數據
   * - 提供城市導航功能
   * - 支援多種底圖切換
   * - 響應式設計
   *
   * 技術架構：
   * - Vue 3 Composition API
   * - Leaflet 地圖庫
   * - Pinia 狀態管理
   * - Bootstrap 5 樣式
   */

  import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import { useDataStore } from '@/stores/dataStore.js';
  import { useDefineStore } from '@/stores/defineStore.js';

  export default {
    name: 'MapTab',
    props: {
      zoomLevel: { type: Number, default: 12 },
      isPanelDragging: { type: Boolean, default: false },
      currentCity: { type: String, default: '城市名稱' },
    },
    emits: [
      'update:zoomLevel',
      'update:currentCoords',
      'update:activeMarkers',
      'feature-selected',
      'map-ready',
    ],
    setup(props, { emit }) {
      // 📦 存儲實例
      const dataStore = useDataStore();
      const defineStore = useDefineStore();

      // 🗺️ 地圖相關變數
      const mapContainer = ref(null);
      let mapInstance = null;
      let currentTileLayer = null;
      let layerGroups = {};

      // 🎛️ 地圖控制狀態
      const isMapReady = ref(false);
      const mapContainerId = ref(`leaflet-map-${Math.random().toString(36).substr(2, 9)}`);

      // 📊 計算屬性：檢查是否有任何圖層可見
      const isAnyLayerVisible = computed(() => dataStore.getAllLayers().some((l) => l.geoJsonData));

      // 🏙️ 當前城市信息
      const currentCityInfo = computed(() => {
        if (!props.currentCity) {
          console.log('❌ currentCityInfo: 沒有當前城市');
          return null;
        }

        // 從dataStore中獲取城市信息
        const allLayers = dataStore.getAllLayers();
        console.log(
          '🔍 查找城市:',
          props.currentCity,
          '可用圖層:',
          allLayers.map((l) => l.layerName)
        );

        const cityLayer = allLayers.find((layer) => layer.layerName === props.currentCity);
        if (cityLayer) {
          console.log('✅ 找到城市圖層:', cityLayer.layerName);
          return {};
        } else {
          console.log('❌ 未找到城市圖層:', props.currentCity);
          return null;
        }
      });

      /**
       * 🏗️ 創建地圖實例
       * 初始化 Leaflet 地圖並設定基本配置
       */
      const createMap = () => {
        if (!mapContainer.value) return false;

        const rect = mapContainer.value.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) {
          console.warn('[MapTab] 容器尺寸為零，延遲初始化');
          return false;
        }

        try {
          mapInstance = L.map(mapContainer.value, {
            center: defineStore.mapView.center,
            zoom: defineStore.mapView.zoom,
            zoomControl: false,
            attributionControl: false,
            dragging: false, // 禁用拖拽
            touchZoom: false, // 禁用觸控縮放
            doubleClickZoom: false, // 禁用雙擊縮放
            scrollWheelZoom: false, // 禁用滾輪縮放
            boxZoom: false, // 禁用框選縮放
            keyboard: false, // 禁用鍵盤控制
          });

          // 綁定地圖事件
          mapInstance.on('zoomend', handleZoomEnd);
          mapInstance.on('moveend', handleMoveEnd);

          // 點擊空白處清除選取
          mapInstance.on('click', function (e) {
            if (!e.originalEvent.target.closest('.leaflet-interactive')) {
              dataStore.setSelectedFeature(null);
              resetAllLayerStyles();
            }
          });

          // 設定 popup 面板的 z-index
          mapInstance.getPane('popupPane').style.zIndex = 2200;

          isMapReady.value = true;
          emit('map-ready', mapInstance);

          console.log('[MapTab] 地圖創建成功');
          return true;
        } catch (error) {
          console.error('[MapTab] 地圖創建失敗:', error);
          return false;
        }
      };

      /**
       * 📡 處理縮放結束事件
       * 更新地圖視圖狀態到存儲中
       */
      const handleZoomEnd = () => {
        if (mapInstance) {
          const zoom = mapInstance.getZoom();
          const center = mapInstance.getCenter();
          defineStore.setMapView([center.lat, center.lng], zoom);
          emit('update:zoomLevel', zoom);
        }
      };

      /**
       * 📡 處理移動結束事件
       * 更新地圖中心座標
       */
      const handleMoveEnd = () => {
        if (mapInstance) {
          const center = mapInstance.getCenter();
          defineStore.setMapView([center.lat, center.lng], mapInstance.getZoom());
          emit('update:currentCoords', { lat: center.lat, lng: center.lng });
        }
      };

      /**
       * 🎨 設定底圖
       * 根據存儲中的設定載入對應的底圖圖層
       */
      const setBasemap = () => {
        if (!mapInstance) return;

        // 移除現有底圖
        if (currentTileLayer) {
          mapInstance.removeLayer(currentTileLayer);
        }

        const config = defineStore.basemaps.find((b) => b.value === defineStore.selectedBasemap);

        // 檢查是否為顏色主題地圖
        const isColorTheme = defineStore.selectedBasemap.endsWith('_theme');

        if (isColorTheme) {
          // 顏色主題地圖：不添加底圖圖層，只設定背景色
          // 不添加任何底圖圖層
        } else if (config && config.url) {
          // 一般底圖：添加底圖圖層
          currentTileLayer = L.tileLayer(config.url, {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
          });
          mapInstance.addLayer(currentTileLayer);
        }

        // 設定容器背景色（同時套用在地圖容器與其父容器）
        const mapContainerElement = mapContainer.value;
        const mapRootElement = mapContainerElement ? mapContainerElement.parentElement : null; // #map-container
        if (mapContainerElement) {
          console.log('🎨 設定底圖背景色:', defineStore.selectedBasemap);

          const allBgClasses = [
            'my-map-bg-blank',
            'my-map-bg-black',
            'my-map-bg-red-theme',
            'my-map-bg-blue-theme',
            'my-map-bg-green-theme',
            'my-map-bg-purple-theme',
            'my-map-bg-lightblue-theme',
            'my-map-bg-yellow-theme',
            'my-map-bg-city-beijing-theme',
            'my-map-bg-city-xian-theme',
            'my-map-bg-city-paris-theme',
            'my-map-bg-city-berlin-theme',
            'my-map-bg-city-rome-theme',
            'my-map-bg-city-washington-theme',
            'my-map-bg-transparent',
          ];

          // 移除所有背景顏色類別（內外容器都處理）
          [mapContainerElement, mapRootElement].forEach((el) => {
            if (!el) return;
            el.classList.remove(...allBgClasses);
          });

          // 根據底圖類型添加對應的 CSS 類別
          const basemapClassMap = {
            blank: 'my-map-bg-blank',
            black: 'my-map-bg-black',
            red_theme: 'my-map-bg-red-theme',
            blue_theme: 'my-map-bg-blue-theme',
            green_theme: 'my-map-bg-green-theme',
            purple_theme: 'my-map-bg-purple-theme',
            orange_theme: 'my-map-bg-lightblue-theme',
            yellow_theme: 'my-map-bg-yellow-theme',
            // 城市專用顏色主題
            'city-beijing_theme': 'my-map-bg-city-beijing-theme',
            'city-xian_theme': 'my-map-bg-city-xian-theme',
            'city-paris_theme': 'my-map-bg-city-paris-theme',
            'city-berlin_theme': 'my-map-bg-city-berlin-theme',
            'city-rome_theme': 'my-map-bg-city-rome-theme',
            'city-washington_theme': 'my-map-bg-city-washington-theme',
          };

          const bgClass = basemapClassMap[defineStore.selectedBasemap] || 'my-map-bg-transparent';

          // 內外容器都加入背景類別，確保顏色可見
          [mapContainerElement, mapRootElement].forEach((el) => {
            if (!el) return;
            el.classList.add(bgClass);
          });
        }
      };

      /**
       * 🎨 創建要素圖層
       * 將 GeoJSON 數據轉換為 Leaflet 圖層
       */
      const createFeatureLayer = (layer) => {
        if (!layer.geoJsonData) return null;

        const { layerName, colorName } = layer;

        const geoJsonLayer = L.geoJSON(layer.geoJsonData, {
          // 點要素轉換函數
          pointToLayer: (feature, latlng) => {
            if (feature.geometry.type === 'Point') {
              const icon = L.divIcon({
                html: `<div
                 class="rounded-circle"
                 style="
                    background-color: var(--my-color-${colorName});
                    width: 8px;
                    height: 8px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                  ">
                  </div>`,
                className: 'custom-point-icon',
                iconSize: [8, 8],
                iconAnchor: [4, 4],
                popupAnchor: [0, -4],
              });
              return L.marker(latlng, { icon });
            }
            return L.marker(latlng);
          },
          // 樣式設定函數 - 只處理 LineString
          style: () => {
            return {
              color: 'white', // 所有時候都是白色
              weight: 8, // 線寬改為8px
              opacity: 0.8,
              lineCap: 'square', // 直角線端
              lineJoin: 'miter', // 直角連接
            };
          },
          // 每個要素的處理函數
          onEachFeature: (feature, layer) => {
            // 綁定彈窗
            layer.bindPopup(`
              <div class="p-2">
                <div class="mb-2">${layerName}</div>
                <div>${feature.properties.name || '未命名'}</div>
                 </div>
               `);

            // 綁定點擊事件
            layer.on('click', () => {
              emit('feature-selected', feature);
              highlightFeature(feature);
            });
          },
        });

        return geoJsonLayer;
      };

      /**
       * 🎯 高亮顯示特定要素
       * 當用戶點擊地圖要素時高亮顯示
       */
      const highlightFeature = (feature) => {
        // 重置所有圖層樣式
        resetAllLayerStyles();

        // 高亮選中的要素
        if (feature && feature._leaflet_id) {
          // 這裡可以添加高亮邏輯
          console.log('高亮要素:', feature.properties.name);
        }
      };

      /**
       * 🔄 重置所有圖層樣式
       * 清除所有高亮效果
       */
      const resetAllLayerStyles = () => {
        // 這裡可以添加重置樣式的邏輯
        console.log('重置圖層樣式');
      };

      /**
       * 🔄 同步圖層
       * 根據存儲中的圖層狀態同步地圖上的圖層
       */
      const syncLayers = () => {
        if (!mapInstance) return;

        const allLayers = dataStore.getAllLayers();

        allLayers.forEach((layer) => {
          const layerId = layer.layerId;

          if (layer.geoJsonData) {
            // 顯示圖層
            if (!layerGroups[layerId]) {
              const geoJsonLayer = createFeatureLayer(layer);
              if (geoJsonLayer) {
                layerGroups[layerId] = geoJsonLayer;
                mapInstance.addLayer(geoJsonLayer);
              }
            }
          } else {
            // 隱藏圖層
            if (layerGroups[layerId]) {
              mapInstance.removeLayer(layerGroups[layerId]);
              delete layerGroups[layerId];
            }
          }
        });
      };

      /**
       * 📏 刷新地圖尺寸
       * 當容器大小改變時重新計算地圖尺寸
       */
      const invalidateSize = () => {
        if (mapInstance) {
          setTimeout(() => {
            mapInstance.invalidateSize();
          }, 100);
        }
      };

      /**
       * 🚀 初始化地圖
       * 創建地圖並載入初始數據
       */
      const initMap = () => {
        let attempts = 0;
        const maxAttempts = 20;

        const tryCreateMap = () => {
          if (attempts >= maxAttempts) {
            console.error('[MapTab] 地圖初始化失敗，已達到最大嘗試次數');
            return;
          }

          attempts++;
          console.log(`[MapTab] 嘗試創建地圖 (${attempts}/${maxAttempts})`);

          if (createMap()) {
            console.log('[MapTab] 地圖創建成功，開始初始化');
            setBasemap();
            syncLayers();

            // 延遲載入城市圖層
            setTimeout(() => {
              dataStore.loadCityLayers();
            }, 1000);
          } else {
            console.log('[MapTab] 地圖創建失敗，100ms 後重試');
            setTimeout(tryCreateMap, 100);
          }
        };

        tryCreateMap();
      };

      // 📏 設置 ResizeObserver 監聽容器大小變化
      let resizeObserver = null;
      let resizeTimeout = null;

      const setupResizeObserver = () => {
        if (!mapContainer.value || !window.ResizeObserver) return;

        resizeObserver = new ResizeObserver(() => {
          if (resizeTimeout) {
            clearTimeout(resizeTimeout);
          }

          resizeTimeout = setTimeout(() => {
            console.log('🔄 容器大小變化，刷新地圖');
            invalidateSize();
          }, 200);
        });

        resizeObserver.observe(mapContainer.value);
        console.log('✅ ResizeObserver 已設置');
      };

      // 🧹 生命週期：組件掛載
      onMounted(() => {
        nextTick(() => {
          initMap();
          setupResizeObserver();
        });
      });

      // 🧹 生命週期：組件卸載
      onUnmounted(() => {
        if (resizeTimeout) {
          clearTimeout(resizeTimeout);
        }

        if (resizeObserver) {
          resizeObserver.disconnect();
        }

        if (mapInstance) {
          mapInstance.remove();
          mapInstance = null;
        }

        layerGroups = {};
        currentTileLayer = null;
        isMapReady.value = false;
      });

      // 👀 監聽器：監聽資料存儲中的圖層變化
      watch(() => dataStore.layers, syncLayers, { deep: true });

      // 👀 監聽器：監聽底圖變化
      watch(
        () => defineStore.selectedBasemap,
        () => {
          if (isMapReady.value) {
            setBasemap();
          }
        }
      );

      // 📤 返回組件公開的屬性和方法
      return {
        mapContainer,
        mapContainerId,
        isAnyLayerVisible,
        currentCityInfo,
        highlightFeature,
        invalidateSize,
        defineStore,
      };
    },
  };
</script>

<template>
  <!-- 🗺️ 地圖主容器 -->
  <div id="map-container" class="h-100 w-100 position-relative bg-transparent z-0">
    <!-- 🗺️ Leaflet 地圖容器 -->
    <div :id="mapContainerId" ref="mapContainer" class="h-100 w-100"></div>

    <!-- 📱 IG 截圖框框 -->
    <div
      class="position-absolute top-50 start-50 translate-middle"
      style="z-index: 1000; pointer-events: none"
    >
      <!-- 貼文尺寸框 (4:5) -->
      <div
        class="position-absolute top-50 start-50 translate-middle bg-transparent d-flex flex-column align-items-center justify-content-center"
        style="
          width: calc(80vw - 32px);
          height: calc(100vw - 32px);
          max-width: calc(80vh - 32px);
          max-height: calc(100vh - 32px);
          z-index: 1001;
          border: 1px solid var(--my-color-gray-200);
        "
      >
        <div class="position-absolute top-0 start-50 translate-middle-x my-font-lg-white pt-3">
          {{ currentCity }}
        </div>
        <div class="position-absolute bottom-0 start-50 translate-middle-x">
          <div class="d-flex align-items-center justify-content-center">
            <span class="my-font-lg-white">01</span>
            <span class="my-bgcolor-white mx-3" style="width: 2px; height: 28px"></span>
            <span class="my-font-lg-white">Lines</span>
          </div>
          <div class="my-font-sm-white pb-3">#30DayMapChallenge</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  @import '../assets/css/common.css';
</style>

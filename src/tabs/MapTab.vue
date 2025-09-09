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
      zoomLevel: { type: Number, default: 11 },
      isPanelDragging: { type: Boolean, default: false },
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
        if (config && config.url) {
          currentTileLayer = L.tileLayer(config.url, {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
          });
          mapInstance.addLayer(currentTileLayer);
        }

        // 設定容器背景色
        const mapContainerElement = mapContainer.value;
        if (mapContainerElement) {
          if (defineStore.selectedBasemap === 'blank') {
            mapContainerElement.style.backgroundColor = 'var(--my-color-white)';
          } else if (defineStore.selectedBasemap === 'black') {
            mapContainerElement.style.backgroundColor = 'var(--my-color-gray-800)';
          } else {
            mapContainerElement.style.backgroundColor = 'transparent';
          }
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
          // 樣式設定函數
          style: (feature) => {
            if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
              return {
                fillColor: feature.properties.fillColor || `var(--my-color-${colorName})`,
                weight: 1,
                opacity: 1,
                color: feature.properties.color || 'white',
                fillOpacity: feature.properties.fillColor ? 0.6 : 0.3,
              };
            } else if (
              feature.geometry.type === 'LineString' ||
              feature.geometry.type === 'MultiLineString'
            ) {
              return {
                color: feature.properties.color || `var(--my-color-${colorName})`,
                weight: 2,
                opacity: 0.8,
                lineCap: 'round',
                lineJoin: 'round',
              };
            }
          },
          // 每個要素的處理函數
          onEachFeature: (feature, layer) => {
            // 綁定彈窗
            layer.bindPopup(`
              <div class="p-2">
                <div class="fw-bold mb-2">${layerName}</div>
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
        highlightFeature,
        invalidateSize,
        defineStore,
      };
    },
  };
</script>

<template>
  <!-- 🗺️ 地圖主容器 -->
  <div id="map-container" class="h-100 w-100 position-relative">
    <!-- 🗺️ Leaflet 地圖容器 -->
    <div :id="mapContainerId" ref="mapContainer" class="h-100 w-100"></div>
  </div>
</template>

<style scoped>
  /* 🗺️ 地圖容器樣式 */
  #map-container {
    background-color: transparent;
    z-index: 0;
  }

  /* 🗺️ Leaflet 地圖容器樣式 */
  [id^='leaflet-map'] {
    width: 100% !important;
    height: 100% !important;
  }
</style>

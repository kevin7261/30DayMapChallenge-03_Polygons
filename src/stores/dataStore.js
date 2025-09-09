/**
 * 📦 數據存儲模組 (Data Store Module)
 *
 * 本模組使用 Pinia 狀態管理系統，負責管理整個應用程式的圖層數據和相關狀態。
 * 採用 Vue 3 Composition API 設計，提供響應式的數據管理和操作方法。
 *
 * 🎯 主要職責：
 * 1. 🗺️ 圖層數據管理 - 定義和管理所有地圖圖層的配置和狀態
 * 2. 📊 數據載入控制 - 控制圖層數據的載入、顯示和隱藏
 * 3. 🔄 狀態同步 - 確保圖層狀態與 UI 組件間的同步
 * 4. 🎨 視覺化配置 - 管理圖層的顏色、樣式和顯示屬性
 * 5. 📋 數據結構定義 - 定義統一的圖層數據結構和接口
 *
 * 🏗️ 架構設計：
 * - 使用 Pinia 的 defineStore 創建響應式狀態管理
 * - 採用 Composition API 的 ref 和 computed 進行狀態管理
 * - 模組化設計，將數據處理邏輯分離到 utils/dataProcessor.js
 * - 提供統一的 API 接口供組件調用
 *
 * 📁 相關文件：
 * - ../utils/dataProcessor.js - 數據處理和載入邏輯
 * - ../tabs/MapTab.vue - 地圖組件，主要消費者
 * - ../tabs/DataTableTab.vue - 數據表格組件
 * - ../tabs/PropertiesTab.vue - 屬性面板組件
 */

// 🔧 核心依賴引入 (Core Dependencies Import)
import { defineStore } from 'pinia'; // Pinia 狀態管理庫
import { ref, computed } from 'vue'; // Vue 3 響應式 API
import L from 'leaflet'; // Leaflet 地圖庫

// 📊 數據處理器引入 (Data Processor Imports)
import {
  loadCityGeoJson, // 城市 GeoJSON 數據載入器
} from '../utils/dataProcessor.js';

/**
 * 🏪 數據存儲商店定義 (Data Store Definition)
 *
 * 使用 Pinia 的 defineStore 創建一個名為 'data' 的狀態管理商店。
 * 採用 Composition API 語法，提供更好的 TypeScript 支援和代碼組織。
 *
 * @returns {Object} 包含所有狀態和方法的商店對象
 */
export const useDataStore = defineStore(
  'data', // 商店唯一標識符
  () => {
    /**
     * 🗺️ 圖層配置數據 (Layer Configuration Data)
     *
     * 定義所有可用的地圖圖層，採用分組結構組織，每個圖層包含完整的配置信息。
     * 使用 ref 創建響應式數據，當圖層狀態改變時會自動更新相關 UI 組件。
     *
     * 📋 圖層結構說明：
     * - groupName: 圖層組名稱，用於 UI 分組顯示
     * - groupLayers: 該組下的所有圖層列表
     *   - layerId: 圖層唯一標識符
     *   - layerName: 圖層顯示名稱
     *   - colorName: 圖層顏色名稱（對應 CSS 變數）
     *   - geoJsonData: GeoJSON 格式的地理數據
     *   - loader: 數據載入函數
     *   - fileName: 數據文件路徑
     *   - fieldName: 主要字段名稱
     *   - center: 城市中心座標
     *   - zoom: 縮放級別
     */
    const layers = ref([
      {
        // 🌍 世界城市地圖集合
        // 包含各大洲代表性城市的地理邊界數據
        groupName: '世界城市',
        groupLayers: [
          {
            // 🏛️ 北京圖層配置
            layerId: '北京', // 圖層唯一標識符
            layerName: '北京', // 圖層顯示名稱
            colorName: 'red', // 紅色主題 - 代表中國傳統色彩
            geoJsonData: null, // GeoJSON 地理數據（載入後填充）
            loader: loadCityGeoJson, // 數據載入函數
            fileName: 'beijing.geojson', // 數據文件路徑
            fieldName: null, // 主要字段名稱（可選）
            center: [116.4074, 39.9042], // 北京中心座標
            zoom: 11, // 最佳縮放級別
            length: null, // 城市邊界長度（動態計算）
            angle: null, // 主要方向角度（動態計算）
            boundsCenter: null, // 緩存的邊界框中心點（性能優化）
          },
          {
            // 🏛️ 柏林圖層配置
            layerId: '柏林', // 圖層唯一標識符
            layerName: '柏林', // 圖層顯示名稱
            colorName: 'blue', // 藍色主題 - 代表德國國旗色彩
            geoJsonData: null, // GeoJSON 地理數據（載入後填充）
            loader: loadCityGeoJson, // 數據載入函數
            fileName: 'berlin.geojson', // 數據文件路徑
            fieldName: null, // 主要字段名稱（可選）
            center: [13.405, 52.52], // 柏林中心座標
            zoom: 12, // 最佳縮放級別
            length: null, // 城市邊界長度（動態計算）
            angle: null, // 主要方向角度（動態計算）
            boundsCenter: null, // 緩存的邊界框中心點（性能優化）
          },
          {
            // 🏛️ 巴黎圖層配置
            layerId: '巴黎', // 圖層唯一標識符
            layerName: '巴黎', // 圖層顯示名稱
            colorName: 'purple', // 紫色主題 - 代表法國皇室色彩
            geoJsonData: null, // GeoJSON 地理數據（載入後填充）
            loader: loadCityGeoJson, // 數據載入函數
            fileName: 'paris.geojson', // 數據文件路徑
            fieldName: null, // 主要字段名稱（可選）
            center: [2.3522, 48.8566], // 巴黎中心座標
            zoom: 12, // 最佳縮放級別
            length: null, // 城市邊界長度（動態計算）
            angle: null, // 主要方向角度（動態計算）
            boundsCenter: null, // 緩存的邊界框中心點（性能優化）
          },
          {
            // 🏛️ 羅馬圖層配置
            layerId: '羅馬', // 圖層唯一標識符
            layerName: '羅馬', // 圖層顯示名稱
            colorName: 'orange', // 橙色主題 - 代表義大利溫暖色彩
            geoJsonData: null, // GeoJSON 地理數據（載入後填充）
            loader: loadCityGeoJson, // 數據載入函數
            fileName: 'rome.geojson', // 數據文件路徑
            fieldName: null, // 主要字段名稱（可選）
            center: [12.4964, 41.9028], // 羅馬中心座標
            zoom: 14, // 最佳縮放級別
            length: null, // 城市邊界長度（動態計算）
            angle: null, // 主要方向角度（動態計算）
            boundsCenter: null, // 緩存的邊界框中心點（性能優化）
          },
          {
            // 🏛️ 華盛頓特區圖層配置
            layerId: '華盛頓特區', // 圖層唯一標識符
            layerName: '華盛頓特區', // 圖層顯示名稱
            colorName: 'green', // 綠色主題 - 代表美國自然色彩
            geoJsonData: null, // GeoJSON 地理數據（載入後填充）
            loader: loadCityGeoJson, // 數據載入函數
            fileName: 'washingtondc.geojson', // 數據文件路徑
            fieldName: null, // 主要字段名稱（可選）
            center: [-77.0369, 38.9072], // 華盛頓特區中心座標
            zoom: 12, // 最佳縮放級別
            length: null, // 城市邊界長度（動態計算）
            angle: null, // 主要方向角度（動態計算）
            boundsCenter: null, // 緩存的邊界框中心點（性能優化）
          },
          {
            // 🏛️ 西安圖層配置
            layerId: '西安', // 圖層唯一標識符
            layerName: '西安', // 圖層顯示名稱
            colorName: 'yellow', // 黃色主題 - 代表中國古代帝王色彩
            geoJsonData: null, // GeoJSON 地理數據（載入後填充）
            loader: loadCityGeoJson, // 數據載入函數
            fileName: 'xian.geojson', // 數據文件路徑
            fieldName: null, // 主要字段名稱（可選）
            center: [108.9402, 34.3416], // 西安中心座標
            zoom: 12, // 最佳縮放級別
            length: null, // 城市邊界長度（動態計算）
            angle: null, // 主要方向角度（動態計算）
            boundsCenter: null, // 緩存的邊界框中心點（性能優化）
          },
        ],
      },
    ]);

    /**
     * 🔍 根據圖層 ID 查找圖層對象 (Find Layer by ID)
     *
     * 在分組結構的圖層配置中搜索指定 ID 的圖層，返回完整的圖層配置對象。
     * 使用嵌套循環遍歷所有圖層組和圖層，確保能夠找到正確的圖層。
     *
     * @param {string} layerId - 要查找的圖層唯一標識符
     * @returns {Object|null} 找到的圖層對象，如果未找到則返回 null
     *
     * @example
     * const layer = findLayerById('安養機構');
     * if (layer) {
     *   console.log('找到圖層:', layer.layerName);
     * }
     */
    const findLayerById = (layerId) => {
      // 遍歷所有圖層組
      for (const group of layers.value) {
        // 遍歷當前組的所有圖層
        for (const layer of group.groupLayers) {
          // 檢查圖層 ID 是否匹配
          if (layer.layerId === layerId) {
            return layer; // 返回找到的圖層對象
          }
        }
      }
      return null; // 未找到指定 ID 的圖層
    };

    /**
     * 📋 獲取所有圖層的扁平陣列 (Get All Layers as Flat Array)
     *
     * 將分組結構的圖層配置轉換為扁平的一維陣列，便於進行批量操作和遍歷。
     * 使用展開運算符將每個圖層組的所有圖層合併到一個陣列中。
     *
     * @returns {Array} 包含所有圖層的扁平陣列
     *
     * @example
     * const allLayers = getAllLayers();
     * console.log('總共有', allLayers.length, '個圖層');
     */
    const getAllLayers = () => {
      const allLayers = []; // 初始化結果陣列
      // 遍歷所有圖層組
      for (const group of layers.value) {
        // 使用展開運算符將當前組的所有圖層添加到結果陣列
        allLayers.push(...group.groupLayers);
      }
      return allLayers; // 返回扁平化的圖層陣列
    };

    /**
     * 🔄 切換圖層可見性狀態 (Toggle Layer Visibility)
     *
     * 控制指定圖層的顯示/隱藏狀態，並在圖層首次顯示時自動載入相關數據。
     * 這是圖層管理的核心方法，負責處理圖層狀態變更和數據載入邏輯。
     *
     * @param {string} layerId - 要切換狀態的圖層唯一標識符
     * @returns {Promise<void>} 異步操作，無返回值
     *
     * @example
     * // 切換安養機構圖層的顯示狀態
     * await toggleLayerVisibility('安養機構');
     */
    // 移除圖層可見性切換（城市圖層永久可見，且無需勾選切換）

    /**
     * 📏 計算GeoJSON邊界長度
     * @param {Object} geoJsonData - GeoJSON數據
     * @returns {string} 格式化後的長度字符串
     */
    const calculateBoundaryLength = (geoJsonData) => {
      if (!geoJsonData || !geoJsonData.features) {
        console.log('❌ calculateBoundaryLength: 無效的GeoJSON數據');
        return 'N/A';
      }

      let totalLength = 0;
      console.log('📏 開始計算邊界長度，特徵數量:', geoJsonData.features.length);

      geoJsonData.features.forEach((feature) => {
        if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
          const coordinates =
            feature.geometry.type === 'Polygon'
              ? feature.geometry.coordinates
              : feature.geometry.coordinates.flat();

          coordinates.forEach((ring) => {
            if (ring.length > 1) {
              for (let i = 0; i < ring.length - 1; i++) {
                const point1 = L.latLng(ring[i][1], ring[i][0]);
                const point2 = L.latLng(ring[i + 1][1], ring[i + 1][0]);
                totalLength += point1.distanceTo(point2);
              }
            }
          });
        }
      });

      // 轉換為公里並格式化
      const km = totalLength / 1000;
      const result = km > 1000 ? `${(km / 1000).toFixed(1)}k km` : `${km.toFixed(0)} km`;
      console.log('📏 計算結果:', result, '總長度(米):', totalLength);
      return result;
    };

    /**
     * 📐 計算GeoJSON主要方向角度
     * @param {Object} geoJsonData - GeoJSON數據
     * @returns {string} 格式化後的角度字符串
     */
    const calculateMainAngle = (geoJsonData) => {
      if (!geoJsonData || !geoJsonData.features) {
        console.log('❌ calculateMainAngle: 無效的GeoJSON數據');
        return 'N/A';
      }

      let allPoints = [];
      console.log('📐 開始計算主要角度，特徵數量:', geoJsonData.features.length);

      geoJsonData.features.forEach((feature) => {
        if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
          const coordinates =
            feature.geometry.type === 'Polygon'
              ? feature.geometry.coordinates
              : feature.geometry.coordinates.flat();

          coordinates.forEach((ring) => {
            ring.forEach((coord) => {
              allPoints.push([coord[0], coord[1]]); // [lng, lat]
            });
          });
        }
      });

      if (allPoints.length < 2) {
        console.log('❌ calculateMainAngle: 點數量不足');
        return 'N/A';
      }

      // 計算邊界框
      const lngs = allPoints.map((p) => p[0]);
      const lats = allPoints.map((p) => p[1]);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);

      // 計算對角線角度
      const deltaLng = maxLng - minLng;
      const deltaLat = maxLat - minLat;
      const angle = Math.atan2(deltaLat, deltaLng) * (180 / Math.PI);
      const result = `${Math.round(angle)}°`;

      console.log('📐 計算結果:', result, '角度:', angle, '點數量:', allPoints.length);
      return result;
    };

    /**
     * 🚀 自動載入城市圖層 (Auto Load City Layers)
     *
     * 在應用程式初始化時自動載入所有城市圖層數據
     */
    const loadCityLayers = async () => {
      const cityLayers = layers.value[0].groupLayers; // 獲取城市圖層組

      for (const layer of cityLayers) {
        if (!layer.geoJsonData) {
          try {
            const result = await layer.loader(layer);

            // 將載入的資料直接存儲在圖層物件中，但保留原有的 center 和 zoom 屬性
            layer.geoJsonData = result.geoJsonData;

            // 計算長度和角度
            layer.length = calculateBoundaryLength(result.geoJsonData);
            layer.angle = calculateMainAngle(result.geoJsonData);

            // 預先計算並緩存邊界框中心點（性能優化）
            if (
              result.geoJsonData &&
              result.geoJsonData.features &&
              result.geoJsonData.features.length > 0
            ) {
              const bounds = L.geoJSON(result.geoJsonData).getBounds();
              layer.boundsCenter = bounds.getCenter();
              console.log(`🎯 緩存邊界框中心點:`, layer.boundsCenter);
            }

            console.log(
              `✅ 城市圖層 "${layer.layerName}" 載入完成 (${result.geoJsonData?.features?.length || 0} 筆資料)`
            );
            console.log(`🌍 城市中心座標:`, layer.center);
            console.log(`📏 邊界長度:`, layer.length);
            console.log(`📐 主要角度:`, layer.angle);
          } catch (error) {
            console.error(`Failed to load city layer "${layer.layerName}":`, error);
          }
        }
      }
    };

    // ------------------------------------------------------------
    // 選中的地圖物件
    const selectedFeature = ref(null);

    const setSelectedFeature = (feature) => {
      selectedFeature.value = feature;
    };

    const clearSelectedFeature = () => {
      selectedFeature.value = null;
    };

    // ------------------------------------------------------------
    // 地圖導航功能
    const mapInstance = ref(null);

    const setMapInstance = (map) => {
      mapInstance.value = map;
    };

    const navigateToCity = (cityId) => {
      const cityLayer = findLayerById(cityId);

      if (!cityLayer) {
        console.error('❌ 找不到城市圖層:', cityId);
        return;
      }

      if (!mapInstance.value) {
        console.error('❌ 地圖實例未準備就緒，等待地圖初始化...');
        // 如果地圖還沒準備好，等待一下再試
        setTimeout(() => {
          if (mapInstance.value) {
            console.log('🌍 地圖已準備就緒，重新嘗試移動');
            navigateToCity(cityId);
          } else {
            console.error('❌ 地圖實例仍未準備就緒');
          }
        }, 1000);
        return;
      }

      // 計算城市位置和縮放級別（性能優化：優先使用緩存的邊界框中心）
      let targetCenter = null;
      let optimalZoom = cityLayer.zoom || 11;

      if (cityLayer.boundsCenter) {
        // 使用緩存的邊界框中心點（最快）
        targetCenter = cityLayer.boundsCenter;
      } else if (
        cityLayer.geoJsonData &&
        cityLayer.geoJsonData.features &&
        cityLayer.geoJsonData.features.length > 0
      ) {
        // 即時計算邊界框中心（較慢，但作為備用）
        const bounds = L.geoJSON(cityLayer.geoJsonData).getBounds();
        targetCenter = bounds.getCenter();
      } else if (cityLayer.center) {
        // 使用預設中心點（最慢，但最可靠）
        const [lng, lat] = cityLayer.center;
        targetCenter = [lat, lng]; // Leaflet 需要 [lat, lng]
      } else {
        console.error('❌ 城市圖層沒有可用的中心座標:', cityId, cityLayer);
        return;
      }

      // 只有在當前是顏色主題時才切換底圖
      const currentBasemap = defineStore.selectedBasemap;
      const isColorTheme = currentBasemap && currentBasemap.endsWith('_theme');

      if (isColorTheme) {
        // 根據城市顏色切換底圖主題
        const colorThemeMap = {
          red: 'red_theme',
          blue: 'blue_theme',
          green: 'green_theme',
          purple: 'purple_theme',
          orange: 'orange_theme',
          yellow: 'yellow_theme',
        };

        const themeBasemap = colorThemeMap[cityLayer.colorName];
        if (themeBasemap) {
          // 觸發底圖切換事件，讓外部組件處理
          window.dispatchEvent(
            new CustomEvent('changeBasemap', {
              detail: { basemap: themeBasemap },
            })
          );
        }
      }
      try {
        // 使用setView直接跳轉，沒有動畫
        mapInstance.value.setView(targetCenter, optimalZoom);
      } catch (error) {
        console.error('❌ 移動失敗:', error);
      }
    };

    return {
      layers,
      findLayerById, // 根據 ID 尋找圖層
      getAllLayers, // 獲取所有圖層的扁平陣列
      loadCityLayers, // 自動載入城市圖層
      selectedFeature,
      setSelectedFeature,
      clearSelectedFeature,
      mapInstance,
      setMapInstance,
      navigateToCity,
      // 所有圖層都是可見的，所以直接返回所有圖層
      visibleLayers: computed(() => getAllLayers()),
    };
  },
  {
    persist: true,
  }
);

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
import { useDefineStore } from './defineStore.js'; // 定義存儲模組

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
            // 🏛️ 西安圖層配置
            layerId: 'Xian', // 圖層唯一標識符
            layerName: "XI'AN", // 圖層顯示名稱
            colorName: 'city-xian', // 金黃色主題 - 代表中國古代帝王色彩
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
          {
            // 🏛️ 北京圖層配置
            layerId: 'Beijing', // 圖層唯一標識符
            layerName: 'BEIJING', // 圖層顯示名稱
            colorName: 'city-beijing', // 深藍色主題 - 代表中國傳統色彩
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
            // 🏛️ 羅馬圖層配置
            layerId: 'Rome', // 圖層唯一標識符
            layerName: 'ROME', // 圖層顯示名稱
            colorName: 'city-rome', // 粉紅色主題 - 代表義大利浪漫色彩
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
            // 🏛️ 巴黎圖層配置
            layerId: 'Paris', // 圖層唯一標識符
            layerName: 'PARIS', // 圖層顯示名稱
            colorName: 'city-paris', // 淡紫色主題 - 代表法國優雅色彩
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
            // 🏛️ 華盛頓圖層配置
            layerId: 'Washington', // 圖層唯一標識符
            layerName: 'WASHINGTON', // 圖層顯示名稱
            colorName: 'city-washington', // 青綠色主題 - 代表美國自然色彩
            geoJsonData: null, // GeoJSON 地理數據（載入後填充）
            loader: loadCityGeoJson, // 數據載入函數
            fileName: 'washingtondc.geojson', // 數據文件路徑
            fieldName: null, // 主要字段名稱（可選）
            center: [-77.0369, 38.9072], // 華盛頓中心座標
            zoom: 12, // 最佳縮放級別
            length: null, // 城市邊界長度（動態計算）
            angle: null, // 主要方向角度（動態計算）
            boundsCenter: null, // 緩存的邊界框中心點（性能優化）
          },
          {
            // 🏛️ 柏林圖層配置
            layerId: 'Berlin', // 圖層唯一標識符
            layerName: 'BERLIN', // 圖層顯示名稱
            colorName: 'city-berlin', // 淺藍色主題 - 代表德國現代色彩
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
     * 📏 計算GeoJSON線段總長度
     *
     * 計算所有 LineString 特徵的總長度
     *
     * @param {Object} geoJsonData - GeoJSON數據物件
     * @returns {string} 格式化後的長度字符串 (如: "123 km" 或 "1.2k km")
     */
    const calculateBoundaryLength = (geoJsonData) => {
      // 驗證輸入數據
      if (!geoJsonData?.features?.length) {
        console.log('❌ calculateBoundaryLength: 無效的GeoJSON數據');
        return 'N/A';
      }

      let totalLength = 0; // 總長度（米）
      console.log('📏 開始計算線段長度，特徵數量:', geoJsonData.features.length);

      // 遍歷所有特徵，直接處理 LineString
      geoJsonData.features.forEach((feature) => {
        const coords = feature.geometry.coordinates;
        // 計算線段上相鄰點之間的距離
        for (let i = 0; i < coords.length - 1; i++) {
          const point1 = L.latLng(coords[i][1], coords[i][0]); // [lng, lat] -> [lat, lng]
          const point2 = L.latLng(coords[i + 1][1], coords[i + 1][0]);
          totalLength += point1.distanceTo(point2);
        }
      });

      // 轉換為公里並格式化顯示
      const km = totalLength / 1000;
      const result = km > 1000 ? `${(km / 1000).toFixed(1)}k km` : `${km.toFixed(0)} km`;
      console.log('📏 計算結果:', result, '總長度(米):', totalLength);
      return result;
    };

    /**
     * 📐 計算GeoJSON主要方向角度
     *
     * 透過計算所有點的邊界框對角線角度來確定主要方向
     *
     * @param {Object} geoJsonData - GeoJSON數據物件
     * @returns {string} 格式化後的角度字符串 (如: "45°")
     */
    const calculateMainAngle = (geoJsonData) => {
      // 驗證輸入數據
      if (!geoJsonData?.features?.length) {
        console.log('❌ calculateMainAngle: 無效的GeoJSON數據');
        return 'N/A';
      }

      let allPoints = []; // 收集所有座標點
      console.log('📐 開始計算主要角度，特徵數量:', geoJsonData.features.length);

      // 遍歷所有特徵，直接處理 LineString
      geoJsonData.features.forEach((feature) => {
        // 收集線段上的所有點
        feature.geometry.coordinates.forEach((coord) => {
          allPoints.push([coord[0], coord[1]]); // [lng, lat]
        });
      });

      // 檢查是否有足夠的點來計算角度
      if (allPoints.length < 2) {
        console.log('❌ calculateMainAngle: 點數量不足');
        return 'N/A';
      }

      // 計算邊界框（Bounding Box）
      const lngs = allPoints.map((p) => p[0]); // 經度陣列
      const lats = allPoints.map((p) => p[1]); // 緯度陣列
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);

      // 計算邊界框對角線的角度（相對於正東方向）
      const deltaLng = maxLng - minLng; // 經度差
      const deltaLat = maxLat - minLat; // 緯度差
      const angle = Math.atan2(deltaLat, deltaLng) * (180 / Math.PI); // 轉換為度數
      const result = `${Math.round(angle)}°`;

      console.log('📐 計算結果:', result, '角度:', angle, '點數量:', allPoints.length);
      return result;
    };

    /**
     * 🚀 載入城市圖層數據
     *
     * 載入所有城市圖層的GeoJSON數據，並計算長度、角度和邊界框中心點
     * 如果數據已載入，則重新計算缺失的指標
     *
     * @returns {Promise<void>} 異步操作，無返回值
     */
    const loadCityLayers = async () => {
      const cityLayers = layers.value[0].groupLayers; // 獲取城市圖層組
      console.log('🚀 開始載入城市圖層，總數:', cityLayers.length);

      // 遍歷所有城市圖層
      for (const layer of cityLayers) {
        try {
          if (!layer.geoJsonData) {
            // 首次載入：從文件載入GeoJSON數據
            console.log(`📥 載入城市圖層: ${layer.layerName}`);
            const result = await layer.loader(layer);

            // 儲存載入的數據
            layer.geoJsonData = result.geoJsonData;

            // 計算並儲存指標
            layer.length = calculateBoundaryLength(result.geoJsonData);
            layer.angle = calculateMainAngle(result.geoJsonData);

            // 計算並緩存邊界框中心點（用於地圖導航）
            if (result.geoJsonData?.features?.length > 0) {
              const bounds = L.geoJSON(result.geoJsonData).getBounds();
              layer.boundsCenter = bounds.getCenter();
              console.log(`🎯 緩存邊界框中心點:`, layer.boundsCenter);
            }

            console.log(`✅ 城市圖層 "${layer.layerName}" 載入完成`);
            console.log(`   📊 特徵數量: ${result.geoJsonData?.features?.length || 0}`);
            console.log(`   📏 邊界長度: ${layer.length}`);
            console.log(`   📐 主要角度: ${layer.angle}`);
          } else {
            // 數據已載入：檢查並補齊缺失的指標
            console.log(`🔄 檢查城市圖層指標: ${layer.layerName}`);

            // 重新計算長度和角度（如果缺失）
            if (!layer.length || !layer.angle) {
              layer.length = calculateBoundaryLength(layer.geoJsonData);
              layer.angle = calculateMainAngle(layer.geoJsonData);
              console.log(`   📏 重新計算長度: ${layer.length}`);
              console.log(`   📐 重新計算角度: ${layer.angle}`);
            }

            // 重新計算邊界框中心點（如果缺失）
            if (!layer.boundsCenter) {
              const bounds = L.geoJSON(layer.geoJsonData).getBounds();
              layer.boundsCenter = bounds.getCenter();
              console.log(`   🎯 重新計算邊界框中心點:`, layer.boundsCenter);
            }
          }
        } catch (error) {
          console.error(`❌ 處理城市圖層 "${layer.layerName}" 時發生錯誤:`, error);
        }
      }

      console.log('🎉 城市圖層載入完成');
    };

    // ------------------------------------------------------------
    // 選中的地圖物件（用於清除選取狀態）
    const selectedFeature = ref(null);

    const setSelectedFeature = (feature) => {
      selectedFeature.value = feature;
    };

    // ------------------------------------------------------------
    // 地圖導航功能
    const mapInstance = ref(null);

    const setMapInstance = (map) => {
      mapInstance.value = map;
    };

    /**
     * 🌍 導航到指定城市
     *
     * 將地圖視圖移動到指定城市的中心位置，並根據當前底圖模式
     * 自動切換到對應的顏色主題（如果適用）
     *
     * @param {string} cityId - 城市圖層的唯一標識符
     * @returns {void}
     */
    const navigateToCity = (cityId) => {
      // 查找城市圖層
      const cityLayer = findLayerById(cityId);
      if (!cityLayer) {
        console.error('❌ 找不到城市圖層:', cityId);
        return;
      }

      // 檢查地圖實例是否準備就緒
      if (!mapInstance.value) {
        console.error('❌ 地圖實例未準備就緒，等待地圖初始化...');
        // 延遲重試機制
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

      // 確定目標位置和縮放級別（按優先級順序）
      let targetCenter = null;
      const optimalZoom = cityLayer.zoom || 11;

      if (cityLayer.boundsCenter) {
        // 優先使用緩存的邊界框中心點（性能最佳）
        targetCenter = cityLayer.boundsCenter;
        console.log('🎯 使用緩存的邊界框中心點');
      } else if (cityLayer.geoJsonData?.features?.length > 0) {
        // 即時計算邊界框中心（較慢但準確）
        const bounds = L.geoJSON(cityLayer.geoJsonData).getBounds();
        targetCenter = bounds.getCenter();
        console.log('📐 即時計算邊界框中心點');
      } else if (cityLayer.center) {
        // 使用預設中心點（最慢但最可靠）
        const [lng, lat] = cityLayer.center;
        targetCenter = [lat, lng]; // Leaflet 需要 [lat, lng] 格式
        console.log('📍 使用預設中心點:', targetCenter);
      } else {
        console.error('❌ 城市圖層沒有可用的中心座標:', cityId);
        return;
      }

      // 檢查並更新底圖主題（如果當前是顏色主題模式）
      const defineStoreInstance = useDefineStore();
      const currentBasemap = defineStoreInstance.selectedBasemap;
      const isColorTheme = currentBasemap?.endsWith('_theme');

      if (isColorTheme) {
        // 根據城市顏色切換到對應的顏色主題
        const colorThemeMap = {
          'city-beijing': 'city-beijing_theme',
          'city-xian': 'city-xian_theme',
          'city-paris': 'city-paris_theme',
          'city-berlin': 'city-berlin_theme',
          'city-rome': 'city-rome_theme',
          'city-washington': 'city-washington_theme',
        };

        const themeBasemap = colorThemeMap[cityLayer.colorName];
        if (themeBasemap && themeBasemap !== currentBasemap) {
          console.log('🎨 切換城市顏色主題:', cityLayer.layerName, '→', themeBasemap);
          // 直接更新全域設定的底圖，觸發監聽器更新背景
          defineStoreInstance.selectedBasemap = themeBasemap;
        }
      }

      // 執行地圖導航
      try {
        mapInstance.value.setView(targetCenter, optimalZoom, { animate: false });
        console.log(`🌍 成功導航到城市: ${cityLayer.layerName}`);
      } catch (error) {
        console.error('❌ 地圖導航失敗:', error);
      }
    };

    return {
      layers,
      findLayerById, // 根據 ID 尋找圖層
      getAllLayers, // 獲取所有圖層的扁平陣列
      loadCityLayers, // 自動載入城市圖層
      selectedFeature, // 選中的地圖要素
      setSelectedFeature, // 設定選中的地圖要素
      mapInstance, // 地圖實例
      setMapInstance, // 設定地圖實例
      navigateToCity, // 導航到指定城市
      // 所有圖層都是可見的，所以直接返回所有圖層
      visibleLayers: computed(() => getAllLayers()),
    };
  },
  {
    persist: true,
  }
);

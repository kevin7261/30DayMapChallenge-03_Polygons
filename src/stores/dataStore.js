/**
 * 📦 數據存儲模組 (Data Store Module)
 *
 * 管理城市圖層數據和地圖導航功能
 * 使用 Pinia 狀態管理系統和 Vue 3 Composition API
 */

// 核心依賴
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import L from 'leaflet';
import { loadCityGeoJson } from '../utils/dataProcessor.js';
// 移除未使用的 useDefineStore import

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

            // 計算並緩存邊界框中心點（用於地圖導航）
            if (result.geoJsonData?.features?.length > 0) {
              const bounds = L.geoJSON(result.geoJsonData).getBounds();
              layer.boundsCenter = bounds.getCenter();
              console.log(`🎯 緩存邊界框中心點:`, layer.boundsCenter);
            }

            console.log(`✅ 城市圖層 "${layer.layerName}" 載入完成`);
            console.log(`   📊 特徵數量: ${result.geoJsonData?.features?.length || 0}`);
          } else {
            // 數據已載入：檢查並補齊缺失的指標
            console.log(`🔄 檢查城市圖層指標: ${layer.layerName}`);

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

      // 移除顏色主題切換邏輯，使用預設的標準地圖

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

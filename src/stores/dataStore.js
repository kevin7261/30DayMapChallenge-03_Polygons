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

// 📊 數據處理器引入 (Data Processor Imports)
import {
  //loadPublicElderlyWelfareInstitutionData, // 公辦老人福利機構數據載入器（已註解）
  loadElderlyWelfareInstitutionData, // 老人福利機構數據載入器
  loadResidentialLongTermCareData, // 住宿式長照機構數據載入器
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
     *   - visible: 圖層是否可見
     *   - isLoading: 圖層是否正在載入
     *   - isLoaded: 圖層是否已載入完成
     *   - type: 圖層類型（point/polygon/line）
     *   - shape: 點圖層的形狀（circle/square等）
     *   - colorName: 圖層顏色名稱（對應 CSS 變數）
     *   - geoJsonData: GeoJSON 格式的地理數據
     *   - summaryData: 圖層統計摘要數據
     *   - tableData: 表格顯示用的數據
     *   - legendData: 圖例配置數據
     *   - loader: 數據載入函數
     *   - fileName: 數據文件路徑
     *   - fieldName: 主要字段名稱
     */
    const layers = ref([
      {
        // 🏥 機構式長照機構 - 老人福利機構組
        // 包含安養機構、養護機構、長期照顧機構等老人福利相關設施
        groupName: '機構式長照機構 - 老人福利機構',
        groupLayers: [
          {
            // 🏠 安養機構圖層配置
            // 提供長期照護服務的安養型機構，主要服務對象為需要長期照護的長者
            layerId: '安養機構', // 圖層唯一標識符
            layerName: '安養機構', // 圖層顯示名稱
            visible: false, // 初始狀態為隱藏
            isLoading: false, // 初始載入狀態為未載入
            isLoaded: false, // 初始數據載入狀態為未載入
            type: 'point', // 點類型圖層
            shape: 'circle', // 圓形標記
            colorName: 'green', // 綠色主題（對應 CSS 變數 --my-color-green）
            geoJsonData: null, // GeoJSON 地理數據（載入後填充）
            summaryData: null, // 統計摘要數據（載入後填充）
            tableData: null, // 表格顯示數據（載入後填充）
            legendData: null, // 圖例配置數據（載入後填充）
            loader: loadElderlyWelfareInstitutionData, // 數據載入函數
            fileName: '台北市政府社會局/臺北市老人福利機構名冊1140201_coord_安養.csv', // 數據文件路徑
            fieldName: null, // 主要字段名稱（可選）
          },
          {
            // 🏥 養護機構圖層配置
            // 提供養護服務的機構，主要服務對象為需要日常照護的長者
            layerId: '養護機構', // 圖層唯一標識符
            layerName: '養護機構', // 圖層顯示名稱
            visible: false, // 初始狀態為隱藏
            isLoading: false, // 初始載入狀態為未載入
            isLoaded: false, // 初始數據載入狀態為未載入
            type: 'point', // 點類型圖層
            shape: 'circle', // 圓形標記
            colorName: 'green', // 綠色主題（對應 CSS 變數 --my-color-green）
            geoJsonData: null, // GeoJSON 地理數據（載入後填充）
            summaryData: null, // 統計摘要數據（載入後填充）
            tableData: null, // 表格顯示數據（載入後填充）
            legendData: null, // 圖例配置數據（載入後填充）
            loader: loadElderlyWelfareInstitutionData, // 數據載入函數
            fileName: '台北市政府社會局/臺北市老人福利機構名冊1140201_coord_養護.csv', // 數據文件路徑
            fieldName: null, // 主要字段名稱（可選）
          },
          {
            // 🏥 長期照顧機構圖層配置
            // 提供長期照顧服務的機構，整合各類長照服務資源
            layerId: '長期照顧機構', // 圖層唯一標識符
            layerName: '長期照顧機構', // 圖層顯示名稱
            visible: false, // 初始狀態為隱藏
            isLoading: false, // 初始載入狀態為未載入
            isLoaded: false, // 初始數據載入狀態為未載入
            type: 'point', // 點類型圖層
            shape: 'circle', // 圓形標記
            colorName: 'green', // 綠色主題（對應 CSS 變數 --my-color-green）
            geoJsonData: null, // GeoJSON 地理數據（載入後填充）
            summaryData: null, // 統計摘要數據（載入後填充）
            tableData: null, // 表格顯示數據（載入後填充）
            legendData: null, // 圖例配置數據（載入後填充）
            loader: loadElderlyWelfareInstitutionData, // 數據載入函數
            fileName: '台北市政府社會局/臺北市老人福利機構名冊1140201_coord_長照.csv', // 數據文件路徑
            fieldName: null, // 主要字段名稱（可選）
          },
        ],
      },
      {
        // 🏢 機構式長照機構 - 法人長照機構組
        // 包含由法人經營的住宿式長照機構等專業長照服務設施
        groupName: '機構式長照機構 - 法人長照機構',
        groupLayers: [
          {
            // 🏥 住宿式長照機構圖層配置
            // 提供住宿式長期照顧服務的法人機構，提供24小時專業照護服務
            layerId: '住宿式長照機構', // 圖層唯一標識符
            layerName: '住宿式長照機構', // 圖層顯示名稱
            visible: false, // 初始狀態為隱藏
            isLoading: false, // 初始載入狀態為未載入
            isLoaded: false, // 初始數據載入狀態為未載入
            type: 'point', // 點類型圖層
            shape: 'circle', // 圓形標記
            colorName: 'red', // 紅色主題（對應 CSS 變數 --my-color-red）
            geoJsonData: null, // GeoJSON 地理數據（載入後填充）
            summaryData: null, // 統計摘要數據（載入後填充）
            tableData: null, // 表格顯示數據（載入後填充）
            legendData: null, // 圖例配置數據（載入後填充）
            loader: loadResidentialLongTermCareData, // 數據載入函數
            fileName: '台北市政府衛生局/臺北市立案住宿式長照機構一覽表_coord.csv', // 數據文件路徑
            fieldName: null, // 主要字段名稱（可選）
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
    const toggleLayerVisibility = async (layerId) => {
      console.log('🔧 DataStore: toggleLayerVisibility 被調用', layerId);

      // 查找指定的圖層
      const layer = findLayerById(layerId);
      if (!layer) {
        console.error(`Layer with id "${layerId}" not found.`);
        return; // 如果圖層不存在，直接返回
      }

      console.log('🔧 DataStore: 找到圖層', layer.layerName, '當前狀態:', layer.visible);

      // 切換圖層的可見性狀態
      layer.visible = !layer.visible;
      console.log('🔧 DataStore: 新狀態:', layer.visible);

      // 如果圖層被開啟且尚未載入，則載入資料（分析圖層除外）
      if (
        layer.visible &&
        !layer.isLoaded &&
        !layer.isLoading &&
        !layer.isAnalysisLayer &&
        !layer.isIsochroneAnalysisLayer
      ) {
        try {
          layer.isLoading = true;
          const result = await layer.loader(layer);

          // 將載入的資料直接存儲在圖層物件中
          layer.geoJsonData = result.geoJsonData;
          layer.tableData = result.tableData;
          layer.summaryData = result.summaryData;
          layer.legendData = result.legendData || null;
          layer.isLoaded = true;

          // 🔄 強制觸發響應式更新
          console.log(
            `✅ 圖層 "${layer.layerName}" 載入完成 (${result.geoJsonData?.features?.length || 0} 筆資料)`
          );
          console.log(`📊 圖層摘要資料:`, layer.summaryData);
        } catch (error) {
          console.error(`Failed to load data for layer "${layer.layerName}":`, error);
          layer.visible = false; // 載入失敗時恢復可見性狀態
        } finally {
          layer.isLoading = false;
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

    return {
      layers,
      findLayerById, // 根據 ID 尋找圖層
      getAllLayers, // 獲取所有圖層的扁平陣列
      toggleLayerVisibility,
      selectedFeature,
      setSelectedFeature,
      clearSelectedFeature,
      visibleLayers: computed(() => getAllLayers().filter((layer) => layer.visible)),
      loadingLayers: computed(() => getAllLayers().filter((layer) => layer.isLoading)),
    };
  },
  {
    persist: true,
  }
);

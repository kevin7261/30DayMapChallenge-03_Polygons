import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import {
  //loadPublicElderlyWelfareInstitutionData,
  loadElderlyWelfareInstitutionData,
  loadResidentialLongTermCareData,
} from '../utils/dataProcessor.js';

// 主要數據存儲定義 (Main Data Store Definition)
export const useDataStore = defineStore(
  'data',
  () => {
    const layers = ref([
      {
        groupName: '機構式長照機構 - 老人福利機構',
        groupLayers: [
          {
            layerId: '安養機構',
            layerName: '安養機構',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'green',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadElderlyWelfareInstitutionData,
            fileName: '台北市政府社會局/臺北市老人福利機構名冊1140201_coord_安養.csv',
            fieldName: null,
          },
          {
            layerId: '養護機構',
            layerName: '養護機構',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'green',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadElderlyWelfareInstitutionData,
            fileName: '台北市政府社會局/臺北市老人福利機構名冊1140201_coord_養護.csv',
            fieldName: null,
          },
          {
            layerId: '長期照顧機構',
            layerName: '長期照顧機構',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'green',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadElderlyWelfareInstitutionData,
            fileName: '台北市政府社會局/臺北市老人福利機構名冊1140201_coord_長照.csv',
            fieldName: null,
          },
        ],
      },
      {
        groupName: '機構式長照機構 - 法人長照機構',
        groupLayers: [
          {
            layerId: '住宿式長照機構',
            layerName: '住宿式長照機構',
            visible: false,
            isLoading: false,
            isLoaded: false,
            type: 'point',
            shape: 'circle',
            colorName: 'red',
            geoJsonData: null,
            summaryData: null,
            tableData: null,
            legendData: null,
            loader: loadResidentialLongTermCareData,
            fileName: '台北市政府衛生局/臺北市立案住宿式長照機構一覽表_coord.csv',
            fieldName: null,
          },
        ],
      },
    ]);

    // 在新的分組結構中搜尋指定 ID 的圖層
    const findLayerById = (layerId) => {
      for (const group of layers.value) {
        for (const layer of group.groupLayers) {
          if (layer.layerId === layerId) {
            return layer;
          }
        }
      }
      return null;
    };

    // 從分組結構中提取所有圖層的扁平陣列
    const getAllLayers = () => {
      const allLayers = [];
      for (const group of layers.value) {
        allLayers.push(...group.groupLayers);
      }
      return allLayers;
    };

    // 控制圖層的顯示/隱藏，並在需要時自動載入資料
    const toggleLayerVisibility = async (layerId) => {
      console.log('🔧 DataStore: toggleLayerVisibility 被調用', layerId);
      const layer = findLayerById(layerId);
      if (!layer) {
        console.error(`Layer with id "${layerId}" not found.`);
        return;
      }

      console.log('🔧 DataStore: 找到圖層', layer.layerName, '當前狀態:', layer.visible);
      // 切換可見性狀態
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

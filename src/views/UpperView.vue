<script>
  // 🔧 Vue Composition API 引入
  import { ref, watch, nextTick } from 'vue';
  // 🧩 子組件引入
  import MapTab from '../tabs/MapTab.vue';

  export default {
    name: 'UpperView',

    /**
     * 🧩 組件註冊 (Component Registration)
     * 註冊上半部面板內使用的子組件
     */
    components: {
      MapTab,
    },

    /**
     * 🔧 組件屬性定義 (Component Props)
     * 接收來自父組件的配置和狀態數據
     */
    props: {
      mainPanelWidth: { type: Number, default: 60 },
      contentHeight: { type: Number, default: 500 },
      showTainanLayer: { type: Boolean, default: false },
      selectedFilter: { type: String, default: '' },
      zoomLevel: { type: Number, default: 11 },
      isPanelDragging: { type: Boolean, default: false },
      activeMarkers: { type: Number, default: 0 },
    },

    /**
     * 📡 組件事件定義 (Component Events)
     * 定義向父組件發送的事件類型
     */
    emits: [
      'update:zoomLevel', // 更新地圖縮放等級
      'update:currentCoords', // 更新當前座標
      'update:activeMarkers', // 更新作用中標記數量
      'feature-selected', // 選中地圖特徵
    ],

    /**
     * 🔧 組件設定函數 (Component Setup)
     * 使用 Composition API 設定組件邏輯
     */
    setup(props) {
      // 📚 子組件引用 (Child Component References)
      /** 🗺️ 地圖視圖組件引用 */
      const MapTab = ref(null);

      /**
       * 👀 監聽面板大小變化 (Watch Panel Size Changes)
       * 當面板寬度或高度變化時，更新相應的子組件
       */
      watch([() => props.mainPanelWidth, () => props.contentHeight], () => {
        nextTick(() => {
          if (MapTab.value) {
            // 🗺️ 重新計算地圖大小，適應新的容器尺寸
            MapTab.value.invalidateSize();

            // 響應式布局中額外的地圖刷新
            setTimeout(() => {
              if (MapTab.value) {
                MapTab.value.invalidateSize();
                console.log('🗺️ UpperView: Extra map size invalidation for responsive layout');
              }
            }, 200);
          }
        });
      });

      /**
       * 🎯 高亮顯示指定地圖特徵 (Highlight Feature on Map)
       *
       * @param {Object} highlightData - 包含 layerId 和 id 的高亮數據物件
       */
      const highlightFeature = (highlightData) => {
        console.log('🎯 UpperView: highlightFeature called with data:', highlightData);
        MapTab.value?.highlightFeature(highlightData);
      };

      /**
       * 🔄 重設地圖視圖 (Reset Map View)
       * 將地圖恢復到初始視圖狀態
       */
      const resetView = () => {
        if (MapTab.value) {
          MapTab.value.resetView();
        }
      };

      /**
       * 🗺️ 適應台南地區邊界 (Fit to Tainan Bounds)
       * 調整地圖視圖以完整顯示台南地區
       */
      const fitToTainanBounds = () => {
        if (MapTab.value) {
          MapTab.value.fitToTainanBounds();
        }
      };

      /**
       * 📏 手動刷新地圖尺寸 (Manually Refresh Map Size)
       * 當容器大小變化但自動偵測失效時使用
       */
      const invalidateMapSize = () => {
        if (MapTab.value) {
          MapTab.value.invalidateSize();
        }
      };

      return {
        MapTab, // 地圖組件引用
        highlightFeature, // 高亮顯示功能
        resetView, // 重設視圖功能
        fitToTainanBounds, // 適應邊界功能
        invalidateMapSize, // 刷新地圖尺寸功能
      };
    },
  };
</script>

<template>
  <div class="d-flex flex-column my-bgcolor-gray-200 h-100">
    <div class="flex-grow-1 overflow-hidden position-relative">
      <!-- 地圖內容 -->
      <div class="h-100">
        <MapTab
          ref="MapTab"
          :showTainanLayer="showTainanLayer"
          :selectedFilter="selectedFilter"
          :zoomLevel="zoomLevel"
          :maxCount="maxCount"
          @update:zoomLevel="$emit('update:zoomLevel', $event)"
          @update:currentCoords="$emit('update:currentCoords', $event)"
          @update:activeMarkers="$emit('update:activeMarkers', $event)"
          @feature-selected="$emit('feature-selected', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>

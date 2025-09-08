<script setup>
  import {
    ref,
    computed,
    onMounted,
    onUnmounted,
    defineProps,
    defineEmits,
    defineExpose,
    watch,
  } from 'vue';

  // 🧩 組件引入
  import UpperView from './UpperView.vue';

  // --- 📥 組件屬性定義 (Component Props) ---
  /**
   * 📋 接收來自父組件 (HomeView) 的所有必要數據和狀態
   * 包含面板尺寸、分頁狀態、地圖設定、資料等
   */
  const props = defineProps({
    // 🎛️ 分頁和面板設定 (Tab and Panel Settings)
    activeUpperTab: { type: String, default: 'map' },
    activeBottomTab: { type: String, default: 'table' },
    mainPanelWidth: { type: Number, default: 60 },
    dynamicMainAreaHeight: { type: Number, default: 500 },

    // 🗺️ 圖層和地圖設定 (Layer and Map Settings)
    showTainanLayer: { type: Boolean, default: false },
    selectedFilter: { type: String, default: '' },

    // 🔧 其他設定 (Other Settings)
    zoomLevel: { type: Number, default: 11 },
    currentCoords: { type: Object, default: () => ({ lat: 25.033, lng: 121.5654 }) },
    activeMarkers: { type: Number, default: 0 },
    isSidePanelDragging: { type: Boolean, default: false },
  });

  // --- 📤 組件事件定義 (Component Events) ---
  /**
   * 📡 定義向父組件 (HomeView) 發送的所有事件
   * 採用事件轉發模式，確保資料流向清晰
   */
  defineEmits([
    // 📊 分頁更新事件 (Tab Update Events)
    'update:activeUpperTab', // 更新主要分頁
    'update:activeBottomTab', // 更新底部分頁

    // 🗺️ 地圖狀態更新事件 (Map State Update Events)
    'update:zoomLevel', // 更新縮放等級
    'update:currentCoords', // 更新目前座標
    'update:activeMarkers', // 更新作用中標記數

    // 📊 表格相關事件
    'update:tableSearchQuery', // 更新搜尋查詢
    'sort-table', // 表格排序
    'highlight-on-map', // 在地圖上高亮顯示

    // 🔄 操作相關事件
    'reset-view', // 重設視圖
  ]);

  // --- 📚 內部組件引用 (Internal Component References) ---
  /** 📊 主內容面板引用 (用於呼叫 UpperView 的方法如 highlightFeature) */
  const mainContentRef = ref(null);

  // --- 🔧 內部拖曳調整邏輯 (Internal Dragging Logic) ---

  /**
   * 🖱️ 計算是否有任何拖曳正在進行 (影響滑鼠指標事件)
   * 使用側邊面板拖曳狀態，用於禁用指標事件
   */
  const isOverallDragging = computed(() => {
    return props.isSidePanelDragging;
  });

  /**
   * 📏 主內容區域高度計算 (Computing Main Content Area Height)
   * 直接使用從父組件傳入的動態高度
   */
  const contentHeight = computed(() => {
    const totalHeight = props.dynamicMainAreaHeight;
    console.log(`🔧 MiddleView: contentHeight (from prop): ${totalHeight}`);
    return Math.max(totalHeight, 0); // 確保不為負數，避免佈局錯誤
  });

  /**
   * 👀 監聽 activeUpperTab 變化 (Watch activeUpperTab Changes)
   * 當分頁切換時記錄日誌，用於除錯和狀態追蹤
   */
  watch(
    () => props.activeUpperTab,
    (newTab, oldTab) => {
      console.log(`🔧 MiddleView Watcher: activeUpperTab changed from "${oldTab}" to "${newTab}"`);
    }
  );

  /**
   * 🚀 組件掛載時初始化 (Component Mounted Initialization)
   * 組件載入完成後的初始化工作
   */
  onMounted(() => {
    // 初始計算將依賴從 HomeView 傳遞的正確 prop
    console.log('🚀 MiddleView mounted');
  });

  /**
   * 🗑️ 組件卸載時清理 (Component Unmounted Cleanup)
   * 組件銷毀前的清理工作，確保沒有記憶體洩漏
   */
  onUnmounted(() => {
    console.log('🗑️ MiddleView unmounted');
  });

  // --- 🔧 可從父組件呼叫的方法 (Methods Callable from Parent) ---

  /**
   * 🎯 高亮顯示特徵 (Highlight Feature)
   * 透過 mainContentRef 呼叫主內容面板的高亮功能
   * 用於從表格或其他來源觸發地圖上的要素高亮
   *
   * @param {Object} highlightData - 包含 layerId 和 id 的高亮數據物件
   */
  const highlightFeature = (highlightData) => {
    if (!mainContentRef.value) {
      console.warn('⚠️ 無法高亮顯示：mainContentRef 未定義');
      return;
    }
    console.log('🎯 MiddleView: 呼叫 highlightFeature', highlightData);
    mainContentRef.value.highlightFeature(highlightData);
  };

  /**
   * 🗺️ 適應台南邊界 (Fit to Tainan Bounds)
   * 透過 mainContentRef 呼叫地圖適應邊界功能
   * 將地圖視圖調整到顯示完整的台南市範圍
   */
  const fitToTainanBounds = () => {
    if (mainContentRef.value) {
      console.log('🗺️ MiddleView: 呼叫 fitToTainanBounds');
      mainContentRef.value.fitToTainanBounds();
    }
  };

  /**
   * 🔄 重設地圖視圖 (Reset Map View)
   * 透過 mainContentRef 呼叫地圖重設功能
   * 將地圖恢復到預設的縮放等級和中心位置
   */
  const resetMapTab = () => {
    if (mainContentRef.value) {
      console.log('🔄 MiddleView: 呼叫 resetMapTab');
      mainContentRef.value.resetView(); // 假設 UpperView 有 resetView 方法
    }
  };

  /**
   * 📏 刷新地圖尺寸 (Invalidate Map Size)
   * 透過 mainContentRef 呼叫地圖尺寸重新計算功能
   * 當容器大小變化但自動偵測失效時使用
   */
  const invalidateMapSize = () => {
    if (mainContentRef.value) {
      console.log('📏 MiddleView: 呼叫地圖尺寸刷新');
      mainContentRef.value.invalidateMapSize();
    }
  };

  /**
   * 🛑 停止地圖點擊模式 (Stop Map Click Mode)
   * 透過 mainContentRef 呼叫停止地圖點擊功能
   */
  const stopMapClickMode = () => {
    if (mainContentRef.value) {
      console.log('🛑 MiddleView: 停止地圖點擊模式');
      mainContentRef.value.stopMapClickMode();
    }
  };

  /**
   * 📤 暴露方法給父組件使用 (Expose Methods to Parent Component)
   * 讓 HomeView 可以直接呼叫這些方法，實現組件間的方法調用
   */
  defineExpose({
    highlightFeature, // 高亮顯示功能
    fitToTainanBounds, // 地圖邊界適應
    resetMapTab, // 地圖視圖重設
    invalidateMapSize, // 地圖尺寸刷新
    stopMapClickMode, // 停止地圖點擊模式
    // 如果 HomeView 需要直接存取子組件，可以暴露 mainContentRef 和 bottomViewRef
    // mainContentRef,    // 主內容組件引用
    // bottomViewRef      // 底部視圖組件引用
  });
</script>

<template>
  <!-- 🎛️ 中間面板組件 (Middle Panel Component) -->
  <!-- 負責管理主要內容區域的佈局 -->
  <!-- 這是一個佈局容器，使用 flexbox 垂直排列，填滿可用空間 -->
  <div class="d-flex flex-column overflow-hidden h-100">
    <!-- 📊 主要內容區域 (Main Content Area) -->
    <!-- 包含地圖、儀表板等主要顯示內容 -->
    <!-- 動態高度根據 contentHeight 計算，拖曳時禁用指標事件避免干擾 -->
    <div
      :style="{
        pointerEvents: isOverallDragging ? 'none' : 'auto',
        height: contentHeight + 'px',
        overflow: 'hidden',
      }"
    >
      <!-- 🗺️ 上層視圖組件 (Upper View Component) -->
      <!-- 傳遞所有必要的 props 給 UpperView，包含地圖狀態、資料、樣式設定等 -->
      <UpperView
        ref="mainContentRef"
        :activeUpperTab="activeUpperTab"
        :mainPanelWidth="mainPanelWidth"
        :contentHeight="contentHeight"
        :showTainanLayer="showTainanLayer"
        :selectedFilter="selectedFilter"
        :zoomLevel="zoomLevel"
        :isPanelDragging="isOverallDragging"
        :activeMarkers="activeMarkers"
        @update:activeUpperTab="$emit('update:activeUpperTab', $event)"
        @update:zoomLevel="$emit('update:zoomLevel', $event)"
        @update:currentCoords="$emit('update:currentCoords', $event)"
        @update:activeMarkers="$emit('update:activeMarkers', $event)"
        @feature-selected="$emit('feature-selected', $event)"
      />
    </div>
  </div>
</template>

<style scoped></style>

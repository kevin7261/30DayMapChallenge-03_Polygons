/**
 * 🔧 通用工具函數模組 (General Utility Functions Module)
 *
 * 本模組提供應用程式中常用的工具函數和配置，包括圖標映射、顏色配置、
 * 格式化函數等通用功能。採用模組化設計，便於維護和擴展。
 *
 * 🎯 主要功能：
 * 1. 🎨 圖標映射管理 - 統一管理系統中使用的所有圖標
 * 2. 🌈 顏色配置系統 - 提供標準化的顏色配置
 * 3. 🔧 工具函數 - 提供常用的輔助函數
 * 4. 📊 格式化函數 - 數據格式化和顯示相關函數
 *
 * 🏗️ 架構設計：
 * - 模組化導出，按功能分類
 * - 支援多語言（中文/英文）
 * - 與 Font Awesome 圖標庫整合
 * - 響應式顏色系統
 *
 * 📁 相關文件：
 * - ../assets/css/variables.css - CSS 變數定義
 * - ../tabs/MapTab.vue - 主要使用者
 * - ../components/ - 各種組件
 */

/**
 * 🎨 圖標映射表 (Icon Mapping Table)
 *
 * 統一管理系統中使用的所有圖標，支援中文/英文/FontAwesome 類名。
 * 採用物件結構，便於查找和使用，確保圖標的一致性。
 *
 * 結構說明：
 * - zh: 中文名稱
 * - en: 英文名稱
 * - icon: Font Awesome 圖標類名
 */
export const ICONS = {
  // 基本操作圖標
  add: { zh: '新增', en: 'Add', icon: 'fas fa-plus' },
  edit: { zh: '編輯', en: 'Edit', icon: 'fas fa-edit' },
  delete: { zh: '刪除', en: 'Delete', icon: 'fas fa-trash' },
  save: { zh: '儲存', en: 'Save', icon: 'fas fa-save' },
  cancel: { zh: '取消', en: 'Cancel', icon: 'fas fa-times' },
  confirm: { zh: '確認', en: 'Confirm', icon: 'fas fa-check' },
  search: { zh: '搜尋', en: 'Search', icon: 'fas fa-search' },
  filter: { zh: '篩選', en: 'Filter', icon: 'fas fa-filter' },
  sort: { zh: '排序', en: 'Sort', icon: 'fas fa-sort' },
  refresh: { zh: '重新整理', en: 'Refresh', icon: 'fas fa-sync-alt' },

  // 檔案操作圖標
  upload: { zh: '上傳', en: 'Upload', icon: 'fas fa-upload' },
  download: { zh: '下載', en: 'Download', icon: 'fas fa-download' },
  import: { zh: '匯入', en: 'Import', icon: 'fas fa-file-import' },
  export: { zh: '匯出', en: 'Export', icon: 'fas fa-file-export' },

  // 導航圖標
  home: { zh: '首頁', en: 'Home', icon: 'fas fa-home' },
  back: { zh: '返回', en: 'Back', icon: 'fas fa-arrow-left' },
  forward: { zh: '前進', en: 'Forward', icon: 'fas fa-arrow-right' },
  up: { zh: '向上', en: 'Up', icon: 'fas fa-arrow-up' },
  down: { zh: '向下', en: 'Down', icon: 'fas fa-arrow-down' },

  // 狀態圖標
  success: { zh: '成功', en: 'Success', icon: 'fas fa-check-circle' },
  error: { zh: '錯誤', en: 'Error', icon: 'fas fa-exclamation-circle' },
  warning: { zh: '警告', en: 'Warning', icon: 'fas fa-exclamation-triangle' },
  info: { zh: '資訊', en: 'Info', icon: 'fas fa-info-circle' },
  loading: { zh: '載入中', en: 'Loading', icon: 'fas fa-spinner' },

  // 視圖控制圖標
  view: { zh: '檢視', en: 'View', icon: 'fas fa-eye' },
  hide: { zh: '隱藏', en: 'Hide', icon: 'fas fa-eye-slash' },
  expand: { zh: '展開', en: 'Expand', icon: 'fas fa-expand' },
  collapse: { zh: '收縮', en: 'Collapse', icon: 'fas fa-compress' },

  // 📂 圖層和資料相關 (Layer & Data Icons)
  layer: { zh: '圖層', en: 'Layer', icon: 'fas fa-layer-group' },
  visible: { zh: '可見', en: 'Visible', icon: 'fas fa-eye' },
  hidden: { zh: '隱藏', en: 'Hidden', icon: 'fas fa-eye-slash' },
  data: { zh: '資料', en: 'Data', icon: 'fas fa-database' },
  table: { zh: '表格', en: 'Table', icon: 'fas fa-table' },

  // 🗺️ 地圖相關 (Map Icons)
  map: { zh: '地圖', en: 'Map', icon: 'fas fa-map' },
  location: { zh: '位置', en: 'Location', icon: 'fas fa-map-marker-alt' },
  zoom_in: { zh: '放大', en: 'Zoom In', icon: 'fas fa-search-plus' },
  zoom_out: { zh: '縮小', en: 'Zoom Out', icon: 'fas fa-search-minus' },
  center: { zh: '居中', en: 'Center', icon: 'fas fa-crosshairs' },

  // 📊 分析和統計 (Analysis & Statistics Icons)
  chart: { zh: '圖表', en: 'Chart', icon: 'fas fa-chart-bar' },
  statistics: { zh: '統計', en: 'Statistics', icon: 'fas fa-chart-line' },
  dashboard: { zh: '儀表板', en: 'Dashboard', icon: 'fas fa-tachometer-alt' },
  analysis: { zh: '分析', en: 'Analysis', icon: 'fas fa-analytics' },

  // 🏥 醫療相關 (Medical Icons)
  hospital: { zh: '醫院', en: 'Hospital', icon: 'fas fa-hospital' },
  clinic: { zh: '診所', en: 'Clinic', icon: 'fas fa-clinic-medical' },
  pharmacy: { zh: '藥局', en: 'Pharmacy', icon: 'fas fa-pills' },
  elderly_care: { zh: '長照', en: 'Elderly Care', icon: 'fas fa-hands-helping' },
  medical: { zh: '醫療', en: 'Medical', icon: 'fas fa-user-md' },

  // 👥 人口和社會 (Population & Social Icons)
  population: { zh: '人口', en: 'Population', icon: 'fas fa-users' },
  demographics: { zh: '人口統計', en: 'Demographics', icon: 'fas fa-user-friends' },
  community: { zh: '社區', en: 'Community', icon: 'fas fa-home' },

  // 💰 經濟相關 (Economic Icons)
  income: { zh: '收入', en: 'Income', icon: 'fas fa-dollar-sign' },
  tax: { zh: '稅收', en: 'Tax', icon: 'fas fa-file-invoice-dollar' },

  // 🎛️ 操作和控制 (Control & Action Icons)
  drag: { zh: '拖拉', en: 'Drag', icon: 'fa-solid fa-grip-lines-vertical' },
  move_up: { zh: '上移', en: 'Move Up', icon: 'fas fa-arrow-up' },
  move_down: { zh: '下移', en: 'Move Down', icon: 'fas fa-arrow-down' },

  // ⚙️ 設定和配置 (Settings & Configuration Icons)
  settings: { zh: '設定', en: 'Settings', icon: 'fas fa-cog' },
  sort_up: { zh: '升序', en: 'Sort Ascending', icon: 'fas fa-sort-up' },
  sort_down: { zh: '降序', en: 'Sort Descending', icon: 'fas fa-sort-down' },

  // 📁 檔案和資料夾 (File & Folder Icons)
  folder: { zh: '資料夾', en: 'Folder', icon: 'fas fa-folder' },
  folder_open: { zh: '開啟資料夾', en: 'Open Folder', icon: 'fas fa-folder-open' },
  file: { zh: '檔案', en: 'File', icon: 'fas fa-file' },

  // ℹ️ 資訊和狀態 (Information & Status Icons)
  information: { zh: '資訊', en: 'Information', icon: 'fas fa-info-circle' },
  alert: { zh: '警告', en: 'Warning', icon: 'fas fa-exclamation-triangle' },
  failure: { zh: '錯誤', en: 'Error', icon: 'fas fa-times-circle' },
  complete: { zh: '成功', en: 'Success', icon: 'fas fa-check-circle' },

  // 🔄 狀態轉換 (State Transition Icons)
  reset: { zh: '重設', en: 'Reset', icon: 'fas fa-undo' },

  // 📱 介面元素 (UI Element Icons)
  menu: { zh: '選單', en: 'Menu', icon: 'fas fa-bars' },
  close: { zh: '關閉', en: 'Close', icon: 'fas fa-times' },
};

// =================================================================================
// 🛠️ 輔助函數 (Helper Functions)
// =================================================================================

/**
 * 🎨 根據鍵名獲取圖標資訊 (Get Icon Information by Key)
 *
 * 根據提供的圖標鍵名和語言參數，返回對應的圖標資訊物件。
 * 支援中文和英文兩種語言，如果指定的語言不存在則回退到中文。
 *
 * @param {string} iconKey - 圖標鍵名，對應 ICONS 物件中的鍵
 * @param {string} [lang='zh'] - 語言代碼，支援 'zh'（中文）或 'en'（英文）
 * @returns {Object} 包含文字和圖標類名的物件
 * @returns {string} returns.text - 對應語言的文字描述
 * @returns {string} returns.icon - Font Awesome 圖標類名
 *
 * @example
 * // 獲取中文圖標資訊
 * const icon = getIcon('add', 'zh');
 * console.log(icon.text); // '新增'
 * console.log(icon.icon); // 'fas fa-plus'
 *
 * // 獲取英文圖標資訊
 * const iconEn = getIcon('add', 'en');
 * console.log(iconEn.text); // 'Add'
 * console.log(iconEn.icon); // 'fas fa-plus'
 *
 * // 處理不存在的圖標鍵
 * const unknownIcon = getIcon('unknown');
 * console.log(unknownIcon.text); // 'unknown'
 * console.log(unknownIcon.icon); // 'fas fa-question-circle'
 */
export function getIcon(iconKey, lang = 'zh') {
  // 從圖標映射表中查找對應的圖標配置
  const iconInfo = ICONS[iconKey];

  // 如果找不到對應的圖標配置，返回預設值並輸出警告
  if (!iconInfo) {
    console.warn(`找不到圖標定義: ${iconKey}`);
    return {
      text: iconKey, // 使用原始鍵名作為文字
      icon: 'fas fa-question-circle', // 使用問號圖標作為預設
    };
  }

  // 返回包含文字和圖標類名的物件
  return {
    text: iconInfo[lang] || iconInfo.zh, // 優先使用指定語言，回退到中文
    icon: iconInfo.icon, // Font Awesome 圖標類名
  };
}

/**
 * 🗺️ 定義存儲模組 (Define Store Module)
 *
 * 管理應用程式的全局配置和設定，包括底圖選擇和地圖視圖狀態。
 * 主要功能：
 * - 管理底圖配置和選擇
 * - 保存地圖視圖狀態（中心點、縮放級別）
 * - 提供底圖切換功能
 *
 * 技術架構：
 * - Pinia 狀態管理
 * - 響應式狀態更新
 * - 模組化配置管理
 */

import { defineStore } from 'pinia';

export const useDefineStore = defineStore('define', {
  state: () => ({
    // 🗺️ 當前選中的底圖類型（固定為標準地圖）
    selectedBasemap: 'carto_dark',

    // 🗺️ 地圖視圖狀態
    mapView: {
      center: [25.04583, 121.51972], // 地圖中心點 [緯度, 經度] - 台灣
      zoom: 16, // 縮放等級（調整到16級，顯示詳細的內容）
    },
    // 🗺️ 底圖配置列表（僅保留標準地圖）
    basemaps: [
      {
        label: 'Carto Dark',
        value: 'carto_dark',
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      },
    ],
  }),
  actions: {
    /**
     * 🗺️ 設定選中的底圖
     * @param {string} value - 底圖類型值
     */
    setSelectedBasemap(value) {
      this.selectedBasemap = value;
    },

    /**
     * 🗺️ 設定地圖視圖狀態
     * @param {Array} center - 地圖中心點 [緯度, 經度]
     * @param {number} zoom - 縮放級別
     */
    setMapView(center, zoom) {
      this.mapView.center = center;
      this.mapView.zoom = zoom;
    },
  },
});

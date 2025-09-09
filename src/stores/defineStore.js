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
    // 🗺️ 當前選中的底圖類型
    selectedBasemap: 'carto_light_labels',

    // 🗺️ 地圖視圖狀態
    mapView: {
      center: [25.051474, 121.557989], // 地圖中心點 [緯度, 經度] - 台北市中心
      zoom: 11, // 縮放等級
    },
    // 🗺️ 底圖配置列表
    basemaps: [
      {
        label: 'OpenStreetMap',
        value: 'osm',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      },
      {
        label: 'Esri Street',
        value: 'esri_street',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      },
      {
        label: 'Esri Topo',
        value: 'esri_topo',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      },
      {
        label: 'Esri World Imagery',
        value: 'esri_imagery',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      },
      {
        label: 'Google Maps 街道',
        value: 'google_road',
        url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      },
      {
        label: 'Google Maps 衛星',
        value: 'google_satellite',
        url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      },
      {
        label: '國土規劃中心電子地圖',
        value: 'nlsc_emap',
        url: 'https://wmts.nlsc.gov.tw/wmts/EMAP/default/GoogleMapsCompatible/{z}/{y}/{x}',
      },
      {
        label: '國土規劃中心正射影像',
        value: 'nlsc_photo',
        url: 'https://wmts.nlsc.gov.tw/wmts/PHOTO2/default/GoogleMapsCompatible/{z}/{y}/{x}',
      },
      {
        label: '地形圖',
        value: 'terrain',
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      },
      {
        label: 'Carto Light',
        value: 'carto_light_labels',
        url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      },
      {
        label: 'Carto Dark',
        value: 'carto_dark_labels',
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      },
      {
        label: 'Carto Voyager',
        value: 'carto_voyager',
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      },
      {
        label: '白色地圖',
        value: 'blank',
        url: '',
      },
      {
        label: '黑色底圖',
        value: 'black',
        url: '',
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

// 城市 GeoJSON 載入器
export async function loadCityGeoJson(layer) {
  try {
    const layerId = layer.layerId;
    const colorName = layer.colorName;

    const filePath = `/30DayMapChallenge-02_Lines/data/geojson/${layer.fileName}`;

    const response = await fetch(filePath);

    if (!response.ok) {
      console.error('HTTP 錯誤:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const geoJsonData = await response.json();

    // 處理 GeoJSON 特徵
    geoJsonData.features.forEach((feature, index) => {
      feature.properties.id = index + 1;
      feature.properties.layerId = layerId;
      feature.properties.layerName = layer.layerName;
      feature.properties.name = feature.properties.name || layerId;
      feature.properties.color = `var(--my-color-${colorName})`;
      feature.properties.fillColor = `var(--my-color-${colorName})`;

      const propertyData = {
        城市: feature.properties.name,
        ...feature.properties,
      };

      const popupData = {
        城市: feature.properties.name,
      };

      feature.properties.propertyData = propertyData;
      feature.properties.popupData = popupData;
    });

    return {
      geoJsonData, // 包含地理數據
    };
  } catch (error) {
    console.error('❌ 城市 GeoJSON 數據載入失敗:', error);
    throw error;
  }
}

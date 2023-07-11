export const BASE_URL = import.meta.env.MODE === 'development' ? '' : 'https://read.homestuck.net';
export const ASSET_BASE_URL = `${BASE_URL}/collection`;
export const MSPA_JSON_URL = `${ASSET_BASE_URL}/mspa.json`;
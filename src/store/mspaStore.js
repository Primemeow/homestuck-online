import { defineStore } from 'pinia'
import * as fetchAssets from '../helpers/fetchAssets'

export const useMspaStore = defineStore({
  id: 'mspaStore',
  state: () => ({
    mspaJson: null,
    currentPage: null,
    isLoading: false,
  }),
  actions: {
    async fetchMSPAJson() {
      this.isLoading = true
      this.mspaJson = await fetchAssets.fetchMSPAJson()
      this.isLoading = false
    },
    async fetchPage({ story, page }) {
      this.isLoading = true
      if (!this.mspaJson) return
      console.log(`Fetching page ${page} of ${story}`);
      const pageData = this.mspaJson.story[page]
      if (!pageData) return
      console.log('Page data:', pageData);
      this.currentPage = {
        ...pageData,
        assets: await fetchAssets.fetchImageAssets(pageData.media),
      }
      this.isLoading = false
    },
  },
})

import type { SettingsFormValidator } from '@/app/(dashboard)/[storeId]/(routes)/settings/components/settings-form';
import type { createStoreFormValidator } from '@/components/modals/store-modal'
import axios from 'axios'

class StoreService {
  private baseUrl = 'https://e-commerce-next-js-admin-six.vercel.app/api'

  constructor() {
    this.createStore = this.createStore.bind(this)
  }

  async createStore(body: createStoreFormValidator) {
    return axios.post(`${this.baseUrl}/stores`, body)
  }

  async updateStore(body: SettingsFormValidator, storeId: string) {
    return axios.patch(`${this.baseUrl}/stores/${storeId}`, body)
  }

  async deleteStore(storeId: string) {
    return axios.delete(`${this.baseUrl}/stores/${storeId}`)
  }
}

const storeService = new StoreService()

export default storeService
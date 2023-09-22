import { createStoreFormValidator } from '@/components/modals/store-modal'
import axios from 'axios'

class StoreService {
  private baseUrl = 'http://localhost:3000/api'

  constructor() {
    this.createStore = this.createStore.bind(this)
  }

  async createStore(body: createStoreFormValidator) {
    console.log(this);

    return axios.post(`${this.baseUrl}/stores`, body)
  }
}

const storeService = new StoreService()

export default storeService
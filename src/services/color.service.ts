
import { ColorFormValidator } from '@/app/(dashboard)/[storeId]/(routes)/colors/[sizeId]/components/color-form'
import axios from 'axios'

class ColorService {
  private baseUrl = 'http://localhost:3000/api'

  constructor() {
  }

  async createColor(storeId: string, body: ColorFormValidator) {
    return axios.post(`${this.baseUrl}/${storeId}/colors`, body)
  }

  async updateColor(storeId: string, colorId: string, body: ColorFormValidator) {
    return axios.patch(`/api/${storeId}/colors/${colorId}`, body)
  }

  async deleteColor(storeId: string, colorId: string) {
    return axios.delete(`/api/${storeId}/colors/${colorId}`)
  }
}

const colorService = new ColorService()

export default colorService
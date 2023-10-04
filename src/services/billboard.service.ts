import type { BillboardFormValidator } from '@/app/(dashboard)/[storeId]/(routes)/billboards/[billboardId]/components/billboard-form'
import axios from 'axios'

class BillboardService {
  private baseUrl = 'https://e-commerce-next-js-admin-six.vercel.app/api'

  constructor() {
  }

  async createBillboard(storeId: string, body: BillboardFormValidator) {
    return axios.post(`${this.baseUrl}/${storeId}/billboards`, body)
  }

  async updateBillboard(storeId: string, billboardId: string, body: BillboardFormValidator) {
    return axios.patch(`/api/${storeId}/billboards/${billboardId}`, body)
  }

  async deleteBillboard(storeId: string, billboardId: string) {
    return axios.delete(`/api/${storeId}/billboards/${billboardId}`)
  }
}

const billboardService = new BillboardService()

export default billboardService
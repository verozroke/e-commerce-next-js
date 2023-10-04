
import { SizeFormValidator } from '@/app/(dashboard)/[storeId]/(routes)/sizes/[sizeId]/components/size-form'
import axios from 'axios'

class SizeService {
  private baseUrl = 'https://e-commerce-next-js-admin-six.vercel.app/api'

  constructor() {
  }

  async createSize(storeId: string, body: SizeFormValidator) {
    return axios.post(`${this.baseUrl}/${storeId}/sizes`, body)
  }

  async updateSize(storeId: string, sizeId: string, body: SizeFormValidator) {
    return axios.patch(`/api/${storeId}/sizes/${sizeId}`, body)
  }

  async deleteSize(storeId: string, sizeId: string) {
    return axios.delete(`/api/${storeId}/sizes/${sizeId}`)
  }
}

const sizeService = new SizeService()

export default sizeService
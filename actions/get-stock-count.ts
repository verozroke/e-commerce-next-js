import db from "@/lib/prisma.db"

export const getStockCount = async (storeId: string) => {
  const stockCount = await db.product.count({
    where: {
      storeId,
      isArchived: false
    }
  })



  return stockCount
}
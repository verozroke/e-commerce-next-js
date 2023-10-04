import db from '@/lib/prisma.db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from "next/server";



export async function GET(req: Request, { params }: { params: { storeId: string, productId: string } }) {
  try {



    if (!params.storeId) {
      return new NextResponse('storeId is required', { status: 400 })
    }

    const isExist = db.store.findUnique({
      where: {
        id: params.storeId,
      }
    })

    if (!isExist) {
      return new NextResponse(`Invalid storeID. This store does not exist`, { status: 400 })
    }



    const product = await db.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        image: true,
        category: true,
        size: true,
        color: true,
      }
    })

    return NextResponse.json(product)

  } catch (error) {
    console.log('[PRODUCT_GET]', error);

    return new NextResponse("Internal error", { status: 500 })

  }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, productId: string } }) {
  try {

    const { userId } = auth()
    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      image,
      isFeatured,
      isArchived,
    } = await req.json()



    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!name) {
      return new NextResponse(`name is required`, { status: 400 })
    }
    if (!price) {
      return new NextResponse(`price is required`, { status: 400 })
    }
    if (!categoryId) {
      return new NextResponse(`categoryId is required`, { status: 400 })
    }
    if (!colorId) {
      return new NextResponse(`colorId is required`, { status: 400 })
    }
    if (!sizeId) {
      return new NextResponse(`sizeId is required`, { status: 400 })
    }
    if (!image) {
      return new NextResponse(`image is required`, { status: 400 })
    }

    if (!params.storeId) {
      return new NextResponse('storeId is required', { status: 400 })
    }

    const isExist = db.store.findUnique({
      where: {
        id: params.storeId,
        userId,
      }
    })

    if (!isExist) {
      return new NextResponse(`Invalid storeID. This store does not exist`, { status: 400 })
    }


    await db.product.update({
      where: {
        id: params.productId
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        image: {
          delete: {}
        },
        isFeatured,
        isArchived,
      }
    })

    const product = await db.product.update({
      where: {
        id: params.productId
      },
      data: {
        image: {
          create: {
            url: image.url
          }
        }
      }
    })



    return NextResponse.json({
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      image,
      isFeatured,
      isArchived,
    })

  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);

    return new NextResponse("Internal error", { status: 500 })

  }
}




export async function DELETE(req: Request, { params }: { params: { storeId: string, productId: string } }) {
  try {

    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.storeId) {
      return new NextResponse('storeId is required', { status: 400 })
    }

    const isExist = db.store.findUnique({
      where: {
        id: params.storeId,
        userId,
      }
    })

    if (!isExist) {
      return new NextResponse(`Invalid storeID. This store does not exist`, { status: 400 })
    }



    const product = await db.product.deleteMany({
      where: {
        id: params.productId,
      }
    })

    return NextResponse.json(product)

  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);

    return new NextResponse("Internal error", { status: 500 })

  }
}
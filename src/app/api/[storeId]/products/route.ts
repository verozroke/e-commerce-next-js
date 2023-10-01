import db from "@/lib/prisma.db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request, { params }: { params: { storeId: string } }
) {
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

    const { storeId } = params




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


    if (!storeId) {
      return new NextResponse(`StoreId is required`, { status: 400 })
    }


    const isExist = db.store.findUnique({
      where: {
        id: storeId,
        userId,
      }
    })

    if (!isExist) {
      return new NextResponse(`Invalid storeID. This store does not exist`, { status: 400 })
    }


    const product = await db.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        image: {
          create: {
            url: image.url
          }
        },
        isFeatured,
        isArchived,
        storeId,
      }
    })


    return NextResponse.json(product)

  } catch (err) {
    console.log('[PRODUCTS_POST]', err);

    return new NextResponse("Internal error", { status: 500 })

  }
}

export async function GET(
  req: Request, { params }: { params: { storeId: string } }
) {
  try {

    const { searchParams } = new URL(req.url)
    const { userId } = auth()

    const categoryId = searchParams.get('categoryId') || undefined
    const colorId = searchParams.get('categoryId') || undefined
    const sizeId = searchParams.get('categoryId') || undefined
    const isFeatured = searchParams.get('categoryId') || undefined

    const { storeId } = params


    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const products = await db.product.findMany({
      where: {
        storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false
      },
      include: {
        image: true,
        category: true,
        color: true,
        size: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })


    return NextResponse.json(products)

  } catch (err) {
    console.log('[PRODUCTS_GET]', err);

    return new NextResponse("Internal error", { status: 500 })

  }
}
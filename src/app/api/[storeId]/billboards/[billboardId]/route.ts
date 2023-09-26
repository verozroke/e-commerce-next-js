import db from '@/lib/prisma.db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from "next/server";



export async function GET(req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
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



    const billboard = await db.billboard.findUnique({
      where: {
        id: params.billboardId,
      }
    })

    return NextResponse.json(billboard)

  } catch (error) {
    console.log('[STORE_DELETE]', error);

    return new NextResponse("Internal error", { status: 500 })

  }
}

export async function PATCH(req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
  try {

    const { userId } = auth()
    const { label, imageUrl } = await req.json()



    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!label || !imageUrl) {
      return new NextResponse(`Label and ImageUrl is required`, { status: 400 })
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


    const billboard = await db.billboard.updateMany({
      where: {
        id: params.billboardId
      },
      data: {
        label,
        imageUrl,
      }
    })



    return NextResponse.json({ label, imageUrl })

  } catch (error) {
    console.log('[BILLBOARD_PATCH]', error);

    return new NextResponse("Internal error", { status: 500 })

  }
}




export async function DELETE(req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
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



    const billboard = await db.billboard.deleteMany({
      where: {
        id: params.billboardId,
      }
    })

    return NextResponse.json(billboard)

  } catch (error) {
    console.log('[STORE_DELETE]', error);

    return new NextResponse("Internal error", { status: 500 })

  }
}
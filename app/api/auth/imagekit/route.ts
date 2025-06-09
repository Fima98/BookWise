import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";

import config from "@/lib/config";

const {
  env: {
    imagekit: { privateKey, publicKey },
  },
} = config;

export async function GET() {
  if (!publicKey || !privateKey) {
    return NextResponse.json(
      { message: "ImageKit credentials are not configured on the server." },
      { status: 500 }
    );
  }

  const params = getUploadAuthParams({
    privateKey,
    publicKey,
  });

  return NextResponse.json({
    ...params,
    publicKey,
  });
}

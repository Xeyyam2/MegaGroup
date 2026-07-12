import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expectedToken = process.env.REVALIDATE_SECRET || "megagroup-revalidate-2026";

  if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Purge data-level caches
    revalidateTag("countries", "default");
    revalidateTag("universities", "default");
    revalidateTag("site-content", "default");

    // Purge page-level ISR caches for all locale variants
    const locales = ["az", "ru", "en"];
    const paths = [
      "/",
      "/xaricde-tehsil",
      "/xaricde-tehsil/hesabla",
      "/xaricde-tehsil/muraciet",
      "/haqqimizda",
    ];
    const countrySlugs = [
      "turkiye", "rusiya", "gurcustan", "ukrayna", "qazaxistan", "almaniya", "polsa",
    ];
    const universitySlugs = [
      "giresun-universiteti", "istanbul-universiteti",
      "moskva-dovlet-universiteti", "sankt-peterburg-universiteti",
      "kiev-tibb-universiteti", "lvov-universiteti",
      "munchen-texniki-universiteti", "berlin-universiteti",
      "varşava-tibb-universiteti", "krakov-tibb-universiteti",
      "tbilisi-dovlet-tibb-universiteti", "batumi-shota-rustaveli-universiteti",
      "al-farabi-qazax-milli-universiteti", "nazarbayev-universiteti",
    ];

    for (const locale of locales) {
      for (const path of paths) {
        revalidatePath(`/${locale}${path}`, "page");
      }
      for (const slug of countrySlugs) {
        revalidatePath(`/${locale}/xaricde-tehsil/${slug}`, "page");
      }
      for (const slug of universitySlugs) {
        revalidatePath(`/${locale}/xaricde-tehsil/${slug.split("-")[0]}/${slug}`, "page");
      }
    }

    // Also revalidate the layout
    revalidatePath("/", "layout");

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      message: "All caches purged successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Revalidation failed", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // Also allow GET with ?secret= param for easy browser testing
  const secret = req.nextUrl.searchParams.get("secret");
  const expectedToken = process.env.REVALIDATE_SECRET || "megagroup-revalidate-2026";

  if (secret !== expectedToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    revalidateTag("countries", "default");
    revalidateTag("universities", "default");
    revalidateTag("site-content", "default");
    revalidatePath("/", "layout");

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

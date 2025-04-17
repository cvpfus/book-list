"use server";

import { headers } from "next/headers";

export async function getBaseUrl() {
  const head = await headers();
  const host = head.get("host");

  const isLocalhost = host?.includes("localhost");

  const protocol = isLocalhost ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  return baseUrl;
}

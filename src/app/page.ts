import { Metadata } from "next";

import MainPage, {
  generateMetadata as mainGenerateMetaData,
} from "./[encoded]/page";

const DEFAULT = "u7JZfSsPWUn6VneWnmXnvYvY24dxcm0MqAkCBkKCkSDk-wss";

export default async function Page() {
  return MainPage({ params: { encoded: DEFAULT } });
}

export function generateMetadata(): Metadata {
  return mainGenerateMetaData({ params: { encoded: DEFAULT } });
}

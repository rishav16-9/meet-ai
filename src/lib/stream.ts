import "server-only";
import { StreamClient } from "@stream-io/node-sdk";

export const streamClient = new StreamClient(
  process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!,
  process.env.STREAM_CHAT_SECRET_KEY!
);

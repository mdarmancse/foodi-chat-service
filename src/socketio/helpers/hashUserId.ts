import { PartitionCount } from "../constants";

export function hashUserId(id: string | number) {
  const t = id.toString().replaceAll("-", "");
  const h =
    parseInt(t.substring(Math.max(0, t.length - 4)), 16) % PartitionCount;
  return h;
}

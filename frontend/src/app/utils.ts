import { backendDatetimeType } from "./types/backend-datetime";
import { usersCache } from "./cache/users-cache";
import { User } from "./models/user";

export function backendDatetimeToDateObject(date: backendDatetimeType): Date {
  return new Date(Date.parse(date));
}

export function getBackendDatetimeAge(date_: backendDatetimeType): string {
  const date: Date = backendDatetimeToDateObject(date_);
  const now: Date = new Date();
  const seconds: number = now.getUTCSeconds() - date.getUTCSeconds();
  const minutes: number = now.getUTCMinutes() - date.getUTCMinutes();
  const hours: number = now.getUTCHours() - date.getUTCHours();
  const days: number = now.getUTCDate() - date.getUTCDate();
  const months: number = now.getUTCMonth() - date.getUTCMonth();
  const years: number = now.getUTCFullYear() - date.getUTCFullYear();
  if (years !== 0)
    return `${years} years ago`;
  else if (months !== 0)
    return `${months} months ago`;
  else if (days !== 0)
    return `${days} days ago`;
  else if (hours !== 0)
    return `${hours} hours ago`;
  else if (minutes !== 0)
    return `${minutes} minutes ago`
  else
    return `${seconds} seconds ago`;
}

export function getUserFromCache(pk: number): User | undefined {
  return usersCache.find((user: User): boolean => user.pk === pk);
}


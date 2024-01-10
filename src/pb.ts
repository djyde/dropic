import PocketBase from 'pocketbase'
export const pb = new PocketBase(import.meta.env.PROD ? "/" : "http://localhost:8090")
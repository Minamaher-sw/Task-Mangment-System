import { getCache } from "../services/cacheService.js";

export const cacheMiddleware = async (req, res, next) => {
  const key = req.originalUrl; // unique key per route
  const cachedData = await getCache(key);
  if (cachedData) return res.json(cachedData);
  next();
};

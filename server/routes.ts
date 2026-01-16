import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // === Locations API ===
  
  // List all saved locations
  app.get(api.locations.list.path, async (req, res) => {
    const locations = await storage.getLocations();
    res.json(locations);
  });

  // Create a new location
  app.post(api.locations.create.path, async (req, res) => {
    try {
      const input = api.locations.create.input.parse(req.body);
      const location = await storage.createLocation(input);
      res.status(201).json(location);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Delete a location
  app.delete(api.locations.delete.path, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(404).json({ message: "Invalid ID" });
    }
    await storage.deleteLocation(id);
    res.status(204).send();
  });

  // Seed data if empty
  const existingLocations = await storage.getLocations();
  if (existingLocations.length === 0) {
    await storage.createLocation({ name: "New York", lat: 40.7128, lon: -74.0060 });
    await storage.createLocation({ name: "London", lat: 51.5074, lon: -0.1278 });
    await storage.createLocation({ name: "Tokyo", lat: 35.6762, lon: 139.6503 });
  }

  return httpServer;
}

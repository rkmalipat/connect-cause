import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, insertInitiativeSchema, insertStorySchema, 
  insertMessageSchema, insertDonationSchema, insertSupportSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Login failed" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Failed to get user" });
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      const { type } = req.query;
      let users;
      
      if (type) {
        users = await storage.getUsersByType(type as string);
      } else {
        users = await storage.getUsersByType("donor"); // Default to donors for browsing
      }

      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(400).json({ message: "Failed to get users" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(parseInt(req.params.id), updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Failed to update user" });
    }
  });

  // Initiative routes
  app.get("/api/initiatives", async (req, res) => {
    try {
      const { category, runner } = req.query;
      let initiatives;

      if (category) {
        initiatives = await storage.getInitiativesByCategory(category as string);
      } else if (runner) {
        initiatives = await storage.getInitiativesByRunner(parseInt(runner as string));
      } else {
        initiatives = await storage.getInitiatives();
      }

      res.json(initiatives);
    } catch (error) {
      res.status(400).json({ message: "Failed to get initiatives" });
    }
  });

  app.get("/api/initiatives/:id", async (req, res) => {
    try {
      const initiative = await storage.getInitiative(parseInt(req.params.id));
      if (!initiative) {
        return res.status(404).json({ message: "Initiative not found" });
      }
      res.json(initiative);
    } catch (error) {
      res.status(400).json({ message: "Failed to get initiative" });
    }
  });

  app.post("/api/initiatives", async (req, res) => {
    try {
      const initiativeData = insertInitiativeSchema.parse(req.body);
      const initiative = await storage.createInitiative(initiativeData);
      res.json(initiative);
    } catch (error) {
      res.status(400).json({ message: "Invalid initiative data" });
    }
  });

  app.put("/api/initiatives/:id", async (req, res) => {
    try {
      const updates = req.body;
      const initiative = await storage.updateInitiative(parseInt(req.params.id), updates);
      if (!initiative) {
        return res.status(404).json({ message: "Initiative not found" });
      }
      res.json(initiative);
    } catch (error) {
      res.status(400).json({ message: "Failed to update initiative" });
    }
  });

  // Story routes
  app.get("/api/stories", async (req, res) => {
    try {
      const { author, initiative } = req.query;
      let stories;

      if (author) {
        stories = await storage.getStoriesByAuthor(parseInt(author as string));
      } else if (initiative) {
        stories = await storage.getStoriesByInitiative(parseInt(initiative as string));
      } else {
        stories = await storage.getStories();
      }

      res.json(stories);
    } catch (error) {
      res.status(400).json({ message: "Failed to get stories" });
    }
  });

  app.get("/api/stories/:id", async (req, res) => {
    try {
      const story = await storage.getStory(parseInt(req.params.id));
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }
      res.json(story);
    } catch (error) {
      res.status(400).json({ message: "Failed to get story" });
    }
  });

  app.post("/api/stories", async (req, res) => {
    try {
      const storyData = insertStorySchema.parse(req.body);
      const story = await storage.createStory(storyData);
      res.json(story);
    } catch (error) {
      res.status(400).json({ message: "Invalid story data" });
    }
  });

  app.put("/api/stories/:id", async (req, res) => {
    try {
      const updates = req.body;
      const story = await storage.updateStory(parseInt(req.params.id), updates);
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }
      res.json(story);
    } catch (error) {
      res.status(400).json({ message: "Failed to update story" });
    }
  });

  // Message routes
  app.get("/api/conversations/:userId", async (req, res) => {
    try {
      const conversations = await storage.getConversationsForUser(parseInt(req.params.userId));
      res.json(conversations);
    } catch (error) {
      res.status(400).json({ message: "Failed to get conversations" });
    }
  });

  app.get("/api/messages/:user1Id/:user2Id", async (req, res) => {
    try {
      const messages = await storage.getMessagesBetweenUsers(
        parseInt(req.params.user1Id),
        parseInt(req.params.user2Id)
      );
      res.json(messages);
    } catch (error) {
      res.status(400).json({ message: "Failed to get messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  app.put("/api/messages/:id/read", async (req, res) => {
    try {
      const message = await storage.markMessageAsRead(parseInt(req.params.id));
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Failed to mark message as read" });
    }
  });

  // Donation routes
  app.get("/api/donations", async (req, res) => {
    try {
      const { donor, initiative } = req.query;
      let donations;

      if (donor) {
        donations = await storage.getDonationsByDonor(parseInt(donor as string));
      } else if (initiative) {
        donations = await storage.getDonationsByInitiative(parseInt(initiative as string));
      } else {
        return res.status(400).json({ message: "Must specify donor or initiative" });
      }

      res.json(donations);
    } catch (error) {
      res.status(400).json({ message: "Failed to get donations" });
    }
  });

  app.post("/api/donations", async (req, res) => {
    try {
      const donationData = insertDonationSchema.parse(req.body);
      const donation = await storage.createDonation(donationData);
      res.json(donation);
    } catch (error) {
      res.status(400).json({ message: "Invalid donation data" });
    }
  });

  // Support routes
  app.get("/api/supports", async (req, res) => {
    try {
      const { donor, beneficiary } = req.query;
      let supports;

      if (donor) {
        supports = await storage.getSupportsByDonor(parseInt(donor as string));
      } else if (beneficiary) {
        supports = await storage.getSupportsByBeneficiary(parseInt(beneficiary as string));
      } else {
        return res.status(400).json({ message: "Must specify donor or beneficiary" });
      }

      res.json(supports);
    } catch (error) {
      res.status(400).json({ message: "Failed to get supports" });
    }
  });

  app.post("/api/supports", async (req, res) => {
    try {
      const supportData = insertSupportSchema.parse(req.body);
      const support = await storage.createSupport(supportData);
      res.json(support);
    } catch (error) {
      res.status(400).json({ message: "Invalid support data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

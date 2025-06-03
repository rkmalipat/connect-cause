import { 
  users, initiatives, stories, messages, donations, supports,
  type User, type InsertUser, type Initiative, type InsertInitiative,
  type Story, type InsertStory, type Message, type InsertMessage,
  type Donation, type InsertDonation, type Support, type InsertSupport
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  getUsersByType(userType: string): Promise<User[]>;

  // Initiatives
  getInitiative(id: number): Promise<Initiative | undefined>;
  getInitiatives(): Promise<Initiative[]>;
  getInitiativesByRunner(runnerId: number): Promise<Initiative[]>;
  createInitiative(initiative: InsertInitiative): Promise<Initiative>;
  updateInitiative(id: number, updates: Partial<Initiative>): Promise<Initiative | undefined>;
  getInitiativesByCategory(category: string): Promise<Initiative[]>;
  getInitiativesByCountry(country: string): Promise<Initiative[]>;
  getAvailableCountries(): Promise<string[]>;

  // Stories
  getStory(id: number): Promise<Story | undefined>;
  getStories(): Promise<Story[]>;
  getStoriesByAuthor(authorId: number): Promise<Story[]>;
  getStoriesByInitiative(initiativeId: number): Promise<Story[]>;
  createStory(story: InsertStory): Promise<Story>;
  updateStory(id: number, updates: Partial<Story>): Promise<Story | undefined>;

  // Messages
  getMessage(id: number): Promise<Message | undefined>;
  getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]>;
  getConversationsForUser(userId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;

  // Donations
  getDonation(id: number): Promise<Donation | undefined>;
  getDonationsByDonor(donorId: number): Promise<Donation[]>;
  getDonationsByInitiative(initiativeId: number): Promise<Donation[]>;
  createDonation(donation: InsertDonation): Promise<Donation>;

  // Supports
  getSupport(id: number): Promise<Support | undefined>;
  getSupportsByDonor(donorId: number): Promise<Support[]>;
  getSupportsByBeneficiary(beneficiaryId: number): Promise<Support[]>;
  createSupport(support: InsertSupport): Promise<Support>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private initiatives: Map<number, Initiative>;
  private stories: Map<number, Story>;
  private messages: Map<number, Message>;
  private donations: Map<number, Donation>;
  private supports: Map<number, Support>;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.initiatives = new Map();
    this.stories = new Map();
    this.messages = new Map();
    this.donations = new Map();
    this.supports = new Map();
    this.currentId = {
      users: 1,
      initiatives: 1,
      stories: 1,
      messages: 1,
      donations: 1,
      supports: 1,
    };
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { 
      ...insertUser,
      id,
      avatar: insertUser.avatar || null,
      bio: insertUser.bio || null,
      location: insertUser.location || null,
      country: insertUser.country || "United States",
      verified: insertUser.verified || null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUsersByType(userType: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.userType === userType);
  }

  // Initiatives
  async getInitiative(id: number): Promise<Initiative | undefined> {
    return this.initiatives.get(id);
  }

  async getInitiatives(): Promise<Initiative[]> {
    return Array.from(this.initiatives.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getInitiativesByRunner(runnerId: number): Promise<Initiative[]> {
    return Array.from(this.initiatives.values()).filter(initiative => 
      initiative.runnerId === runnerId
    );
  }

  async createInitiative(insertInitiative: InsertInitiative): Promise<Initiative> {
    const id = this.currentId.initiatives++;
    const initiative: Initiative = { 
      ...insertInitiative,
      id,
      raisedAmount: 0,
      supportersCount: 0,
      country: insertInitiative.country || "United States",
      coverImage: insertInitiative.coverImage || null,
      status: insertInitiative.status || "active",
      createdAt: new Date()
    };
    this.initiatives.set(id, initiative);
    return initiative;
  }

  async updateInitiative(id: number, updates: Partial<Initiative>): Promise<Initiative | undefined> {
    const initiative = this.initiatives.get(id);
    if (!initiative) return undefined;
    
    const updatedInitiative = { ...initiative, ...updates };
    this.initiatives.set(id, updatedInitiative);
    return updatedInitiative;
  }

  async getInitiativesByCategory(category: string): Promise<Initiative[]> {
    return Array.from(this.initiatives.values()).filter(initiative => 
      initiative.category === category
    );
  }

  async getInitiativesByCountry(country: string): Promise<Initiative[]> {
    return Array.from(this.initiatives.values()).filter(initiative => 
      initiative.country === country
    );
  }

  async getAvailableCountries(): Promise<string[]> {
    const countries = new Set<string>();
    Array.from(this.initiatives.values()).forEach(initiative => {
      countries.add(initiative.country);
    });
    return Array.from(countries).sort();
  }

  // Stories
  async getStory(id: number): Promise<Story | undefined> {
    return this.stories.get(id);
  }

  async getStories(): Promise<Story[]> {
    return Array.from(this.stories.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getStoriesByAuthor(authorId: number): Promise<Story[]> {
    return Array.from(this.stories.values()).filter(story => 
      story.authorId === authorId
    );
  }

  async getStoriesByInitiative(initiativeId: number): Promise<Story[]> {
    return Array.from(this.stories.values()).filter(story => 
      story.initiativeId === initiativeId
    );
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const id = this.currentId.stories++;
    const story: Story = { 
      ...insertStory,
      id,
      heartsCount: 0,
      mediaUrl: insertStory.mediaUrl || null,
      mediaType: insertStory.mediaType || null,
      initiativeId: insertStory.initiativeId || null,
      createdAt: new Date()
    };
    this.stories.set(id, story);
    return story;
  }

  async updateStory(id: number, updates: Partial<Story>): Promise<Story | undefined> {
    const story = this.stories.get(id);
    if (!story) return undefined;
    
    const updatedStory = { ...story, ...updates };
    this.stories.set(id, updatedStory);
    return updatedStory;
  }

  // Messages
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesBetweenUsers(user1Id: number, user2Id: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => 
        (message.senderId === user1Id && message.receiverId === user2Id) ||
        (message.senderId === user2Id && message.receiverId === user1Id)
      )
      .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
  }

  async getConversationsForUser(userId: number): Promise<Message[]> {
    const userMessages = Array.from(this.messages.values())
      .filter(message => message.senderId === userId || message.receiverId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

    // Get the latest message for each conversation
    const conversations = new Map<number, Message>();
    userMessages.forEach(message => {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      if (!conversations.has(otherUserId)) {
        conversations.set(otherUserId, message);
      }
    });

    return Array.from(conversations.values());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentId.messages++;
    const message: Message = { 
      ...insertMessage, 
      id,
      read: false,
      createdAt: new Date()
    };
    this.messages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const message = this.messages.get(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, read: true };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }

  // Donations
  async getDonation(id: number): Promise<Donation | undefined> {
    return this.donations.get(id);
  }

  async getDonationsByDonor(donorId: number): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(donation => 
      donation.donorId === donorId
    );
  }

  async getDonationsByInitiative(initiativeId: number): Promise<Donation[]> {
    return Array.from(this.donations.values()).filter(donation => 
      donation.initiativeId === initiativeId
    );
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const id = this.currentId.donations++;
    const donation: Donation = { 
      ...insertDonation,
      id,
      message: insertDonation.message || null,
      anonymous: insertDonation.anonymous || null,
      createdAt: new Date()
    };
    this.donations.set(id, donation);

    // Update initiative raised amount and supporters count
    const initiative = this.initiatives.get(insertDonation.initiativeId);
    if (initiative) {
      const newRaisedAmount = (initiative.raisedAmount || 0) + insertDonation.amount;
      const existingDonations = await this.getDonationsByInitiative(insertDonation.initiativeId);
      const uniqueDonors = new Set(existingDonations.map(d => d.donorId));
      
      await this.updateInitiative(insertDonation.initiativeId, {
        raisedAmount: newRaisedAmount,
        supportersCount: uniqueDonors.size
      });
    }

    return donation;
  }

  // Supports
  async getSupport(id: number): Promise<Support | undefined> {
    return this.supports.get(id);
  }

  async getSupportsByDonor(donorId: number): Promise<Support[]> {
    return Array.from(this.supports.values()).filter(support => 
      support.donorId === donorId
    );
  }

  async getSupportsByBeneficiary(beneficiaryId: number): Promise<Support[]> {
    return Array.from(this.supports.values()).filter(support => 
      support.beneficiaryId === beneficiaryId
    );
  }

  async createSupport(insertSupport: InsertSupport): Promise<Support> {
    const id = this.currentId.supports++;
    const support: Support = { 
      ...insertSupport, 
      id,
      createdAt: new Date()
    };
    this.supports.set(id, support);
    return support;
  }
}

export const storage = new MemStorage();

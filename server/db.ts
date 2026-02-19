import { eq, desc, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, appointments, blogPosts, contactSubmissions, Appointment, BlogPost, ContactSubmission, InsertAppointment, InsertBlogPost, InsertContactSubmission } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Appointment queries
export async function createAppointment(data: InsertAppointment): Promise<Appointment | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(appointments).values(data);
  const id = result[0].insertId;
  return getAppointmentById(id as number);
}

export async function getAppointmentById(id: number): Promise<Appointment | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(appointments).where(eq(appointments.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getAppointments(filters?: { status?: string; startDate?: Date; endDate?: Date }) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [];
  if (filters?.status) {
    conditions.push(eq(appointments.status, filters.status as any));
  }
  if (filters?.startDate) {
    conditions.push(gte(appointments.appointmentDate, filters.startDate));
  }
  if (filters?.endDate) {
    conditions.push(lte(appointments.appointmentDate, filters.endDate));
  }
  
  let query = db.select().from(appointments);
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  return (query as any).orderBy(desc(appointments.appointmentDate));
}

export async function updateAppointmentStatus(id: number, status: string): Promise<Appointment | null> {
  const db = await getDb();
  if (!db) return null;
  await db.update(appointments).set({ status: status as any }).where(eq(appointments.id, id));
  return getAppointmentById(id);
}

// Blog post queries
export async function createBlogPost(data: InsertBlogPost): Promise<BlogPost | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(blogPosts).values(data);
  const id = result[0].insertId;
  return getBlogPostById(id as number);
}

export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getPublishedBlogPosts(limit = 10, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return (db.select().from(blogPosts)
    .where(eq(blogPosts.published, 1))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit)
    .offset(offset) as any);
}

export async function getAllBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  return (db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt)) as any);
}

export async function updateBlogPost(id: number, data: Partial<InsertBlogPost>): Promise<BlogPost | null> {
  const db = await getDb();
  if (!db) return null;
  await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
  return getBlogPostById(id);
}

export async function deleteBlogPost(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  return true;
}

// Contact submission queries
export async function createContactSubmission(data: InsertContactSubmission): Promise<ContactSubmission | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(contactSubmissions).values(data);
  const id = result[0].insertId;
  return getContactSubmissionById(id as number);
}

export async function getContactSubmissionById(id: number): Promise<ContactSubmission | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(contactSubmissions).where(eq(contactSubmissions.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getContactSubmissions() {
  const db = await getDb();
  if (!db) return [];
  return (db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt)) as any);
}

export async function markContactSubmissionAsRead(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.update(contactSubmissions).set({ read: 1 }).where(eq(contactSubmissions.id, id));
  return true;
}

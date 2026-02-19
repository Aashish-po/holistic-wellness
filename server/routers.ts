import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { createAppointment, getAppointments, updateAppointmentStatus, createBlogPost, getPublishedBlogPosts, getBlogPostBySlug, getAllBlogPosts, updateBlogPost, deleteBlogPost, createContactSubmission, getContactSubmissions, markContactSubmissionAsRead } from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  appointments: router({
    create: publicProcedure
      .input(z.object({
        clientName: z.string().min(1),
        clientEmail: z.string().email(),
        clientPhone: z.string().min(1),
        serviceType: z.string().min(1),
        appointmentDate: z.date(),
        duration: z.number().min(15),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const appointment = await createAppointment({
          ...input,
          status: 'pending',
        });
        if (!appointment) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        return appointment;
      }),
    list: protectedProcedure
      .input(z.object({
        status: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return getAppointments(input);
      }),
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const updated = await updateAppointmentStatus(input.id, input.status);
        if (!updated) throw new TRPCError({ code: 'NOT_FOUND' });
        return updated;
      }),
  }),

  blog: router({
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        excerpt: z.string().min(1),
        content: z.string().min(1),
        author: z.string().min(1),
        category: z.string().min(1),
        featuredImage: z.string().optional(),
        published: z.number().default(0),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const post = await createBlogPost({
          ...input,
          publishedAt: input.published ? new Date() : null,
        });
        if (!post) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        return post;
      }),
    list: publicProcedure
      .input(z.object({
        limit: z.number().default(10),
        offset: z.number().default(0),
      }).optional())
      .query(async ({ input }) => {
        return getPublishedBlogPosts(input?.limit || 10, input?.offset || 0);
      }),
    getBySlug: publicProcedure
      .input(z.string())
      .query(async ({ input }) => {
        const post = await getBlogPostBySlug(input);
        if (!post || !post.published) throw new TRPCError({ code: 'NOT_FOUND' });
        return post;
      }),
    allPosts: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return getAllBlogPosts();
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        author: z.string().optional(),
        category: z.string().optional(),
        featuredImage: z.string().optional(),
        published: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const { id, ...data } = input;
        const updated = await updateBlogPost(id, data);
        if (!updated) throw new TRPCError({ code: 'NOT_FOUND' });
        return updated;
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const deleted = await deleteBlogPost(input);
        if (!deleted) throw new TRPCError({ code: 'NOT_FOUND' });
        return { success: true };
      }),
  }),

  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        message: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        const submission = await createContactSubmission(input);
        if (!submission) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        return { success: true, id: submission.id };
      }),
    list: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        return getContactSubmissions();
      }),
    markAsRead: protectedProcedure
      .input(z.number())
      .mutation(async ({ ctx, input }) => {
        if (ctx.user?.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
        const marked = await markContactSubmissionAsRead(input);
        if (!marked) throw new TRPCError({ code: 'NOT_FOUND' });
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;

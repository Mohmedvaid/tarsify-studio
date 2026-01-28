import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema, createNotebookSchema } from '@/lib/utils/validation';

describe('validation schemas', () => {
  describe('loginSchema', () => {
    it('validates correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123',
      };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('validates correct registration data', () => {
      const validData = {
        displayName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        acceptTerms: true,
      };
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects mismatched passwords', () => {
      const invalidData = {
        displayName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different123',
        acceptTerms: true,
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects short displayName', () => {
      const invalidData = {
        displayName: 'A',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        acceptTerms: true,
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects when terms not accepted', () => {
      const invalidData = {
        displayName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        acceptTerms: false,
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('createNotebookSchema', () => {
    it('validates correct notebook data', () => {
      const validData = {
        title: 'My Notebook',
        shortDescription: 'A great notebook for image processing',
        description: 'This is a detailed description that explains what the notebook does and how to use it.',
        category: 'image',
        gpuType: 'T4',
        priceCredits: 10,
      };
      const result = createNotebookSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid category', () => {
      const invalidData = {
        title: 'My Notebook',
        shortDescription: 'A great notebook for processing',
        description: 'This is a detailed description that explains what the notebook does.',
        category: 'invalid',
        gpuType: 'T4',
        priceCredits: 10,
      };
      const result = createNotebookSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects zero credit cost', () => {
      const invalidData = {
        title: 'My Notebook',
        shortDescription: 'A great notebook for processing',
        description: 'This is a detailed description that explains what the notebook does.',
        category: 'image',
        gpuType: 'T4',
        priceCredits: 0,
      };
      const result = createNotebookSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

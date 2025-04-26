
import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Product description is required'),
  price: z.coerce.number().positive('Price must be positive'),
  original_price: z.coerce.number().positive('Original price must be positive').optional().nullable(),
  category: z.string().min(1, 'Category is required'),
  stock_quantity: z.coerce.number().int().nonnegative('Stock quantity must be 0 or greater'),
  slug: z.string().min(1, 'Slug is required'),
  is_featured: z.boolean().default(false),
  is_new: z.boolean().default(false),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

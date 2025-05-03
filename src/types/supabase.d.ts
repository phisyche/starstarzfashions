
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          product_name: string
          price: number
          image_url: string | null
          quantity: number
          size: string | null
          color: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          product_name: string
          price: number
          image_url?: string | null
          quantity?: number
          size?: string | null
          color?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          product_name?: string
          price?: number
          image_url?: string | null
          quantity?: number
          size?: string | null
          color?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image: string | null
          parent_id: string | null
          is_featured: boolean | null
          sort_order: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image?: string | null
          parent_id?: string | null
          is_featured?: boolean | null
          sort_order?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image?: string | null
          parent_id?: string | null
          is_featured?: boolean | null
          sort_order?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      favorite_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          product_name: string
          price: number
          image_url: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          product_name: string
          price: number
          image_url?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          product_name?: string
          price?: number
          image_url?: string | null
          created_at?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status: string
          payment_status: string
          total_amount: number
          shipping_address: Json
          payment_method: string
          mpesa_reference: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          status?: string
          payment_status?: string
          total_amount: number
          shipping_address: Json
          payment_method: string
          mpesa_reference?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          status?: string
          payment_status?: string
          total_amount?: number
          shipping_address?: Json
          payment_method?: string
          mpesa_reference?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          price: number
          quantity: number
          size: string | null
          color: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_name: string
          price: number
          quantity?: number
          size?: string | null
          color?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          price?: number
          quantity?: number
          size?: string | null
          color?: string | null
          created_at?: string | null
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt_text: string | null
          is_primary: boolean | null
          sort_order: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          alt_text?: string | null
          is_primary?: boolean | null
          sort_order?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          alt_text?: string | null
          is_primary?: boolean | null
          sort_order?: number | null
          created_at?: string | null
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          category: string
          price: number
          image: string | null
          images: Json | null
          is_featured: boolean | null
          is_new: boolean | null
          is_sale: boolean | null
          discount_percent: number | null
          stock: number | null
          sizes: Json | null
          colors: Json | null
          materials: Json | null
          metadata: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          category: string
          price: number
          image?: string | null
          images?: Json | null
          is_featured?: boolean | null
          is_new?: boolean | null
          is_sale?: boolean | null
          discount_percent?: number | null
          stock?: number | null
          sizes?: Json | null
          colors?: Json | null
          materials?: Json | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          category?: string
          price?: number
          image?: string | null
          images?: Json | null
          is_featured?: boolean | null
          is_new?: boolean | null
          is_sale?: boolean | null
          discount_percent?: number | null
          stock?: number | null
          sizes?: Json | null
          colors?: Json | null
          materials?: Json | null
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          first_name: string | null
          last_name: string | null
          phone: string | null
          is_admin: boolean | null
          avatar_url: string | null
          address: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          is_admin?: boolean | null
          avatar_url?: string | null
          address?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          is_admin?: boolean | null
          avatar_url?: string | null
          address?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {}
    Functions: {
      check_admin_email: {
        Args: Record<string, never>
        Returns: unknown
      }
      create_cart_items_table: {
        Args: Record<string, never>
        Returns: undefined
      }
      create_favorite_items_table: {
        Args: Record<string, never>
        Returns: undefined
      }
    }
    Enums: {}
  }
}

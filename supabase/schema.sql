
-- Create the necessary tables for your Supabase project

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  images JSONB DEFAULT '[]',
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_sale BOOLEAN DEFAULT false,
  discount_percent INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  sizes JSONB DEFAULT '[]',
  colors JSONB DEFAULT '[]',
  materials JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  parent_id UUID REFERENCES categories(id),
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Collections table
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Collection products junction table
CREATE TABLE IF NOT EXISTS collection_products (
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (collection_id, product_id)
);

-- User profiles table with admin flag
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  address JSONB DEFAULT '{}',
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create a trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on auth.users
CREATE OR REPLACE TRIGGER create_profile_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_profile_for_user();

-- Set up Row Level Security policies
-- Products policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" 
ON products FOR SELECT 
USING (true);

CREATE POLICY "Products can be inserted by admins" 
ON products FOR INSERT 
TO authenticated
USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Products can be updated by admins" 
ON products FOR UPDATE 
TO authenticated
USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Products can be deleted by admins" 
ON products FOR DELETE 
TO authenticated
USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- Categories policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone" 
ON categories FOR SELECT 
USING (true);

CREATE POLICY "Categories can be inserted by admins" 
ON categories FOR INSERT 
TO authenticated
USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Categories can be updated by admins" 
ON categories FOR UPDATE 
TO authenticated
USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Categories can be deleted by admins" 
ON categories FOR DELETE 
TO authenticated
USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- Collections policies
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Collections are viewable by everyone" 
ON collections FOR SELECT 
USING (true);

CREATE POLICY "Collections can be inserted by admins" 
ON collections FOR INSERT 
TO authenticated
USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Collections can be updated by admins" 
ON collections FOR UPDATE 
TO authenticated
USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Collections can be deleted by admins" 
ON collections FOR DELETE 
TO authenticated
USING ((SELECT is_admin FROM profiles WHERE id = auth.uid()));

-- Profiles policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles can be viewed by the user" 
ON profiles FOR SELECT 
TO authenticated
USING (auth.uid() = id OR (SELECT is_admin FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Profiles can be updated by the user" 
ON profiles FOR UPDATE 
TO authenticated
USING (auth.uid() = id);

-- Admin user creation SQL
-- Run this query in the Supabase SQL editor to create an admin user
-- Replace 'USER_ID_HERE' with the actual UUID of the user you want to make admin
/*
UPDATE profiles 
SET is_admin = true 
WHERE id = 'USER_ID_HERE';
*/

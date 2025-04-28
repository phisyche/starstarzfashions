
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Code } from '@/components/ui/card';

export default function SupabaseSetupGuide() {
  return (
    <div className="container py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Supabase Setup Guide</h1>
      
      <Alert className="mb-6">
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Follow this guide to properly set up your Supabase project for the e-commerce platform.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Run the Schema SQL</CardTitle>
            <CardDescription>
              Create the necessary database tables for your application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              In the Supabase dashboard, navigate to the SQL Editor and run the following SQL code:
            </p>
            <div className="bg-muted p-4 rounded-md overflow-auto max-h-[400px] text-sm">
              <pre>{`-- Create the necessary tables for your Supabase project

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
USING (auth.uid() = id);`}</pre>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Create an Admin User</CardTitle>
            <CardDescription>
              Set up your first administrator account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>After creating a regular user account, run the following SQL to make that user an admin:</p>
            <div className="bg-muted p-4 rounded-md overflow-auto text-sm">
              <pre>{`-- Replace 'USER_ID_HERE' with the actual UUID of the user you want to make admin
UPDATE profiles 
SET is_admin = true 
WHERE id = 'USER_ID_HERE';`}</pre>
            </div>
            <p className="text-sm text-muted-foreground">
              You can find your user ID in the Auth > Users section of your Supabase dashboard.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Configure Authentication</CardTitle>
            <CardDescription>
              Set up email confirmation and site URL
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>In your Supabase dashboard:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Go to Authentication &gt; Providers</li>
              <li>Enable "Email" provider</li>
              <li>Configure "Site URL" to match your application's URL</li>
              <li>Set up "Redirect URLs" to include your application URLs</li>
              <li>
                For Google authentication:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Enable Google provider</li>
                  <li>Create a Google OAuth client in Google Cloud Console</li>
                  <li>Add client ID and secret to Supabase</li>
                </ul>
              </li>
            </ol>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Step 4: Test Your Setup</CardTitle>
            <CardDescription>
              Verify that your Supabase configuration is working properly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Follow these steps to test your setup:</p>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li>Register a new user account from the app</li>
              <li>Confirm that a profile is automatically created</li>
              <li>Make that user an admin using the SQL from Step 2</li>
              <li>Log in as that admin user</li>
              <li>Verify you can access the admin features</li>
            </ol>
            <Alert className="mb-4">
              <AlertDescription>
                If you encounter any issues with profile creation, make sure your trigger function is properly set up.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Step 5: Import Sample Data (Optional)</CardTitle>
            <CardDescription>
              Add some sample products and categories to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>You can run the following SQL to insert sample data:</p>
            <div className="bg-muted p-4 rounded-md overflow-auto max-h-[300px] text-sm">
              <pre>{`-- Insert sample categories
INSERT INTO categories (name, slug, description, is_featured)
VALUES 
  ('Clothing', 'clothing', 'All clothing items', true),
  ('Accessories', 'accessories', 'Fashion accessories', true),
  ('Footwear', 'footwear', 'Shoes and boots', true);

-- Insert sample products
INSERT INTO products (name, slug, description, price, category, is_featured, is_new, stock)
VALUES 
  ('Ankara Dress', 'ankara-dress', 'Beautiful Ankara pattern dress', 3999.99, 'Clothing', true, true, 10),
  ('Beaded Necklace', 'beaded-necklace', 'Handcrafted Maasai beaded necklace', 1499.99, 'Accessories', true, false, 15),
  ('Leather Sandals', 'leather-sandals', 'Genuine leather sandals', 2499.99, 'Footwear', false, true, 8);`}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 text-center">
        <p className="mb-4">Need additional help? Contact our support team.</p>
        <Button variant="outline" onClick={() => window.history.back()}>
          Back to Application
        </Button>
      </div>
    </div>
  );
}


-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to create cart_items table if it doesn't exist
CREATE OR REPLACE FUNCTION create_cart_items_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    price DECIMAL NOT NULL,
    image_url TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    size TEXT,
    color TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  );
  
  -- Enable RLS
  ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
  
  -- Create policy for selecting
  DROP POLICY IF EXISTS "Users can view their own cart items" ON public.cart_items;
  CREATE POLICY "Users can view their own cart items" 
    ON public.cart_items 
    FOR SELECT 
    USING (auth.uid() = user_id);
  
  -- Create policy for inserting
  DROP POLICY IF EXISTS "Users can add items to their cart" ON public.cart_items;
  CREATE POLICY "Users can add items to their cart" 
    ON public.cart_items 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
  
  -- Create policy for updating
  DROP POLICY IF EXISTS "Users can update their own cart items" ON public.cart_items;
  CREATE POLICY "Users can update their own cart items" 
    ON public.cart_items 
    FOR UPDATE 
    USING (auth.uid() = user_id);
  
  -- Create policy for deleting
  DROP POLICY IF EXISTS "Users can delete their own cart items" ON public.cart_items;
  CREATE POLICY "Users can delete their own cart items" 
    ON public.cart_items 
    FOR DELETE 
    USING (auth.uid() = user_id);
END;
$$;

-- Function to create favorite_items table if it doesn't exist
CREATE OR REPLACE FUNCTION create_favorite_items_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.favorite_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    price DECIMAL NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
  );
  
  -- Enable RLS
  ALTER TABLE public.favorite_items ENABLE ROW LEVEL SECURITY;
  
  -- Create policy for selecting
  DROP POLICY IF EXISTS "Users can view their own favorite items" ON public.favorite_items;
  CREATE POLICY "Users can view their own favorite items" 
    ON public.favorite_items 
    FOR SELECT 
    USING (auth.uid() = user_id);
  
  -- Create policy for inserting
  DROP POLICY IF EXISTS "Users can add items to their favorites" ON public.favorite_items;
  CREATE POLICY "Users can add items to their favorites" 
    ON public.favorite_items 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
  
  -- Create policy for updating
  DROP POLICY IF EXISTS "Users can update their own favorite items" ON public.favorite_items;
  CREATE POLICY "Users can update their own favorite items" 
    ON public.favorite_items 
    FOR UPDATE 
    USING (auth.uid() = user_id);
  
  -- Create policy for deleting
  DROP POLICY IF EXISTS "Users can delete their own favorite items" ON public.favorite_items;
  CREATE POLICY "Users can delete their own favorite items" 
    ON public.favorite_items 
    FOR DELETE 
    USING (auth.uid() = user_id);
END;
$$;

-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  total_amount DECIMAL NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_method TEXT NOT NULL,
  mpesa_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy for selecting orders
CREATE POLICY "Users can view their own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for inserting orders
CREATE POLICY "Users can create their own orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create order items table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  price DECIMAL NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  size TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on order items table
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policy for selecting order items
CREATE POLICY "Users can view their own order items"
  ON public.order_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Create policy for inserting order items
CREATE POLICY "Users can add items to their orders"
  ON public.order_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Create trigger function to update profiles is_admin field based on email
CREATE OR REPLACE FUNCTION public.check_admin_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set is_admin to true if email ends with specific domains or matches specific addresses
  IF NEW.email = 'phisyche@gmail.com' OR 
     NEW.email = 'admin@starstarzfashions.com' OR
     NEW.email LIKE '%@starstarzfashions.com' THEN
    
    UPDATE public.profiles
    SET is_admin = true
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to run check_admin_email after user insert/update
DROP TRIGGER IF EXISTS check_admin_email_trigger ON auth.users;
CREATE TRIGGER check_admin_email_trigger
AFTER INSERT OR UPDATE OF email ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.check_admin_email();

-- Create trigger to automatically run check_admin_email for existing users
DO $$
BEGIN
  PERFORM public.check_admin_email() FROM auth.users;
END;
$$;

-- Refresh admin status for all current users
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT * FROM auth.users
  LOOP
    IF user_record.email = 'phisyche@gmail.com' OR 
       user_record.email = 'admin@starstarzfashions.com' OR
       user_record.email LIKE '%@starstarzfashions.com' THEN
      
      UPDATE public.profiles
      SET is_admin = true
      WHERE id = user_record.id;
    END IF;
  END LOOP;
END;
$$;

import React from 'react';

const SupabaseSetupGuide = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Setup Guide</h1>
      
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Step 1: Create a Supabase Project</h2>
        <p className="mb-2">
          Go to the <a href="https://supabase.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Supabase website</a> and create a new project.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Step 2: Get Your Supabase URL and Key</h2>
        <p className="mb-2">
          Once your project is created, navigate to the project settings to find your Supabase URL and anon key.
        </p>
        <p className="mb-2">
          These keys are essential for your application to communicate with your Supabase project.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Step 3: Enable Email Authentication</h2>
        <p className="mb-2">
          In your Supabase project dashboard, go to Authentication &rarr; Providers and enable the Email provider.
        </p>
        <p className="mb-2">
           This will allow users to sign up and log in with their email addresses.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Step 4: Set Up the User Management Table</h2>
        <p className="mb-2">
          Create a table named "users" in your Supabase database to store user-related data.
        </p>
        <p className="mb-2">
          Include columns like "id" (UUID, primary key), "email" (text), and any other relevant user information.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Step 5: Implement Row Level Security (RLS)</h2>
        <p className="mb-2">
          Enable RLS on the "users" table to ensure that users can only access their own data.
        </p>
        <p className="mb-2">
          Use the following policy to allow users to select their own record:
        </p>
        <pre className="bg-gray-100 p-3 rounded-md">
          <code>
            CREATE POLICY "Allow users to select their own record" ON public.users FOR SELECT USING (auth.uid() = id);
          </code>
        </pre>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Step 6: Get User ID</h2>
        <p className="mb-2">
          To get the user ID, you can use  <code>auth.uid()</code> in your Supabase policies or functions.
        </p>
        <p className="text-sm text-muted-foreground">
          You can find your user ID in the Auth &rarr; Users section of your Supabase dashboard.
        </p>
      </section>
    </div>
  );
};

export default SupabaseSetupGuide;

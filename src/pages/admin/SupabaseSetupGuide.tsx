
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const SupabaseSetupGuide = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Setup Guide for StarStarz</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Create Database Schema</CardTitle>
            <CardDescription>
              Set up all the necessary tables and security policies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              To set up your Supabase database, you need to run the schema.sql script that's included in your project.
            </p>
            
            <ol className="list-decimal pl-5 space-y-2">
              <li>Log in to your Supabase dashboard at <a href="https://app.supabase.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">app.supabase.com</a></li>
              <li>Select your project (pifzapdqhaxgskypadws)</li>
              <li>Go to the SQL Editor (in the left sidebar)</li>
              <li>Create a new query</li>
              <li>Copy the entire contents of supabase/schema.sql from your project</li>
              <li>Paste it into the SQL Editor</li>
              <li>Click "Run" to execute the SQL</li>
            </ol>
            
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800">
              <p className="font-medium">Important:</p>
              <p className="text-sm">
                This will create the profiles, products, categories, collections, and other necessary tables with the proper security settings.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Create an Admin User</CardTitle>
            <CardDescription>
              Set up an administrator account to manage the store
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>To create an admin user:</p>
            
            <ol className="list-decimal pl-5 space-y-2">
              <li>Register a normal user through the application</li>
              <li>Go to Authentication &rarr; Users in your Supabase dashboard</li>
              <li>Find the user you just created and copy their User ID (UUID)</li>
              <li>Go to the SQL Editor and create a new query</li>
              <li>Run the following SQL (replace USER_ID_HERE with the actual UUID):</li>
            </ol>
            
            <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto text-sm">
              <code>{`UPDATE profiles 
SET is_admin = true 
WHERE id = 'USER_ID_HERE';`}</code>
            </pre>
            
            <p className="text-sm text-muted-foreground">
              You can find your user ID in the Auth &rarr; Users section of your Supabase dashboard.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Verify Setup</CardTitle>
            <CardDescription>
              Make sure everything is working correctly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>To verify your setup:</p>
            
            <ol className="list-decimal pl-5 space-y-2">
              <li>Check that you can log in with your admin user</li>
              <li>Try accessing the admin dashboard at <code>/admin/dashboard</code></li>
              <li>Verify you can create and manage products</li>
              <li>Test the user registration and login functionality</li>
            </ol>
            
            <div className="bg-green-50 border border-green-200 rounded-md p-3 text-green-800">
              <p className="font-medium">Success Check:</p>
              <p className="text-sm">
                If you can access the admin dashboard and manage products, your setup is complete!
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Step 4: Database Tables Overview</CardTitle>
            <CardDescription>
              Understanding the data structure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Your database includes these key tables:</p>
            
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>profiles</strong> - User information including admin status</li>
              <li><strong>products</strong> - Product details, pricing, inventory</li>
              <li><strong>categories</strong> - Product categorization</li>
              <li><strong>collections</strong> - Special product collections</li>
            </ul>
            
            <Separator className="my-4" />
            
            <p className="text-sm">
              Each table has Row Level Security (RLS) policies that control who can view, edit, and delete data.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting Common Issues</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Database tables not found error</h3>
            <p className="text-sm text-gray-600">
              If you see "relation does not exist" errors, it means you haven't run the schema SQL. Follow Step 1 to set up your database.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Cannot access admin area</h3>
            <p className="text-sm text-gray-600">
              Make sure you've set the is_admin flag to true for your user using the SQL in Step 2.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">M-Pesa integration issues</h3>
            <p className="text-sm text-gray-600">
              Ensure your Supabase Edge Function is configured correctly and you've set up the proper environment variables.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupabaseSetupGuide;

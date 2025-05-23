
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSupabase } from '@/context/SupabaseContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ChevronLeft, Home } from 'lucide-react';
import { from } from '@/integrations/supabase/client';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminLogin() {
  const { signIn, user, isAdmin } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // If user is already logged in and is admin, redirect to dashboard
  useEffect(() => {
    if (user && isAdmin) {
      console.log("User is admin, redirecting to dashboard", user.email);
      navigate('/admin/dashboard');
    }
  }, [user, navigate, isAdmin]);
  
  const onSubmit = async (data: FormValues) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Sign in the user with corrected function call
      await signIn({
        email: data.email,
        password: data.password,
      });
      
      // The redirect will happen in the useEffect when isAdmin is updated
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Sign in to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="admin@example.com"
                          type="email"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>

            {error && error.includes('Database setup incomplete') && (
              <Alert className="mt-4">
                <AlertTitle>Database Setup Required</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>Your Supabase database needs to be set up properly.</p>
                  <Link to="/admin/setup-guide">
                    <Button variant="outline" size="sm" className="mt-2">
                      View Setup Guide
                    </Button>
                  </Link>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <div className="border-t pt-4 mt-2 w-full">
              <p className="text-sm text-muted-foreground">
                Access to this area is restricted to authorized personnel only.
              </p>
            </div>
            <div className="text-sm text-center">
              <Link to="/admin/setup-guide" className="text-primary hover:underline">
                Need help setting up? View Supabase Setup Guide
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

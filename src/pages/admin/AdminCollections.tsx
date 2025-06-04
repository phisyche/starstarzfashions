
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Package, Search } from 'lucide-react';
import { useSupabase } from '@/context/SupabaseContext';
import { useToast } from '@/hooks/use-toast';

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  category: string;
  is_featured: boolean;
  is_new: boolean;
}

export default function AdminCollections() {
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    is_active: true,
    start_date: '',
    end_date: '',
  });

  // Fetch collections
  const { data: collections = [], isLoading } = useQuery({
    queryKey: ['admin-collections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          collection_products(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch all products for adding to collections
  const { data: allProducts = [] } = useQuery({
    queryKey: ['admin-all-products', productSearchTerm],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('id, name, slug, price, image, category, is_featured, is_new');

      if (productSearchTerm) {
        query = query.ilike('name', `%${productSearchTerm}%`);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch products in a specific collection
  const { data: collectionProducts = [] } = useQuery({
    queryKey: ['collection-products', selectedCollectionId],
    queryFn: async () => {
      if (!selectedCollectionId) return [];
      
      const { data, error } = await supabase
        .from('collection_products')
        .select(`
          product_id,
          products (
            id, name, slug, price, image, category
          )
        `)
        .eq('collection_id', selectedCollectionId);

      if (error) throw error;
      return data?.map(item => item.products).filter(Boolean) || [];
    },
    enabled: !!selectedCollectionId,
  });

  // Create/Update collection
  const createUpdateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (editingCollection) {
        const { error } = await supabase
          .from('collections')
          .update(data)
          .eq('id', editingCollection.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('collections')
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-collections'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: 'Success',
        description: `Collection ${editingCollection ? 'updated' : 'created'} successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to ${editingCollection ? 'update' : 'create'} collection.`,
        variant: 'destructive',
      });
    },
  });

  // Delete collection
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-collections'] });
      toast({
        title: 'Success',
        description: 'Collection deleted successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete collection.',
        variant: 'destructive',
      });
    },
  });

  // Add products to collection
  const addProductsMutation = useMutation({
    mutationFn: async ({ collectionId, productIds }: { collectionId: string; productIds: string[] }) => {
      const insertData = productIds.map(productId => ({
        collection_id: collectionId,
        product_id: productId
      }));

      const { error } = await supabase
        .from('collection_products')
        .upsert(insertData, { onConflict: 'collection_id,product_id' });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-collections'] });
      setIsProductDialogOpen(false);
      setSelectedProducts([]);
      toast({
        title: 'Success',
        description: 'Products added to collection successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add products to collection.',
        variant: 'destructive',
      });
    },
  });

  // Remove product from collection
  const removeProductMutation = useMutation({
    mutationFn: async ({ collectionId, productId }: { collectionId: string; productId: string }) => {
      const { error } = await supabase
        .from('collection_products')
        .delete()
        .eq('collection_id', collectionId)
        .eq('product_id', productId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-collections'] });
      toast({
        title: 'Success',
        description: 'Product removed from collection.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to remove product from collection.',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      is_active: true,
      start_date: '',
      end_date: '',
    });
    setEditingCollection(null);
  };

  const handleEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      slug: collection.slug,
      description: collection.description || '',
      image: collection.image || '',
      is_active: collection.is_active,
      start_date: collection.start_date ? collection.start_date.split('T')[0] : '',
      end_date: collection.end_date ? collection.end_date.split('T')[0] : '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate slug from name if not provided
    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    createUpdateMutation.mutate({
      ...formData,
      slug,
    });
  };

  const generateSlug = () => {
    const slug = formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setFormData({ ...formData, slug });
  };

  const handleManageProducts = (collectionId: string) => {
    setSelectedCollectionId(collectionId);
    setIsProductDialogOpen(true);
  };

  const handleAddProducts = () => {
    if (selectedCollectionId && selectedProducts.length > 0) {
      addProductsMutation.mutate({
        collectionId: selectedCollectionId,
        productIds: selectedProducts
      });
    }
  };

  const handleRemoveProduct = (productId: string) => {
    if (selectedCollectionId) {
      removeProductMutation.mutate({
        collectionId: selectedCollectionId,
        productId
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Collections</h1>
            <p className="text-gray-600">Manage your product collections</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Collection
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingCollection ? 'Edit Collection' : 'Create New Collection'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <div className="flex gap-2">
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="auto-generated"
                      />
                      <Button type="button" variant="outline" onClick={generateSlug}>
                        Generate
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createUpdateMutation.isPending}>
                    {createUpdateMutation.isPending ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Collections</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collections.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell>
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                          {collection.image ? (
                            <img
                              src={collection.image}
                              alt={collection.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Package className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{collection.name}</div>
                          <div className="text-sm text-gray-500">/{collection.slug}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span>{collection.collection_products?.[0]?.count || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={collection.is_active ? 'default' : 'secondary'}>
                          {collection.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {collection.start_date && (
                            <div>Start: {new Date(collection.start_date).toLocaleDateString()}</div>
                          )}
                          {collection.end_date && (
                            <div>End: {new Date(collection.end_date).toLocaleDateString()}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleManageProducts(collection.id)}
                          >
                            <Package className="h-4 w-4 mr-1" />
                            Products
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(collection)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMutation.mutate(collection.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Products Management Dialog */}
        <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Manage Collection Products</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Current Products in Collection */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Current Products</h3>
                {collectionProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {collectionProducts.map((product: any) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <img
                            src={product.image || '/placeholder.svg'}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">${product.price}</div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveProduct(product.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No products in this collection yet.</p>
                )}
              </div>

              {/* Add Products */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Add Products</h3>
                
                {/* Search */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Products List */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {allProducts.map((product) => (
                    <div key={product.id} className="flex items-center space-x-2 p-2 border rounded">
                      <Checkbox
                        id={product.id}
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedProducts(prev => [...prev, product.id]);
                          } else {
                            setSelectedProducts(prev => prev.filter(id => id !== product.id));
                          }
                        }}
                      />
                      <img
                        src={product.image || '/placeholder.svg'}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">${product.price} • {product.category}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-600">
                    {selectedProducts.length} products selected
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsProductDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddProducts}
                      disabled={selectedProducts.length === 0 || addProductsMutation.isPending}
                    >
                      {addProductsMutation.isPending ? 'Adding...' : 'Add Selected Products'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

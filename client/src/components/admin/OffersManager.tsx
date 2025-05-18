import React, { useState } from 'react';
import { 
  useQuery, 
  useMutation, 
  useQueryClient
} from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Cross2Icon, PlusIcon, FileIcon, Pencil1Icon, TrashIcon, DownloadIcon } from '@radix-ui/react-icons';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Offer, OfferItem } from '@shared/schema';
import { generateOfferPDF, generateOfferFilename, generateOfferNumber } from '@/utils/pdf-generator';

// Form schema for create/edit offer
const offerSchema = z.object({
  offerNumber: z.string().min(1, "Offer number is required"),
  clientId: z.number().int().positive("Client is required"),
  date: z.date(),
  expiryDate: z.date().optional().nullable(),
  items: z.array(z.object({
    productName: z.string().min(1, "Product name is required"),
    specifications: z.string().optional(),
    quantity: z.number().positive("Quantity must be positive"),
    price: z.number().optional().nullable(),
    total: z.number().optional().nullable()
  })),
  totalAmount: z.string().optional().nullable(),
  currency: z.string().default("EUR"),
  notes: z.string().optional().nullable(),
  terms: z.string().optional().nullable(),
  paymentTerms: z.string().optional().nullable(),
  status: z.string().default("draft")
});

type OfferFormValues = z.infer<typeof offerSchema>;

export function OffersManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [tab, setTab] = useState<'all' | 'draft' | 'sent' | 'accepted' | 'declined'>('all');
  
  // Fetch clients for dropdown
  const { data: clients } = useQuery({
    queryKey: ['/api/admin/crm/clients'],
    throwOnError: false
  });
  
  // Fetch offers
  const { data: offers, isLoading: offersLoading } = useQuery({
    queryKey: ['/api/admin/offers'],
    throwOnError: false
  });
  
  // Create offer mutation
  const createOfferMutation = useMutation({
    mutationFn: async (offerData: OfferFormValues) => {
      const response = await fetch('/api/admin/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(offerData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create offer');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/offers'] });
      toast({
        title: 'Success',
        description: 'Offer created successfully',
      });
      setOpenDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  // Update offer mutation
  const updateOfferMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<OfferFormValues> }) => {
      const response = await fetch(`/api/admin/offers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update offer');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/offers'] });
      toast({
        title: 'Success',
        description: 'Offer updated successfully',
      });
      setOpenDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  // Delete offer mutation
  const deleteOfferMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/offers/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete offer');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/offers'] });
      toast({
        title: 'Success',
        description: 'Offer deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
  
  // Setup form for create/edit
  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      offerNumber: generateOfferNumber(),
      clientId: undefined,
      date: new Date(),
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      items: [{ 
        productName: '', 
        specifications: '', 
        quantity: 1,
        price: null,
        total: null
      }],
      totalAmount: null,
      currency: 'EUR',
      notes: null,
      terms: 'Payment due within 30 days after invoice receipt.',
      paymentTerms: null,
      status: 'draft'
    }
  });
  
  // Setup items field array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });
  
  // Filter offers based on selected tab
  const filteredOffers = offers?.filter(offer => {
    if (tab === 'all') return true;
    return offer.status === tab;
  }) || [];
  
  // Open dialog for create mode
  const handleCreateClick = () => {
    setDialogMode('create');
    form.reset({
      offerNumber: generateOfferNumber(),
      clientId: undefined,
      date: new Date(),
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      items: [{ 
        productName: '', 
        specifications: '', 
        quantity: 1,
        price: null,
        total: null
      }],
      totalAmount: null,
      currency: 'EUR',
      notes: null,
      terms: 'Payment due within 30 days after invoice receipt.',
      paymentTerms: null,
      status: 'draft'
    });
    setOpenDialog(true);
  };
  
  // Open dialog for edit mode
  const handleEditClick = (offer: Offer) => {
    setDialogMode('edit');
    setSelectedOffer(offer);
    
    form.reset({
      offerNumber: offer.offerNumber,
      clientId: offer.clientId,
      date: new Date(offer.date),
      expiryDate: offer.expiryDate ? new Date(offer.expiryDate) : null,
      items: offer.items || [],
      totalAmount: offer.totalAmount ? offer.totalAmount.toString() : null,
      currency: offer.currency || 'EUR',
      notes: offer.notes,
      terms: offer.terms,
      paymentTerms: offer.paymentTerms,
      status: offer.status
    });
    
    setOpenDialog(true);
  };
  
  // Handle form submission
  const onSubmit = (data: OfferFormValues) => {
    // Calculate total amount from items if not provided
    if (!data.totalAmount) {
      const total = data.items.reduce((sum, item) => {
        const itemTotal = item.total || (item.price ? item.price * item.quantity : 0);
        return sum + itemTotal;
      }, 0);
      data.totalAmount = total.toString();
    }
    
    if (dialogMode === 'create') {
      createOfferMutation.mutate(data);
    } else {
      updateOfferMutation.mutate({ id: selectedOffer!.id, data });
    }
  };
  
  // Handle recalculating totals when price or quantity changes
  const recalculateItemTotal = (index: number) => {
    const items = form.getValues('items');
    const item = items[index];
    if (item.price && item.quantity) {
      const total = item.price * item.quantity;
      form.setValue(`items.${index}.total`, total);
    }
  };
  
  // Calculate overall total based on item totals
  const calculateTotalAmount = () => {
    const items = form.getValues('items');
    const total = items.reduce((sum, item) => {
      return sum + (item.total || 0);
    }, 0);
    form.setValue('totalAmount', total.toString());
  };
  
  // Generate PDF for an offer
  const handleGeneratePDF = async (offer: Offer) => {
    try {
      // Find client name
      const client = clients?.find(c => c.id === offer.clientId);
      if (!client) {
        throw new Error('Client not found');
      }
      
      // Generate the PDF
      const pdf = await generateOfferPDF({
        offerNumber: offer.offerNumber,
        date: new Date(offer.date),
        expiryDate: offer.expiryDate ? new Date(offer.expiryDate) : undefined,
        items: offer.items || [],
        totalAmount: parseFloat(offer.totalAmount || '0'),
        currency: offer.currency || 'EUR',
        notes: offer.notes || undefined,
        terms: offer.terms || undefined,
        paymentTerms: offer.paymentTerms || undefined,
        clientInfo: {
          name: client.name,
          email: client.email,
          company: client.company || undefined,
          phone: client.phone || undefined,
          address: client.address || undefined
        }
      });
      
      // Create a download link
      const blob = new Blob([pdf], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = generateOfferFilename(offer.offerNumber, client.name);
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Success',
        description: 'PDF generated successfully',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate PDF',
        variant: 'destructive'
      });
    }
  };
  
  // Handle confirming deletion
  const handleDeleteClick = (offer: Offer) => {
    if (window.confirm(`Are you sure you want to delete offer #${offer.offerNumber}?`)) {
      deleteOfferMutation.mutate(offer.id);
    }
  };
  
  // Get client name
  const getClientName = (clientId: number) => {
    const client = clients?.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };
  
  // Status badge color mapper
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-200 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Offers Management</h2>
        <Button onClick={handleCreateClick}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create New Offer
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={tab} onValueChange={(value) => setTab(value as any)}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Offers</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="declined">Declined</TabsTrigger>
        </TabsList>
        
        <TabsContent value={tab}>
          {offersLoading ? (
            <div className="flex items-center justify-center h-40">
              <p>Loading offers...</p>
            </div>
          ) : filteredOffers.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <FileIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No offers found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {tab === 'all' 
                      ? "Get started by creating a new offer." 
                      : `No ${tab} offers found.`}
                  </p>
                  <div className="mt-6">
                    <Button onClick={handleCreateClick}>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Create New Offer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredOffers.map((offer) => (
                <Card key={offer.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          Offer #{offer.offerNumber}
                          <Badge className={`ml-2 ${getStatusColor(offer.status)}`}>
                            {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Client: {getClientName(offer.clientId)}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleGeneratePDF(offer)}
                        >
                          <DownloadIcon className="h-4 w-4 mr-1" /> PDF
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditClick(offer)}
                        >
                          <Pencil1Icon className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteClick(offer)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="text-sm grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p>{format(new Date(offer.date), 'MMM d, yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Expiry</p>
                        <p>
                          {offer.expiryDate 
                            ? format(new Date(offer.expiryDate), 'MMM d, yyyy')
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Total</p>
                        <p className="font-semibold">
                          {offer.totalAmount 
                            ? `${parseFloat(offer.totalAmount).toLocaleString()} ${offer.currency}`
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-gray-500 text-sm">Items</p>
                      <div className="mt-1 max-h-32 overflow-y-auto">
                        {offer.items?.map((item, index) => (
                          <div key={index} className="text-sm py-1 border-b border-gray-100 flex justify-between">
                            <div>
                              <span className="font-medium">{item.productName}</span>
                              {item.specifications && 
                                <span className="text-gray-500 ml-2">({item.specifications})</span>
                              }
                            </div>
                            <div>
                              x{item.quantity}
                              {item.price && 
                                <span className="ml-2">
                                  {parseFloat(item.price.toString()).toLocaleString()} {offer.currency}
                                </span>
                              }
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Create/Edit Offer Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Create New Offer' : 'Edit Offer'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'create' 
                ? 'Fill in the details to create a new offer.' 
                : 'Update the offer details.'}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-1 -mx-1">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="offerNumber">Offer Number</Label>
                  <Input
                    id="offerNumber"
                    {...form.register('offerNumber')}
                  />
                  {form.formState.errors.offerNumber && (
                    <p className="text-sm text-red-500">{form.formState.errors.offerNumber.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client</Label>
                  <Controller
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients?.map((client) => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.name} {client.company && `(${client.company})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.clientId && (
                    <p className="text-sm text-red-500">{form.formState.errors.clientId.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Controller
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <Input
                        id="date"
                        type="date"
                        value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                      />
                    )}
                  />
                  {form.formState.errors.date && (
                    <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Controller
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <Input
                        id="expiryDate"
                        type="date"
                        value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                      />
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Controller
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="declined">Declined</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="currency">Currency</Label>
                    <Controller
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <Select
                          value={field.value || 'EUR'}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Items</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => append({ 
                      productName: '', 
                      specifications: '', 
                      quantity: 1,
                      price: null,
                      total: null
                    })}
                  >
                    <PlusIcon className="h-4 w-4 mr-1" /> Add Item
                  </Button>
                </div>
                
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-2 p-3 border rounded-md relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0"
                      onClick={() => remove(index)}
                    >
                      <Cross2Icon className="h-4 w-4" />
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`items.${index}.productName`}>Product/Service Name</Label>
                        <Input
                          id={`items.${index}.productName`}
                          {...form.register(`items.${index}.productName`)}
                        />
                        {form.formState.errors.items?.[index]?.productName && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors.items?.[index]?.productName?.message}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`items.${index}.specifications`}>Specifications</Label>
                        <Input
                          id={`items.${index}.specifications`}
                          {...form.register(`items.${index}.specifications`)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`items.${index}.quantity`}>Quantity</Label>
                        <Controller
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <Input
                              id={`items.${index}.quantity`}
                              type="number"
                              min="1"
                              value={field.value || ''}
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value));
                                recalculateItemTotal(index);
                              }}
                              onBlur={() => {
                                field.onBlur();
                                calculateTotalAmount();
                              }}
                            />
                          )}
                        />
                        {form.formState.errors.items?.[index]?.quantity && (
                          <p className="text-sm text-red-500">
                            {form.formState.errors.items?.[index]?.quantity?.message}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`items.${index}.price`}>Unit Price</Label>
                        <Controller
                          control={form.control}
                          name={`items.${index}.price`}
                          render={({ field }) => (
                            <Input
                              id={`items.${index}.price`}
                              type="number"
                              step="0.01"
                              min="0"
                              value={field.value === null ? '' : field.value}
                              onChange={(e) => {
                                field.onChange(e.target.value ? parseFloat(e.target.value) : null);
                                recalculateItemTotal(index);
                              }}
                              onBlur={() => {
                                field.onBlur();
                                calculateTotalAmount();
                              }}
                            />
                          )}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`items.${index}.total`}>Total</Label>
                        <Controller
                          control={form.control}
                          name={`items.${index}.total`}
                          render={({ field }) => (
                            <Input
                              id={`items.${index}.total`}
                              type="number"
                              step="0.01"
                              min="0"
                              value={field.value === null ? '' : field.value}
                              onChange={(e) => {
                                field.onChange(e.target.value ? parseFloat(e.target.value) : null);
                              }}
                              onBlur={() => {
                                field.onBlur();
                                calculateTotalAmount();
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {form.formState.errors.items && (
                  <p className="text-sm text-red-500">Please add at least one item</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    rows={3}
                    {...form.register('notes')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    rows={3}
                    {...form.register('terms')}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Textarea
                  id="paymentTerms"
                  rows={2}
                  {...form.register('paymentTerms')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="totalAmount">Total Amount</Label>
                <div className="flex">
                  <Controller
                    control={form.control}
                    name="totalAmount"
                    render={({ field }) => (
                      <Input
                        id="totalAmount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={field.value === null ? '' : field.value}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="ml-2"
                    onClick={calculateTotalAmount}
                  >
                    Calculate
                  </Button>
                </div>
              </div>
              
              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createOfferMutation.isPending || updateOfferMutation.isPending}
                >
                  {createOfferMutation.isPending || updateOfferMutation.isPending ? (
                    'Saving...'
                  ) : dialogMode === 'create' ? (
                    'Create Offer'
                  ) : (
                    'Update Offer'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}


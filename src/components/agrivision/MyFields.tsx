
// src/components/agrivision/MyFields.tsx
'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

type Field = {
    id: string;
    name: string;
    crop: string;
    size: number;
};

const fieldSchema = z.object({
  name: z.string().min(1, 'Field name is required.'),
  crop: z.string().min(1, 'Crop type is required.'),
  size: z.coerce.number().min(0.1, 'Size must be greater than 0.'),
});

export function MyFields() {
  const { translations: t } = useLanguage();
  const [fields, setFields] = useState<Field[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);

  useEffect(() => {
    setIsClient(true);
    const savedFields = localStorage.getItem('my-fields');
    if (savedFields) {
      setFields(JSON.parse(savedFields));
    }
  }, []);

  const form = useForm<z.infer<typeof fieldSchema>>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      name: '',
      crop: '',
      size: 1,
    },
  });

  const handleSaveChanges = (newFields: Field[]) => {
    setFields(newFields);
    localStorage.setItem('my-fields', JSON.stringify(newFields));
  };

  const onSubmit = (values: z.infer<typeof fieldSchema>) => {
    if (editingField) {
      const updatedFields = fields.map(f => f.id === editingField.id ? { ...editingField, ...values } : f);
      handleSaveChanges(updatedFields);
    } else {
      const newField = { id: Date.now().toString(), ...values };
      handleSaveChanges([...fields, newField]);
    }
    setIsDialogOpen(false);
    setEditingField(null);
    form.reset();
  };
  
  const handleEditClick = (field: Field) => {
    setEditingField(field);
    form.reset(field);
    setIsDialogOpen(true);
  }

  const handleDelete = (fieldId: string) => {
    const updatedFields = fields.filter(f => f.id !== fieldId);
    handleSaveChanges(updatedFields);
  };
  
  const openNewFieldDialog = () => {
    setEditingField(null);
    form.reset({ name: '', crop: '', size: 1 });
    setIsDialogOpen(true);
  }

  if (!isClient) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t.settings.myFields.title}</CardTitle>
          <CardDescription>{t.settings.myFields.description}</CardDescription>
        </div>
        <Button onClick={openNewFieldDialog} size="sm" className="ml-4">
          <PlusCircle className="mr-2" />
          {t.settings.myFields.newFieldButton}
        </Button>
      </CardHeader>
      <CardContent>
        {fields.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.settings.myFields.fieldName}</TableHead>
                  <TableHead>{t.settings.myFields.fieldCrop}</TableHead>
                  <TableHead className="text-right">{t.settings.myFields.fieldSize} ({t.settings.myFields.fieldSizeUnit})</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field) => (
                  <TableRow key={field.id}>
                    <TableCell className="font-medium">{field.name}</TableCell>
                    <TableCell>{field.crop}</TableCell>
                    <TableCell className="text-right">{field.size}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(field)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                               <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t.settings.myFields.deleteConfirmTitle}</AlertDialogTitle>
                              <AlertDialogDescription>{t.settings.myFields.deleteConfirmText}</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t.settings.myFields.cancel}</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(field.id)} className="bg-destructive hover:bg-destructive/90">{t.settings.myFields.delete}</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">{t.settings.myFields.noFields}</p>
        )}
      </CardContent>
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingField ? t.settings.myFields.editField : t.settings.myFields.addNewField}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>{t.settings.myFields.fieldName}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="crop" render={({ field }) => (
                  <FormItem><FormLabel>{t.settings.myFields.fieldCrop}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                 <FormField control={form.control} name="size" render={({ field }) => (
                  <FormItem><FormLabel>{t.settings.myFields.fieldSize} ({t.settings.myFields.fieldSizeUnit})</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="ghost">{t.settings.myFields.cancel}</Button></DialogClose>
                    <Button type="submit">{t.settings.myFields.saveChanges}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
    </Card>
  );
}

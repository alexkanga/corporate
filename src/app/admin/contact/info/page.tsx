'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Save, Loader2 } from 'lucide-react';

interface ContactInfo {
  id: string;
  titleFr: string | null;
  titleEn: string | null;
  descriptionFr: string | null;
  descriptionEn: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  phone2: string | null;
  workingHoursFr: string | null;
  workingHoursEn: string | null;
  mapEmbedUrl: string | null;
}

export default function ContactInfoAdminPage() {
  const queryClient = useQueryClient();

  const { data: info, isLoading } = useQuery({
    queryKey: ['admin-contact-info'],
    queryFn: async () => {
      const res = await fetch('/api/admin/contact-info');
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<ContactInfo>) => {
      const res = await fetch('/api/admin/contact-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contact-info'] });
      toast.success('Informations de contact mises à jour');
    },
    onError: () => toast.error('Erreur'),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateMutation.mutate({
      titleFr: formData.get('titleFr') as string,
      titleEn: formData.get('titleEn') as string,
      descriptionFr: formData.get('descriptionFr') as string,
      descriptionEn: formData.get('descriptionEn') as string,
      address: formData.get('address') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      phone2: formData.get('phone2') as string,
      workingHoursFr: formData.get('workingHoursFr') as string,
      workingHoursEn: formData.get('workingHoursEn') as string,
      mapEmbedUrl: formData.get('mapEmbedUrl') as string,
    });
  };

  if (isLoading) return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Informations de contact</h1>
        <p className="text-muted-foreground">Modifiez les informations de contact affichées sur le site</p>
      </div>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader><CardTitle>Coordonnées</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="fr">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="fr">Français</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>
              <TabsContent value="fr" className="space-y-4 mt-4">
                <div><Label htmlFor="titleFr">Titre</Label><Input id="titleFr" name="titleFr" defaultValue={info?.titleFr || ''} /></div>
                <div><Label htmlFor="descriptionFr">Description</Label><Input id="descriptionFr" name="descriptionFr" defaultValue={info?.descriptionFr || ''} /></div>
                <div><Label htmlFor="workingHoursFr">Heures d&apos;ouverture</Label><Input id="workingHoursFr" name="workingHoursFr" defaultValue={info?.workingHoursFr || ''} /></div>
              </TabsContent>
              <TabsContent value="en" className="space-y-4 mt-4">
                <div><Label htmlFor="titleEn">Title</Label><Input id="titleEn" name="titleEn" defaultValue={info?.titleEn || ''} /></div>
                <div><Label htmlFor="descriptionEn">Description</Label><Input id="descriptionEn" name="descriptionEn" defaultValue={info?.descriptionEn || ''} /></div>
                <div><Label htmlFor="workingHoursEn">Working hours</Label><Input id="workingHoursEn" name="workingHoursEn" defaultValue={info?.workingHoursEn || ''} /></div>
              </TabsContent>
            </Tabs>
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label htmlFor="address">Adresse</Label><Input id="address" name="address" defaultValue={info?.address || ''} /></div>
              <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" defaultValue={info?.email || ''} /></div>
              <div><Label htmlFor="phone">Téléphone principal</Label><Input id="phone" name="phone" defaultValue={info?.phone || ''} /></div>
              <div><Label htmlFor="phone2">Téléphone secondaire</Label><Input id="phone2" name="phone2" defaultValue={info?.phone2 || ''} /></div>
            </div>
            <div><Label htmlFor="mapEmbedUrl">URL d&apos;intégration Google Maps</Label><Input id="mapEmbedUrl" name="mapEmbedUrl" defaultValue={info?.mapEmbedUrl || ''} placeholder="https://www.google.com/maps/embed?..." /></div>
            <div className="flex justify-end">
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Enregistrer
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

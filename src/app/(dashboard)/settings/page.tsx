
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useDeveloperProfile, useUpdateProfile, useUpdatePayoutSettings, useDeleteAccount } from '@/hooks/use-developer';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Mail, User, Key, CreditCard, Trash2, Loader2, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [tab, setTab] = useState('profile');
  const { data: dev, isLoading } = useDeveloperProfile();
  const updateProfile = useUpdateProfile();
  const updatePayout = useUpdatePayoutSettings();
  const deleteAccount = useDeleteAccount();

  // Profile form state
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    avatarUrl: '',
  });

  // Payout form state
  const [payoutEmail, setPayoutEmail] = useState('');

  // Sync dev data to form state
  useEffect(() => {
    if (dev) {
      setProfile({
        name: dev.name || '',
        bio: dev.bio || '',
        avatarUrl: dev.avatarUrl || '',
      });
      setPayoutEmail(dev.payoutEmail || '');
    }
  }, [dev]);

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your profile, account, and payout settings" />

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="payout">Payout</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your public profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-32" />
                </div>
              ) : (
                <form
                  className="space-y-4"
                  onSubmit={e => {
                    e.preventDefault();
                    updateProfile.mutate({
                      name: profile.name,
                      bio: profile.bio,
                      avatarUrl: profile.avatarUrl,
                    });
                  }}
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                      <AvatarFallback>{profile.name?.[0] || '?'}</AvatarFallback>
                    </Avatar>
                    <Input
                      type="url"
                      placeholder="Avatar URL"
                      value={profile.avatarUrl}
                      onChange={e => setProfile(p => ({ ...p, avatarUrl: e.target.value }))}
                    />
                  </div>
                  <Input
                    type="text"
                    placeholder="Name"
                    value={profile.name}
                    onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                    minLength={2}
                    required
                  />
                  <Textarea
                    placeholder="Bio"
                    value={profile.bio}
                    onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                    minLength={4}
                  />
                  <Button type="submit" disabled={updateProfile.isPending}>
                    {updateProfile.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <User className="h-4 w-4 mr-2" />}
                    Save Profile
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account">
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <Skeleton className="h-4 w-40" />
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{dev?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Password managed by Firebase Auth</span>
                  </div>
                  <Button variant="outline" disabled>
                    Change Password (Coming Soon)
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payout Tab */}
        <TabsContent value="payout">
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle>Payout Settings</CardTitle>
              <CardDescription>Configure your payout email and connect Stripe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <Skeleton className="h-4 w-40" />
              ) : (
                <form
                  className="space-y-4"
                  onSubmit={e => {
                    e.preventDefault();
                    updatePayout.mutate({ payoutEmail });
                  }}
                >
                  <Input
                    type="email"
                    placeholder="Payout Email"
                    value={payoutEmail}
                    onChange={e => setPayoutEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" disabled={updatePayout.isPending}>
                    {updatePayout.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CreditCard className="h-4 w-4 mr-2" />}
                    Save Payout Email
                  </Button>
                  <Button variant="outline" disabled>
                    Connect Stripe (Coming Soon)
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Email preferences (coming soon)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Notification settings will be available in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Danger Zone Tab */}
        <TabsContent value="danger">
          <Card className="max-w-xl border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Delete your account permanently</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={deleteAccount.isPending}>
                    {deleteAccount.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action is irreversible. All your data will be deleted. Are you sure?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteAccount.mutate()}>
                      Confirm Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {deleteAccount.isSuccess && (
                <div className="flex items-center gap-2 mt-4 text-green-600">
                  <CheckCircle2 className="h-4 w-4" /> Account deleted (mock)
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

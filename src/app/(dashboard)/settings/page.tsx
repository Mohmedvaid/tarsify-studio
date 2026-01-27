
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useDeveloperProfile, useUpdateProfile } from '@/hooks/use-developer';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, User, Key, CreditCard, Loader2 } from 'lucide-react';
import type { Developer } from '@/types/api';

// Extracted form component to handle its own state
function ProfileForm({ dev }: { dev: Developer }) {
  const updateProfile = useUpdateProfile();
  const [profile, setProfile] = useState({
    displayName: dev.displayName || '',
    bio: dev.bio || '',
    avatarUrl: dev.avatarUrl || '',
  });

  return (
    <form
      className="space-y-4"
      onSubmit={e => {
        e.preventDefault();
        updateProfile.mutate({
          displayName: profile.displayName,
          bio: profile.bio || null,
          avatarUrl: profile.avatarUrl || null,
        });
      }}
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
          <AvatarFallback>{profile.displayName?.[0] || '?'}</AvatarFallback>
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
        placeholder="Display Name"
        value={profile.displayName}
        onChange={e => setProfile(p => ({ ...p, displayName: e.target.value }))}
        minLength={2}
        maxLength={100}
        required
      />
      <Textarea
        placeholder="Bio (max 500 characters)"
        value={profile.bio}
        onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
        maxLength={500}
      />
      <Button type="submit" disabled={updateProfile.isPending}>
        {updateProfile.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <User className="h-4 w-4 mr-2" />}
        Save Profile
      </Button>
    </form>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState('profile');
  const { data: dev, isLoading, isFetching } = useDeveloperProfile();

  // Show loading state while fetching
  const showLoading = isLoading || (!dev && isFetching);

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your profile and account settings" />

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your public profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {showLoading || !dev ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-10 w-32" />
                </div>
              ) : (
                <ProfileForm dev={dev} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account">
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {showLoading ? (
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
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Total Earnings: <span className="font-mono">${((dev?.totalEarnings || 0) / 100).toFixed(2)}</span>
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

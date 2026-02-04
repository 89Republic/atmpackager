'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and security settings</p>
      </div>
      
      <div className="space-y-6 max-w-2xl">
        {/* Profile Settings */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <Input defaultValue="Admin User" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Email Address</label>
              <Input type="email" defaultValue="admin@atmpackager.com" className="mt-1" />
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Security</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Change Password</label>
              <Input type="password" placeholder="Current password" className="mb-2" />
              <Input type="password" placeholder="New password" className="mb-2" />
              <Input type="password" placeholder="Confirm password" />
            </div>
            <Button className="w-full sm:w-auto">Update Password</Button>
          </div>
        </Card>

        <div className="flex gap-2">
          <Button className="w-full sm:w-auto">Save Changes</Button>
          <Button variant="outline" className="w-full sm:w-auto">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

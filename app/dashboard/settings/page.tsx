'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your system configuration</p>
      </div>
      <div className="space-y-6 max-w-2xl">

      {/* Profile Settings */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Profile Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Full Name</label>
            <Input defaultValue="Admin User" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Email Address</label>
            <Input type="email" defaultValue="admin@atmpackager.com" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Organization</label>
            <Input defaultValue="ATM Packager Inc." className="mt-1" />
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Security Settings</h2>
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

      {/* Notification Settings */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Notification Settings</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm text-foreground">Email alerts for critical issues</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm text-foreground">SMS notifications for downtime</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm text-foreground">Daily summary reports</span>
          </label>
        </div>
      </Card>

      {/* API Keys */}
      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-foreground">API Keys</h2>
          <Button variant="outline" size="sm">
            Generate New Key
          </Button>
        </div>
        <div className="space-y-2 text-sm">
          <div className="p-3 bg-muted/50 rounded-md flex justify-between items-center">
            <span className="text-muted-foreground">atm_live_xxxxxxxxxxxxx</span>
            <button className="text-xs px-2 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded transition-colors">
              Copy
            </button>
          </div>
          <div className="p-3 bg-muted/50 rounded-md flex justify-between items-center">
            <span className="text-muted-foreground">atm_test_yyyyyyyyyyyyy</span>
            <button className="text-xs px-2 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded transition-colors">
              Copy
            </button>
          </div>
        </div>
      </Card>

      {/* Network Settings */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Network Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Server Endpoint</label>
            <Input defaultValue="https://api.atmpackager.com" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Connection Timeout (seconds)</label>
            <Input type="number" defaultValue="30" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Retry Attempts</label>
            <Input type="number" defaultValue="3" className="mt-1" />
          </div>
        </div>
      </Card>

      {/* Database Settings */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Database Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Database Host</label>
            <Input defaultValue="db.atmpackager.local" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Database Port</label>
            <Input type="number" defaultValue="5432" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Connection Pool Size</label>
            <Input type="number" defaultValue="10" className="mt-1" />
          </div>
        </div>
      </Card>

      {/* Cache Settings */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Cache Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Cache Provider</label>
            <select className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm">
              <option>Redis</option>
              <option>Memcached</option>
              <option>In-Memory</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Cache TTL (seconds)</label>
            <Input type="number" defaultValue="3600" className="mt-1" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm text-foreground">Enable Cache Compression</span>
          </label>
        </div>
      </Card>

      <div className="flex gap-2">
        <Button className="w-full sm:w-auto">Save Changes</Button>
        <Button variant="outline" className="w-full sm:w-auto bg-transparent">
          Reset to Defaults
        </Button>
      </div>
      </div>
    </div>
  )
}

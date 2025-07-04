import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../contexts/NotificationContext'
import { useCurrency } from '../contexts/CurrencyContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { mockSettings, availableCurrencies, propertySettingsManagement } from '../data/mockData'
import { Settings as SettingsType, PropertySettings } from '../types'

const Settings: React.FC = () => {
  const { currentUser } = useAuth()
  const { addNotification } = useNotifications()
  const { currency, setCurrency } = useCurrency()
  const [settings, setSettings] = useState<SettingsType>(mockSettings)
  const [propertySettings, setPropertySettings] = useState<PropertySettings>(
    propertySettingsManagement.getSettings()
  )
  const [loading, setLoading] = useState(false)
  const [showWifiPassword, setShowWifiPassword] = useState(false)

  const handleSaveSettings = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Update currency in context
    setCurrency(settings.currency)
    
    // Update property settings if user is master
    if (currentUser?.role === 'master') {
      propertySettingsManagement.updateSettings({
        unitNo: propertySettings.unitNo,
        address: propertySettings.address,
        propertyName: propertySettings.propertyName,
        wifiSSID: propertySettings.wifiSSID,
        wifiPassword: propertySettings.wifiPassword,
        updatedBy: currentUser.id
      })
    }
    
    addNotification({
      type: 'success',
      title: 'Settings Saved',
      message: 'Your settings have been updated successfully'
    })
    setLoading(false)
  }

  const handleNotificationToggle = (type: keyof SettingsType['notifications']) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }))
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="glass-card p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">Please select a user role to access settings</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          {currentUser.role === 'master' 
            ? 'Manage house settings and preferences' 
            : 'Update your notification preferences'
          }
        </p>
      </div>

      {/* Master Tenant Settings */}
      {currentUser.role === 'master' && (
        <>
          {/* Property Information */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h2>
            <div className="space-y-4">
              <Input
                label="Unit Number *"
                type="text"
                value={propertySettings.unitNo}
                onChange={(e) => setPropertySettings(prev => ({ ...prev, unitNo: e.target.value }))}
                placeholder="e.g., Unit 15-A, Apartment 203, Block B"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Address *
                </label>
                <textarea
                  value={propertySettings.address}
                  onChange={(e) => setPropertySettings(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="e.g., 123 Sunrise Avenue, Kuala Lumpur 50450, Malaysia"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 h-20 resize-none"
                  required
                />
              </div>

              <Input
                label="Property Name (Optional)"
                type="text"
                value={propertySettings.propertyName || ''}
                onChange={(e) => setPropertySettings(prev => ({ ...prev, propertyName: e.target.value }))}
                placeholder="e.g., Sunrise Residence, The Gardens"
              />

              <Input
                label="WiFi Network Name (SSID)"
                type="text"
                value={propertySettings.wifiSSID || ''}
                onChange={(e) => setPropertySettings(prev => ({ ...prev, wifiSSID: e.target.value }))}
                placeholder="e.g., MyHome_WiFi, Residence_5G"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WiFi Password
                </label>
                <div className="relative">
                  <input
                    type={showWifiPassword ? 'text' : 'password'}
                    value={propertySettings.wifiPassword || ''}
                    onChange={(e) => setPropertySettings(prev => ({ ...prev, wifiPassword: e.target.value }))}
                    placeholder="Enter WiFi password"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
                  />
                  <button
                    type="button"
                    onClick={() => setShowWifiPassword(!showWifiPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showWifiPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L12 12m-2.122-2.122a3 3 0 013.182-.162M12 12l4.242 4.242M12 12v6" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                This information will be displayed to all tenants in their dashboard. WiFi credentials will help tenants easily connect to the network.
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Rent & Utilities</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select 
                  value={settings.currency.code}
                  onChange={(e) => {
                    const selectedCurrency = availableCurrencies.find(c => c.code === e.target.value)
                    if (selectedCurrency) {
                      setSettings(prev => ({ ...prev, currency: selectedCurrency }))
                    }
                  }}
                  className="glass-input w-full"
                >
                  {availableCurrencies.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.symbol} - {curr.name} ({curr.code})
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label={`Total Monthly Rent (${settings.currency.symbol})`}
                type="number"
                value={settings.totalRent}
                onChange={(e) => setSettings(prev => ({ ...prev, totalRent: Number(e.target.value) }))}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Electricity Split
                  </label>
                  <select 
                    value={settings.utilitySplit.electricity}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      utilitySplit: { ...prev.utilitySplit, electricity: e.target.value as 'equal' | 'custom' }
                    }))}
                    className="glass-input w-full"
                  >
                    <option value="equal">Equal Split</option>
                    <option value="custom">Custom Split</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Water Split
                  </label>
                  <select 
                    value={settings.utilitySplit.water}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      utilitySplit: { ...prev.utilitySplit, water: e.target.value as 'equal' | 'custom' }
                    }))}
                    className="glass-input w-full"
                  >
                    <option value="equal">Equal Split</option>
                    <option value="custom">Custom Split</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Internet Split
                  </label>
                  <select 
                    value={settings.utilitySplit.internet}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      utilitySplit: { ...prev.utilitySplit, internet: e.target.value as 'equal' | 'custom' }
                    }))}
                    className="glass-input w-full"
                  >
                    <option value="equal">Equal Split</option>
                    <option value="custom">Custom Split</option>
                  </select>
                </div>
              </div>

              <Input
                label="Bill Reminder Day (1-31)"
                type="number"
                min="1"
                max="31"
                value={settings.reminderDay}
                onChange={(e) => setSettings(prev => ({ ...prev, reminderDay: Number(e.target.value) }))}
              />
            </div>
          </Card>
        </>
      )}

      {/* Notification Settings */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 glass rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Web Push Notifications</h3>
              <p className="text-sm text-gray-600">Receive notifications in your browser</p>
            </div>
            <button
              onClick={() => handleNotificationToggle('webPush')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications.webPush ? 'bg-primary-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications.webPush ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 glass rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Email Notifications</h3>
              <p className="text-sm text-gray-600">Receive notifications via email</p>
            </div>
            <button
              onClick={() => handleNotificationToggle('email')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications.email ? 'bg-primary-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications.email ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 glass rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">ntfy.sh Notifications</h3>
              <p className="text-sm text-gray-600">Receive push notifications via ntfy.sh</p>
            </div>
            <button
              onClick={() => handleNotificationToggle('ntfy')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications.ntfy ? 'bg-primary-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications.ntfy ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 glass rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Discord Notifications</h3>
              <p className="text-sm text-gray-600">Receive notifications via Discord webhook</p>
            </div>
            <button
              onClick={() => handleNotificationToggle('discord')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications.discord ? 'bg-primary-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications.discord ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings} 
          loading={loading}
          size="lg"
        >
          Save Settings
        </Button>
      </div>
    </div>
  )
}

export default Settings 
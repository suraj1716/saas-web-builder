import { Inertia } from '@inertiajs/inertia';
import { useState } from 'react';
import { Website, WebsiteDetails } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

type Props = {
  website: Website;
  details: WebsiteDetails;
};

export default function SettingsPage({ website, details }: Props) {
  const [form, setForm] = useState({
    business_name: details.business_name || '',
    business_email: details.business_email || '',
    phone: details.phone || '',
    address_line_1: details.address_line_1 || '',
    city: details.city || '',
    country: details.country || '',
    facebook: details.facebook || '',
    instagram: details.instagram || '',
    twitter: details.twitter || '',
    linkedin: details.linkedin || '',
    youtube: details.youtube || '',
    custom_domain: details.custom_domain || '',
    logo: null as File | null,
    favicon: null as File | null,
  });

  // Previews for logo/favicon
  const [previews, setPreviews] = useState({
    logo: details.logo ? `/storage/${details.logo}` : '',
    favicon: details.favicon ? `/storage/${details.favicon}` : '',
  });

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setForm(prev => ({ ...prev, [e.target.name]: file }));
    setPreviews(prev => ({ ...prev, [e.target.name]: URL.createObjectURL(file) }));
  };

  // Submit form via Inertia
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
        } else {
          formData.append(key, value as string | Blob);
        }
      }
    });

    Inertia.post(`/websites/${website.id}/update-settings`, formData, {
        onSuccess: () => {
          alert('Settings updated successfully!');
          Inertia.reload(); // reload the page without breaking SPA
        },
      });
  };

  return (
    <AuthenticatedLayout>    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
      <h2 className="text-xl font-semibold">Branding</h2>

      <div>
        <label className="block mb-1">Logo</label>
        <input type="file" name="logo" onChange={handleFileChange} />
        {previews.logo && <img src={previews.logo} className="h-12 w-12 mt-1" />}
      </div>

      <div>
        <label className="block mb-1">Favicon</label>
        <input type="file" name="favicon" onChange={handleFileChange} />
        {previews.favicon && <img src={previews.favicon} className="h-6 w-6 mt-1" />}
      </div>

      <h2 className="text-xl font-semibold">Business Info</h2>
      <input name="business_name" value={form.business_name} onChange={handleChange} placeholder="Business Name" />
      <input name="business_email" value={form.business_email} onChange={handleChange} placeholder="Business Email" />

      <h2 className="text-xl font-semibold">Contact Info</h2>
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
      <input name="address_line_1" value={form.address_line_1} onChange={handleChange} placeholder="Address" />
      <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
      <input name="country" value={form.country} onChange={handleChange} placeholder="Country" />

      <h2 className="text-xl font-semibold">Social Links</h2>
      <input name="facebook" value={form.facebook} onChange={handleChange} placeholder="Facebook URL" />
      <input name="instagram" value={form.instagram} onChange={handleChange} placeholder="Instagram URL" />
      <input name="twitter" value={form.twitter} onChange={handleChange} placeholder="Twitter URL" />
      <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="LinkedIn URL" />
      <input name="youtube" value={form.youtube} onChange={handleChange} placeholder="YouTube URL" />

      <h2 className="text-xl font-semibold">Custom Domain</h2>
      <input
        name="custom_domain"
        value={form.custom_domain}
        onChange={handleChange}
        placeholder="example.com"
      />
      {details.dns_verified ? (
        <p className="text-green-500 text-sm">DNS Verified ✅</p>
      ) : details.custom_domain ? (
        <p className="text-red-500 text-sm">
          DNS not verified. Make sure A record points to {import.meta.env.VITE_APP_SERVER_IP} and CNAME www points to app.yoursaas.com
        </p>
      ) : null}

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Save Settings
      </button>
    </form>
    </AuthenticatedLayout>

  );
}
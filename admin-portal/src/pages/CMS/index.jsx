import { useEffect, useState } from 'react';
import { getCmsContentApi, updateCmsContentApi, uploadCmsFileApi } from '../../services/api';
import { Settings, Save, RefreshCw } from 'lucide-react';
import { resolveMediaUrl } from '../../utils/mediaUrl.js';
import { validateVideoFile, formatUploadError } from '../../utils/uploadError.js';

import AdminLayout from '../../components/layout/AdminLayout';

const normalizeCmsData = (data) => {
  const out = { ...data };
  for (const key of Object.keys(out)) {
    if (key.endsWith('videoUrl') || key.endsWith('Url')) {
      out[key] = resolveMediaUrl(out[key]);
    }
  }
  return out;
};

export default function CmsIndex() {
  const [cms, setCms] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [heroUploadProgress, setHeroUploadProgress] = useState(0);

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    const validationError = validateVideoFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    setUploadingVideo(true);
    setHeroUploadProgress(0);
    try {
      const res = await uploadCmsFileApi(file, setHeroUploadProgress);
      if (res.success && res.data?.url) {
        const publicUrl = resolveMediaUrl(res.data.url);
        handleChange('home.hero.videoUrl', publicUrl);
        await updateCmsContentApi('home.hero.videoUrl', publicUrl);
        alert('Background video uploaded and saved successfully!');
      } else {
        throw new Error(res.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert(formatUploadError(err, file));
    } finally {
      setUploadingVideo(false);
      setHeroUploadProgress(0);
    }
  };

  const fetchCms = async () => {
    setLoading(true);
    try {
      const res = await getCmsContentApi();
      if (res.success && res.data) {
        setCms(normalizeCmsData(res.data));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCms();
  }, []);

  const handleChange = (key, value) => {
    setCms((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async (key) => {
    setSaving(true);
    try {
      const value = cms[key] !== undefined && cms[key] !== null ? cms[key] : '';
      const res = await updateCmsContentApi(key, value);
      if (res.success) {
        alert(`CMS key '${key}' updated successfully!`);
      } else {
        throw new Error(res.error || 'Failed to update key');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to save change');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { value: 'home', label: 'Homepage' },
    { value: 'about', label: 'About Us' },
    { value: 'contact', label: 'Contact & Footer' },
  ];

  if (loading) {
    return (
      <AdminLayout title="CMS Configuration Editor">
        <div className="w-full h-96 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-accent border-t-transparent animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="CMS Configuration Editor">
      <div className="flex flex-col gap-6 select-none max-w-4xl mx-auto">
        
        {/* Tab Items Row */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-6 py-3 text-xs tracking-wider uppercase font-semibold border-b-2 transition-all
                ${activeTab === tab.value 
                  ? 'border-accent text-accent' 
                  : 'border-transparent text-muted hover:text-primary'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CMS Editor Forms */}
        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
          
          {/* HOMEPAGE CMS */}
          {activeTab === 'home' && (
            <div className="flex flex-col gap-6">
              
              <div className="border-b border-border/60 pb-3">
                <h3 className="text-sm font-bold text-primary">Hero Section Configuration</h3>
                <p className="text-xs text-muted">Manage the background video, titles, and subtitle description of your landing page Hero.</p>
              </div>

              {/* Hero Title (Legacy Fallback) */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
                    Hero Section Main Header - Legacy Fallback (`home.hero.title`)
                  </label>
                  <button
                    onClick={() => handleSave('home.hero.title')}
                    disabled={saving}
                    className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5 focus:outline-none transition-colors disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
                <input
                  type="text"
                  value={cms['home.hero.title'] || ''}
                  onChange={(e) => handleChange('home.hero.title', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-primary outline-none focus:ring-4 focus:ring-accent-light focus:border-accent"
                  placeholder="e.g. Engineering Talent. Delivered Personally."
                />
              </div>

              {/* Hero Title Part 1 & Part 2 Side-by-Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Hero Title Part 1 */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
                      Hero Title - Part 1 (Regular) (`home.hero.title1`)
                    </label>
                    <button
                      onClick={() => handleSave('home.hero.title1')}
                      disabled={saving}
                      className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5 focus:outline-none transition-colors disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" /> Save
                    </button>
                  </div>
                  <input
                    type="text"
                    value={cms['home.hero.title1'] || ''}
                    onChange={(e) => handleChange('home.hero.title1', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-primary outline-none focus:ring-4 focus:ring-accent-light focus:border-accent"
                    placeholder="e.g. Engineering Talent."
                  />
                </div>

                {/* Hero Title Part 2 */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
                      Hero Title - Part 2 (Accent) (`home.hero.title2`)
                    </label>
                    <button
                      onClick={() => handleSave('home.hero.title2')}
                      disabled={saving}
                      className="text-xs font-bold text-accent color hover:underline flex items-center gap-1 focus:outline-none"
                    >
                      <Save className="w-3.5 h-3.5" /> Save
                    </button>
                  </div>
                  <input
                    type="text"
                    value={cms['home.hero.title2'] || ''}
                    onChange={(e) => handleChange('home.hero.title2', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-primary outline-none focus:ring-4 focus:ring-accent-light focus:border-accent"
                    placeholder="e.g. Recruitment"
                  />
                </div>
              </div>

              {/* Hero Subtitle */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
                    Hero Section Subtitle Description (`home.hero.subtitle`)
                  </label>
                  <button
                    onClick={() => handleSave('home.hero.subtitle')}
                    disabled={saving}
                    className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5 focus:outline-none transition-colors disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
                <textarea
                  value={cms['home.hero.subtitle'] || ''}
                  onChange={(e) => handleChange('home.hero.subtitle', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-primary outline-none resize-none focus:ring-4 focus:ring-accent-light focus:border-accent"
                />
              </div>

              {/* Background Video Section */}
              <div className="flex flex-col gap-2 border-t border-border/60 pt-6 mt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
                    Hero Background Video URL (`home.hero.videoUrl`)
                  </label>
                  <button
                    onClick={() => handleSave('home.hero.videoUrl')}
                    disabled={saving}
                    className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5 focus:outline-none transition-colors disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <input
                    type="text"
                    value={cms['home.hero.videoUrl'] || ''}
                    onChange={(e) => handleChange('home.hero.videoUrl', e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-border bg-surface text-sm text-primary outline-none focus:ring-4 focus:ring-accent-light focus:border-accent"
                    placeholder="Enter video URL or upload file..."
                  />
                  <div className="relative">
                    <input
                      type="file"
                      id="video-upload"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={handleVideoUpload}
                      disabled={uploadingVideo}
                      className="hidden"
                    />
                    <label
                      htmlFor="video-upload"
                      className={`px-4 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-700 shadow-sm transition-colors
                        ${uploadingVideo ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {uploadingVideo ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Uploading{heroUploadProgress > 0 ? ` ${heroUploadProgress}%` : '...'}
                        </>
                      ) : (
                        'Upload Video File'
                      )}
                    </label>
                  </div>
                </div>
                <p className="text-[10px] text-muted font-medium">
                  Supports .mp4, .webm, .mov up to 100MB. For reliable uploads, use videos under 25MB (720p, H.264).
                </p>
                {uploadingVideo && heroUploadProgress > 0 && (
                  <div className="w-full max-w-sm h-1.5 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all duration-300"
                      style={{ width: `${heroUploadProgress}%` }}
                    />
                  </div>
                )}

                {/* Video Playback Preview */}
                {cms['home.hero.videoUrl'] && (
                  <div className="mt-3 rounded-2xl overflow-hidden border border-border bg-bg-page p-2.5 max-w-sm shadow-sm">
                    <video
                      src={resolveMediaUrl(cms['home.hero.videoUrl'])}
                      className="w-full h-[160px] object-cover rounded-xl"
                      controls
                      muted
                      playsInline
                    />
                    <div className="flex justify-between items-center mt-3 px-1">
                      <span className="text-[10px] text-muted truncate max-w-[200px] font-mono">
                        {resolveMediaUrl(cms['home.hero.videoUrl'])}
                      </span>
                      <button
                        onClick={async () => {
                          handleChange('home.hero.videoUrl', '');
                          await updateCmsContentApi('home.hero.videoUrl', '');
                        }}
                        className="text-[10px] text-red-500 hover:underline font-bold uppercase tracking-wide"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Horizontal Marquee Statline */}
              {/* <div className="flex flex-col gap-2 border-t border-border/60 pt-6 mt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
                    Horizontal Marquee Stats Bar (`home.marquee.stats`)
                  </label>
                  <button
                    onClick={() => handleSave('home.marquee.stats')}
                    disabled={saving}
                    className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5 focus:outline-none transition-colors disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
                <input
                  type="text"
                  value={cms['home.marquee.stats'] || ''}
                  onChange={(e) => handleChange('home.marquee.stats', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-primary outline-none focus:ring-4 focus:ring-accent-light focus:border-accent"
                />
              </div> */}

            </div>
          )}

          {/* ABOUT US CMS */}
          {activeTab === 'about' && (
            <div className="flex flex-col gap-6">
              
              {/* Title */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
                    About Page Heading (`about.title`)
                  </label>
                  <button
                    onClick={() => handleSave('about.title')}
                    disabled={saving}
                    className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5 focus:outline-none transition-colors disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
                <input
                  type="text"
                  value={cms['about.title'] || ''}
                  onChange={(e) => handleChange('about.title', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-primary outline-none focus:ring-4 focus:ring-accent-light focus:border-accent"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
                    About Page Description block (`about.description`)
                  </label>
                  <button
                    onClick={() => handleSave('about.description')}
                    disabled={saving}
                    className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5 focus:outline-none transition-colors disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
                <textarea
                  value={cms['about.description'] || ''}
                  onChange={(e) => handleChange('about.description', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-primary outline-none resize-none focus:ring-4 focus:ring-accent-light focus:border-accent"
                />
              </div>

            </div>
          )}

          {/* CONTACT INFO CMS */}
          {activeTab === 'contact' && (
            <div className="flex flex-col gap-6">
              
              {/* Phone */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
                    Contact Phone Number (`contact.phone`)
                  </label>
                  <button
                    onClick={() => handleSave('contact.phone')}
                    disabled={saving}
                    className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5 focus:outline-none transition-colors disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
                <input
                  type="text"
                  value={cms['contact.phone'] || ''}
                  onChange={(e) => handleChange('contact.phone', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-primary outline-none focus:ring-4 focus:ring-accent-light focus:border-accent"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
                    Contact Email Address (`contact.email`)
                  </label>
                  <button
                    onClick={() => handleSave('contact.email')}
                    disabled={saving}
                    className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5 focus:outline-none transition-colors disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
                <input
                  type="email"
                  value={cms['contact.email'] || ''}
                  onChange={(e) => handleChange('contact.email', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-primary outline-none focus:ring-4 focus:ring-accent-light focus:border-accent"
                />
              </div>

              {/* Office Address */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
                    Office Address Line (`contact.address`)
                  </label>
                  <button
                    onClick={() => handleSave('contact.address')}
                    disabled={saving}
                    className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5 focus:outline-none transition-colors disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
                <input
                  type="text"
                  value={cms['contact.address'] || ''}
                  onChange={(e) => handleChange('contact.address', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-primary outline-none focus:ring-4 focus:ring-accent-light focus:border-accent"
                />
              </div>

              {/* Footer copyright */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-primary/80 uppercase tracking-wide">
                    Footer Copyright string (`footer.copyright`)
                  </label>
                  <button
                    onClick={() => handleSave('footer.copyright')}
                    disabled={saving}
                    className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5 focus:outline-none transition-colors disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
                <input
                  type="text"
                  value={cms['footer.copyright'] || ''}
                  onChange={(e) => handleChange('footer.copyright', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm text-primary outline-none focus:ring-4 focus:ring-accent-light focus:border-accent"
                />
              </div>

            </div>
          )}

        </div>

      </div>
    </AdminLayout>
  );
}

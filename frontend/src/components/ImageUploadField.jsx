import React, { useState, useRef } from 'react';
import { Upload, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { getImageUrl } from '../utils/imageUrl';

export const ImageUploadField = ({
  label,
  value,
  onChange,
  uploadEndpoint = '/upload/client-logo',
  shape = 'square', // 'square' | 'circle'
  fallbackInitials = '',
  helpText = 'JPEG, PNG, WebP up to 15MB. Automatically compressed to modern WebP (~50-100KB).',
  disabled = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const displayImage = previewUrl || (value ? getImageUrl(value) : null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error & set local preview immediately
    setErrorMsg('');
    const localBlob = URL.createObjectURL(file);
    setPreviewUrl(localBlob);

    // Prepare FormData
    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    setUploadProgressMsg('Compressing to WebP...');

    try {
      const res = await api.post(uploadEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data?.success && res.data?.data?.url) {
        const savedUrl = res.data.data.url;
        const sizeKb = (res.data.data.sizeBytes / 1024).toFixed(1);
        setUploadProgressMsg(`WebP compressed: ${sizeKb} KB`);
        onChange(savedUrl, res.data.data);
      } else {
        throw new Error(res.data?.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      const serverMsg = err.response?.data?.message || err.message || 'Failed to upload and compress image.';
      setErrorMsg(serverMsg);
      // Revert preview on failure if there was no prior value
      if (!value) {
        setPreviewUrl(null);
      }
    } finally {
      setIsUploading(false);
      // Clear file input value so selecting the same file again triggers change
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreviewUrl(null);
    setErrorMsg('');
    setUploadProgressMsg('');
    onChange('', null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isCircle = shape === 'circle';

  return (
    <div className="form-group" style={{ marginBottom: '16px' }}>
      {label && <label className="form-label">{label}</label>}

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {/* Preview Container */}
        <div
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          style={{
            width: isCircle ? '84px' : '90px',
            height: isCircle ? '84px' : '84px',
            borderRadius: isCircle ? '50%' : '10px',
            border: '2px dashed var(--border-color)',
            backgroundColor: 'var(--bg-app, #f8fafc)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            cursor: disabled || isUploading ? 'not-allowed' : 'pointer',
            flexShrink: 0,
            transition: 'border-color 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }}
          title={displayImage ? 'Click to change image' : 'Click to select image'}
        >
          {displayImage ? (
            <img
              src={displayImage}
              alt="Preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: isCircle ? 'cover' : 'contain',
                backgroundColor: '#ffffff'
              }}
            />
          ) : fallbackInitials ? (
            <span
              style={{
                fontSize: '20px',
                fontWeight: 800,
                color: 'var(--primary)',
                textTransform: 'uppercase'
              }}
            >
              {fallbackInitials.slice(0, 2)}
            </span>
          ) : (
            <ImageIcon size={28} style={{ color: 'var(--text-muted, #94a3b8)' }} />
          )}

          {/* Uploading Overlay */}
          {isUploading && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.55)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <Loader2 size={24} className="spin" />
            </div>
          )}
        </div>

        {/* Action Controls & Info */}
        <div style={{ flex: 1, minWidth: '180px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              style={{ display: 'none' }}
              disabled={disabled || isUploading}
            />

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || isUploading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
            >
              <Upload size={14} />
              {displayImage ? 'Replace Photo' : 'Upload Image'}
            </button>

            {displayImage && !disabled && !isUploading && (
              <button
                type="button"
                className="btn btn-secondary btn-sm text-danger"
                onClick={handleRemove}
                title="Remove image"
                style={{ padding: '6px 8px' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status / Message */}
          {uploadProgressMsg && !errorMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                color: 'var(--success, #16a34a)',
                fontWeight: 600,
                marginBottom: '4px'
              }}
            >
              <Check size={12} /> {uploadProgressMsg}
            </div>
          )}

          {errorMsg && (
            <div
              style={{
                fontSize: '11px',
                color: 'var(--danger, #dc2626)',
                fontWeight: 600,
                marginBottom: '4px'
              }}
            >
              {errorMsg}
            </div>
          )}

          <div style={{ fontSize: '11px', color: 'var(--text-muted, #64748b)', lineHeight: 1.4 }}>
            {helpText}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadField;

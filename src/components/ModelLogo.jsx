'use client';

import Image from 'next/image';
import { useState } from 'react';
import { resolveModelLogo, resolveVendorLogo } from '../lib/model-logo-map.mjs';
import styles from '../app/ai-models/ai-models.module.css';

export default function ModelLogo({
  model = null,
  vendor = null,
  frameSize = null,
  imageSize = 30,
  className = '',
  decorative = false,
  priority = false
}) {
  const logo = model ? resolveModelLogo(model, vendor) : resolveVendorLogo(vendor);
  const [failedSrc, setFailedSrc] = useState(null);
  const showImage = logo.type === 'image' && logo.src && failedSrc !== logo.src;

  return (
    <span
      className={`${styles.modelLogoFrame} ${className}`.trim()}
      style={frameSize ? { width: frameSize, height: frameSize } : undefined}
      {...(decorative ? { 'aria-hidden': 'true' } : {})}
    >
      {showImage ? (
        <Image
          className={styles.modelLogoImage}
          src={logo.src}
          alt={decorative ? '' : logo.alt}
          width={imageSize}
          height={imageSize}
          priority={priority}
          onError={() => setFailedSrc(logo.src)}
        />
      ) : (
        <span
          className={styles.modelLogoFallback}
          {...(decorative ? {} : { role: 'img', 'aria-label': logo.alt })}
        >
          {logo.fallbackText}
        </span>
      )}
    </span>
  );
}

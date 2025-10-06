import React, { useEffect, useState } from 'react';

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
}

// In-memory cache to avoid re-fetching the same icon.
const iconCache = new Map<string, string>();

const Icon: React.FC<IconProps> = ({ name, className, ...props }) => {
  const [svg, setSvg] = useState<string | null>(iconCache.get(name) || null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (svg || error || !name) return;

    let isMounted = true;
    fetch(`/icons/${name}.svg`)
      .then(res => {
        if (!res.ok) throw new Error(`SVG not found: ${name}.svg`);
        return res.text();
      })
      .then(text => {
        if (isMounted) {
            // Ensure the SVG scales to its container
            let processedText = text;
            if (!processedText.includes('width=') && !processedText.includes('height=')) {
               processedText = text.replace(/<svg /, '<svg width="100%" height="100%" ');
            }
            iconCache.set(name, processedText);
            setSvg(processedText);
        }
      })
      .catch((e) => {
        console.error(e);
        if (isMounted) setError(true);
      });
      
    return () => { isMounted = false; };
  }, [name, svg, error]);

  if (error) {
    return <span className={`inline-block w-6 h-6 bg-red-900 border border-red-500 rounded-sm ${className || ''}`} title={`Error loading icon: ${name}`} />;
  }
  
  return (
    <span
      {...props}
      aria-hidden="true" // Decorative icons should be hidden from screen readers
      className={`inline-block leading-none align-middle ${className || 'w-6 h-6'}`}
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  );
};

export default Icon;
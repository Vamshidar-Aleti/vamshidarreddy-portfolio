import { useEffect, useRef, useState } from 'react';

const useScrollAnimation = <T extends HTMLElement>(options?: IntersectionObserverInit) => {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      // Trigger if the element is intersecting
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Stop observing once it's visible to prevent re-triggering
        observer.unobserve(element);
      }
    }, {
      threshold: 0.1, // Trigger when 10% of the element is visible
      ...options
    });

    observer.observe(element);

    // Cleanup observer on component unmount
    return () => {
      observer.unobserve(element);
    };
  }, [options]);

  return [ref, isVisible] as const;
};

export default useScrollAnimation;

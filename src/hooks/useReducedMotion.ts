'use client'

import useMediaQuery from '@mui/material/useMediaQuery'

/**
 * Hook to detect if the user prefers reduced motion.
 * This is an accessibility feature for users with vestibular disorders
 * who may experience discomfort from animations.
 *
 * @returns true if the user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

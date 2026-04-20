'use client'
import { Suspense, lazy, useCallback } from 'react'
import type { Application } from '@splinetool/runtime'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const onLoad = useCallback((app: Application) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const a = app as any
      const renderer = a._renderer || a.renderer
      if (renderer) {
        // page bg is #050508 — alpha 0 = fully transparent canvas
        renderer.setClearAlpha(0)
      }
      const canvas = a.canvas as HTMLCanvasElement | undefined
      if (canvas) {
        canvas.style.background = 'transparent'
      }
    } catch (_) {
      // ignore if internal API changes
    }
  }, [])

  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
        onLoad={onLoad}
        style={{ background: 'transparent' }}
      />
    </Suspense>
  )
}

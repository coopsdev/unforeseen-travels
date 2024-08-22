'use client'

import React, { useEffect, useRef } from 'react'
import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  SceneLoader,
  Vector3,
} from '@babylonjs/core'

import { Media } from '../../../../payload/payload-types'
import { Props as MediaProps } from '../types'

import '@babylonjs/loaders/glTF'

import classes from './index.module.scss'

export type BabylonModelType = {
  modelName: string
  media: Media
}

export const BabylonScene: React.FC<MediaProps> = ({ resource }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const isMedia = (resource: unknown): resource is Record<string, any> =>
      typeof resource === 'object' && resource !== null

    const isModel = (resource: unknown): resource is Media =>
      isMedia(resource) &&
      (resource.mimeType?.includes('model') || resource.mimeType?.includes('octet-stream'))

    const engine = new Engine(canvasRef.current, true)
    const scene = new Scene(engine)

    const camera = new ArcRotateCamera(
      'camera1',
      Math.PI / 2,
      Math.PI / 2.5,
      5,
      Vector3.Zero(),
      scene,
    )
    camera.attachControl(canvasRef.current, true)

    const light = new HemisphericLight('light1', new Vector3(1, 1, 0), scene)
    light.intensity = 0.7

    if (!isModel(resource)) return

    if (isModel(resource))
      SceneLoader.Append(`${process.env.NEXT_PUBLIC_SERVER_URL}/media/`, resource.filename, scene)
    else MeshBuilder.CreateSphere('sphere', { diameter: 2 }, scene)

    engine.runRenderLoop(() => {
      scene.render()
    })

    window.addEventListener('resize', () => {
      engine.resize()
    })

    const disableScroll = () => {
      document.body.style.overflow = 'hidden'
    }

    const enableScroll = () => {
      document.body.style.overflow = 'auto'
    }

    const canvasElement = canvasRef.current
    canvasElement?.addEventListener('mouseenter', disableScroll)
    canvasElement?.addEventListener('mouseleave', enableScroll)

    return () => {
      engine.dispose()
      canvasElement?.removeEventListener('mouseenter', disableScroll)
      canvasElement?.removeEventListener('mouseleave', enableScroll)
    }
  }, [resource])

  return (
    <canvas className={classes.viewer} ref={canvasRef} style={{ width: '100%', height: '100%' }} />
  )
}

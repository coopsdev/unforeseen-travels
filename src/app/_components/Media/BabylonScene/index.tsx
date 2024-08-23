'use client'

import React, { useEffect, useRef } from 'react'
import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
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

    SceneLoader.Append(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/media/`,
      resource.filename,
      scene,
      scene => {
        const meshes = scene.meshes

        if (meshes.length === 0) throw new Error('No meshes were loaded.')

        let minVector = new Vector3(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE)
        let maxVector = new Vector3(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE)

        meshes.forEach(mesh => {
          const boundingInfo = mesh.getBoundingInfo()
          const meshMin = boundingInfo.boundingBox.minimumWorld
          const meshMax = boundingInfo.boundingBox.maximumWorld

          minVector = Vector3.Minimize(minVector, meshMin)
          maxVector = Vector3.Maximize(maxVector, meshMax)
        })

        const boundingBoxCenter = minVector.add(maxVector).scale(0.5)
        const boundingBoxSize = maxVector.subtract(minVector)

        const radius = Math.max(boundingBoxSize.x, boundingBoxSize.y, boundingBoxSize.z)

        camera.target = boundingBoxCenter
        camera.setPosition(
          new Vector3(
            boundingBoxCenter.x + radius,
            boundingBoxCenter.y + radius,
            boundingBoxCenter.z + radius,
          ),
        )
      },
    )

    let isPanning = false
    let startX = 0
    let startY = 0
    let initialTarget = camera.target.clone()

    // right mouse button
    const onMouseDown = (event: {
      button: number
      clientX: number
      clientY: number
      preventDefault: () => void
    }) => {
      if (event.button === 2) {
        isPanning = true
        startX = event.clientX
        startY = event.clientY
        initialTarget = camera.target.clone() // Save the initial target
        event.preventDefault() // Prevent context menu
      }
    }

    const onMouseMove = (event: { clientX: number; clientY: number }) => {
      if (isPanning) {
        const deltaX = (event.clientX - startX) * 0.01
        const deltaY = (startY - event.clientY) * 0.01

        // Update the target position
        const newTarget = initialTarget.add(new Vector3(deltaX, deltaY, 0))
        camera.setTarget(newTarget)

        // Move the camera to maintain the same distance from the new target
        const direction = camera.position.subtract(camera.target).normalize()
        const distance = camera.position.subtract(camera.target).length()
        camera.position = newTarget.add(direction.scale(distance))
      }
    }

    const onMouseUp = () => {
      isPanning = false
    }

    const canvasElement = canvasRef.current
    canvasElement?.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

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

    canvasElement?.addEventListener('mouseenter', disableScroll)
    canvasElement?.addEventListener('mouseleave', enableScroll)

    return () => {
      engine.dispose()
      canvasElement?.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      canvasElement?.removeEventListener('mouseenter', disableScroll)
      canvasElement?.removeEventListener('mouseleave', enableScroll)
    }
  }, [resource])

  return <canvas className={classes.viewer} ref={canvasRef} />
}

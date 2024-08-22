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

import '@babylonjs/loaders'

interface BabylonSceneProps {
  modelUrl?: string
  modelFileName?: string
}

const BabylonScene: React.FC<BabylonSceneProps> = ({ modelUrl, modelFileName }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

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

    // Load model if provided
    if (modelUrl && modelFileName) {
      SceneLoader.Append(modelUrl, modelFileName, scene)
    } else {
      MeshBuilder.CreateSphere('sphere', { diameter: 2 }, scene)
    }

    engine.runRenderLoop(() => {
      scene.render()
    })

    window.addEventListener('resize', () => {
      engine.resize()
    })

    return () => {
      engine.dispose()
    }
  }, [modelUrl, modelFileName])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
}

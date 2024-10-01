import type { Field } from 'payload/types'

import deepMerge from '../../utilities/deepMerge'
import Cell from './cell'
import InputField from './component'

export const validateHexColor = (value = ''): true | string => {
  return value.match(/^#(?:[0-9a-fA-F]{3}){1,2}$/) !== null || `Please give a valid hex color`
}

type colorFieldOptions = (options?: { overrides?: Record<string, unknown> }) => Field

export const colorPicker: colorFieldOptions = ({ overrides = {} } = {}) => {
  const colorField: Field = {
    name: 'color',
    type: 'text',
    validate: validateHexColor,
    required: true,
    admin: {
      components: {
        Field: InputField,
        Cell,
      },
    },
  }

  // Handle 'name' override explicitly
  if (overrides.name) {
    colorField.name = overrides.name as string
    delete overrides.name // Remove name from overrides to avoid conflicts in deepMerge
  }

  return deepMerge(colorField, overrides)
}

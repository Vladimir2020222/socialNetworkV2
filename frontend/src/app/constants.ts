import { Theme } from "./interface/theme.module";


export const serverUrl = 'http://localhost:8000/';


export const themes: {[key: string]: Theme} = {
  dark: {
    'primary-color': '#0d0d17',
    'secondary-color': '#FFFFFF'
  },
  light: {
    'primary-color': '#FFFFFF',
    'secondary-color': '#000000'
  }
}

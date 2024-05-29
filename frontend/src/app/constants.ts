import { Theme } from "./interface/theme.module";


export const serverUrl = 'http://localhost:8080/';

export const themes: {[key: string]: Theme} = {
  dark: {
    'primary-color': '#0d0d17',
    'secondary-color': '#FFFFFF',
    'is-dark-theme': 1,
  },
  light: {
    'primary-color': '#FFFFFF',
    'secondary-color': '#000000',
    'is-dark-theme': 0,
  }
}

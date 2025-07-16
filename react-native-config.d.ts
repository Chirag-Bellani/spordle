declare module 'react-native-config' {
  export interface NativeConfig {
    GOOGLE_MAPS_API_KEY: string;
    API_DEMO_BASEURL: string;
  }

  export const Config: NativeConfig;
  export default Config;
}

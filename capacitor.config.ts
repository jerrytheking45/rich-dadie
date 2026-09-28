import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rediq.app',
  appName: 'REDIQ',
  webDir: 'public',
  server: {
    url: 'https://rediq.vercel.app',
    cleartext: false,
    androidScheme: 'https',
  },
};

export default config;
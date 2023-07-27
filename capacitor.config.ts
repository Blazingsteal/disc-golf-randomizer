import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dgr.app',
  appName: 'disc-golf-randomizer',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

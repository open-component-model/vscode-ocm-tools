export function resolveTilde(filePath: string): string {
    const os = require('os');
    if (!filePath || typeof (filePath) !== 'string') {
      return '';
    }
  
    if (filePath.startsWith('~/') || filePath === '~') {
      return filePath.replace('~', os.homedir());
    }
  
    return filePath;
  }
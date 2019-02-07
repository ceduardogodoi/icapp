import RNFetchBlob from 'rn-fetch-blob';

const { fs } = RNFetchBlob;

/**
 * Retorna o diretório de Downloads do dispositivo Android.
 */
export const downloadDir = fs.dirs.DownloadDir;
export const cartazDir = `${downloadDir}/Cartazes`;

export function deleteCartazes() {
    fs.unlink(cartazDir);
    fs.mkdir(cartazDir);
}

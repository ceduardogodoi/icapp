/**
 * A função responsável por aplicar opções para o Gerenciador de Downloads do Android.
 * @param {string} downloadDir O diretório de Downloads do dispositivo Android.
 * @param {string} documento O nome para o arquivo baixado.
 */
export function downloadOptions(downloadDir, documento) {
    return {
        addAndroidDownloads: {
            useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
            notification: false,
            path: `${downloadDir}/${documento}`, // this is the path where your downloaded file will live in.
            title: 'Download de Cartazes',
            description: 'Baixando arquivo(s)...',
            overwrite: true
        }
    }
}
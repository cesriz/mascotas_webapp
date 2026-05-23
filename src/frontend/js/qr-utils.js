const QR_CODE_URL = 'https://esm.sh/qrcode@1.5.4?bundle';

// Genera la URL publica del anuncio actual, en local devuelve localhost y en produccion devolvera el dominio real
export function getPetDetailUrl(petId) {
    const url = new URL(window.location.href);
    url.searchParams.set('id', petId);
    return url.toString();
}

// Convierte una URL en una imagen QR usando qrcode
export async function generateQrDataUrl(url) {
    const qrModule = await import(QR_CODE_URL);
    const QRCode = qrModule.default || qrModule;

    return await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 512,
        color: {
            dark: '#111827',
            light: '#ffffff'
        }
    });
}

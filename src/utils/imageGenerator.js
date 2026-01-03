import html2canvas from 'html2canvas';

/**
 * Captura um elemento HTML e compartilha/baixa como imagem.
 */
export const generateAndShareImage = async (elementId, fileName = 'carta.png') => {
    const element = document.getElementById(elementId);
    if (!element) return console.error("Elemento não encontrado:", elementId);

    try {
        // Cria o canvas (usando scale 2 para alta resolução)
        const canvas = await html2canvas(element, {
            backgroundColor: '#1A1129', // Cor de fundo do tema
            scale: 2,
            useCORS: true, // Importante para imagens do Firebase/Externas
            logging: false
        });

        // Converte para Blob
        canvas.toBlob(async (blob) => {
            if (!blob) return;

            const file = new File([blob], fileName, { type: 'image/png' });

            // Tenta usar a API nativa de compartilhamento (Mobile)
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: 'CAVALLIN TCG',
                        text: 'Confira este item do leilão!'
                    });
                } catch (shareError) {
                    console.log('Compartilhamento cancelado ou falhou', shareError);
                }
            } else {
                // Fallback para Desktop: Download direto
                const link = document.createElement('a');
                link.download = fileName;
                link.href = canvas.toDataURL();
                link.click();
            }
        }, 'image/png');

    } catch (error) {
        console.error("Erro ao gerar imagem:", error);
        alert("Erro ao gerar imagem. Verifique se a imagem da carta carregou corretamente (CORS).");
    }
};
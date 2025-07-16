export interface WhatsappParams {
   whatsappNumber?: string;
   sex: string;
   color: string;
}

const DEFAULT_WHATSAPP_NUMBER = "5516999724070";

export function generateWhatsappLink({
   whatsappNumber = DEFAULT_WHATSAPP_NUMBER,
   sex,
   color,
}: WhatsappParams): string {
   const text = `Olá! Tenho interesse no filhote "${sex} da cor ${color}", ainda está disponível?`;
   const encodedText = encodeURIComponent(text);
   return `https://wa.me/${whatsappNumber}?text=${encodedText}`;
}

export interface WhatsappParams {
   whatsappNumber?: string;
   sex?: string;
   color?: string;
   text?: string;
}

const DEFAULT_WHATSAPP_NUMBER = "5516999724070";

export function generateWhatsappLink({
   whatsappNumber = DEFAULT_WHATSAPP_NUMBER,
   sex,
   color,
   text,
}: WhatsappParams): string {
   const message = text
      ? text
      : `Olá! Tenho interesse no filhote "${sex} da cor ${color}", ainda está disponível?`;
   const encodedText = encodeURIComponent(message);
   return `https://wa.me/${whatsappNumber}?text=${encodedText}`;
}

export const truncate = (text: string, max = 160) => (text.length > max ? `${text.slice(0, max)}…` : text);

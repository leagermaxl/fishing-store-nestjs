const cyrillicToLatinMap: Record<string, string> = {
	а: 'a',
	б: 'b',
	в: 'v',
	г: 'h',
	ґ: 'g',
	д: 'd',
	е: 'e',
	ё: 'e',
	є: 'ye',
	э: 'e',
	ж: 'zh',
	з: 'z',
	и: 'y',
	і: 'i',
	ї: 'yi',
	й: 'y',
	к: 'k',
	л: 'l',
	м: 'm',
	н: 'n',
	о: 'o',
	п: 'p',
	р: 'r',
	с: 's',
	т: 't',
	у: 'u',
	ф: 'f',
	х: 'kh',
	ц: 'ts',
	ч: 'ch',
	ш: 'sh',
	щ: 'shch',
	ь: '',
	ъ: '',
	ы: 'y',
	ю: 'yu',
	я: 'ya',
};

function transliterate(text: string): string {
	return text
		.toLowerCase()
		.split('')
		.map((char) => cyrillicToLatinMap[char] || char)
		.join('');
}

function slugify(text: string, len = 3): string {
	return transliterate(text)
		.replace(/[^a-zA-Z0-9]/g, '')
		.toUpperCase()
		.slice(0, len);
}

export function generateSKU(
	categoryName: string,
	productName: string,
	productAttribute: string[],
	lengthSyllables: number,
): string {
	return `${slugify(categoryName, lengthSyllables)}-${slugify(productName, lengthSyllables)}-${productAttribute.map((attr) => slugify(attr, lengthSyllables)).join('-')}-${Math.floor(100 + Math.random() * 900)}`;
}

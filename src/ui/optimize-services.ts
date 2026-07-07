export interface OptService {
	name: string;
	url: string;
	descKey: string;
	formats: string[];
}

export const OPT_SERVICES: OptService[] = [
	{
		name: 'SVGOMG',
		url: 'https://jakearchibald.github.io/svgomg/',
		descKey: 'ui.opt_svgomg',
		formats: ['SVG'],
	},
	{
		name: 'TinyPNG',
		url: 'https://tinypng.com/',
		descKey: 'ui.opt_tinypng',
		formats: ['PNG', 'JPG'],
	},
	{
		name: 'Squoosh',
		url: 'https://squoosh.app/',
		descKey: 'ui.opt_squoosh',
		formats: ['PNG', 'JPG'],
	},
	{
		name: 'Compressor.io',
		url: 'https://compressor.io/',
		descKey: 'ui.opt_compressor',
		formats: ['PNG', 'JPG'],
	},
];

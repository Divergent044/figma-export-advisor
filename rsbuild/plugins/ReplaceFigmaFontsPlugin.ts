import type { Compiler, Compilation } from '@rspack/core';
import { sources } from '@rspack/core';

const INTER_FONT_FACE_REGEX =
	/@font-face\s*\{[^}]*src:\s*url\(["']?https?:\/\/rsms\.me\/inter\/font-files\/Inter-(Regular|Medium|SemiBold)\.woff2[^}]*\}\s*/g;

const LOCAL_FONT_FACES = `
@font-face {
  font-family: Inter;
  font-weight: 400;
  font-style: normal;
  src: local("Inter"), local("Inter-Regular"), local("Inter UI");
}

@font-face {
  font-family: Inter;
  font-weight: 500;
  font-style: normal;
  src: local("Inter Medium"), local("Inter-Medium");
}

@font-face {
  font-family: Inter;
  font-weight: 600;
  font-style: normal;
  src: local("Inter SemiBold"), local("Inter-SemiBold");
}
`;

export class ReplaceFigmaFontsPlugin {
	apply(compiler: Compiler) {
		compiler.hooks.thisCompilation.tap(
			'ReplaceFigmaFontsPlugin',
			(compilation: Compilation) => {
				compilation.hooks.processAssets.tap(
					{
						name: 'ReplaceFigmaFontsPlugin',
						stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
					},
					(assets) => {
						for (const [filename, asset] of Object.entries(assets)) {
							if (!filename.endsWith('.css')) {
								continue;
							}

							const source = asset.source().toString();

							if (!source.includes('rsms.me/inter')) {
								continue;
							}

							const css =
								LOCAL_FONT_FACES +
								'\n' +
								source.replace(INTER_FONT_FACE_REGEX, '');

							compilation.updateAsset(filename, new sources.RawSource(css));
						}
					},
				);
			},
		);
	}
}

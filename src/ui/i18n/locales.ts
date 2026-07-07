export const LOCALES: Record<string, Record<string, string>> = {
	en: {
		'ui.toast_lang_changed': 'Language: {lang}',
		'ui.toast_theme_changed': 'Theme: {theme}',
		'ui.back': 'Back',
		'ui.step_export': 'Export',
		'ui.step_review': 'Review',
		'ui.step_optimize': 'Optimize',
		'ui.empty_state': 'Select objects on canvas to analyze and export',
		'ui.analysis_title': 'Content Analysis',
		'ui.analysis_aria': 'Content analysis result',
		'ui.format_label': 'Export Format',
		'ui.density_label': 'Pixel Density',
		'ui.export_btn': 'Export',
		'ui.export_aria': 'Export selected objects',
		'ui.warning_title': 'Suboptimal Export Format',
		'ui.warning_continue': 'Continue as is',
		'ui.warning_change': 'Change format',
		'ui.png_confirm_title': 'Confirm PNG Selection',
		'ui.png_confirm_text1':
			'You selected PNG for content containing raster images. The plugin cannot automatically detect transparency in such images.',
		'ui.png_confirm_text2':
			'Are you sure these images need transparency for use in layout?',
		'ui.png_confirm_text3':
			'If transparency is not needed, JPG will provide a smaller file size without quality loss.',
		'ui.png_confirm_btn': 'Confirm PNG',
		'ui.png_switch_jpg': 'Switch to JPG',
		'ui.optimize_title': 'Optimize Your Image',
		'ui.optimize_text':
			'File exported successfully! We recommend optimizing it to reduce file size without visible quality loss.',
		'ui.optimize_got_it': 'Got it',
		'ui.toast_format_changed': 'Format changed to {format}',
		'ui.row_objects': 'Objects',
		'ui.row_content_type': 'Content type',
		'ui.row_recommended': 'Recommended format',
		'ui.content_vector': 'Vector graphics',
		'ui.content_raster_transparency': 'Raster + transparency/effects',
		'ui.content_raster_plain': 'Raster (no transparency)',
		'ui.opt_svgomg': 'SVG optimization: remove metadata, clean up code',
		'ui.opt_tinypng': 'PNG and JPG compression with smart quality loss',
		'ui.opt_squoosh': 'Image compression with visual comparison',
		'ui.opt_compressor': 'PNG and JPG compression: lossless and lossy modes',

		'reason.node_opacity': 'Node opacity < 1',
		'reason.fill_alpha': 'Fill with alpha channel',
		'reason.stroke_alpha': 'Stroke with alpha channel',
		'reason.effect_drop_shadow': 'Drop Shadow effect',
		'reason.effect_inner_shadow': 'Inner Shadow effect',
		'reason.effect_layer_blur': 'Layer Blur effect',
		'reason.effect_background_blur': 'Background Blur effect',
		'reason.node_is_mask': 'Node is a mask',

		'desc.mixed_content_svg':
			'Selection contains mixed content (vector + raster). SVG does not support raster elements. PNG is recommended.',
		'desc.mixed_content_jpg':
			'Selection contains mixed content (vector + raster). JPG does not support vector elements. PNG is recommended.',
		'desc.mixed_content_png':
			'Selection contains mixed content (vector + raster). PNG is recommended as a universal format for both types.',
		'desc.vector_not_svg':
			'Content is vector graphics. SVG is recommended to preserve scalability without quality loss.',
		'desc.raster_transparency_jpg':
			'JPG does not support transparency. Effects requiring alpha channel detected. PNG is recommended.',
		'desc.raster_transparency_svg':
			'SVG is not optimal for raster content with transparency. PNG is recommended.',
		'desc.raster_image_svg':
			'SVG is not suitable for raster images. JPG is recommended (or PNG if images contain transparency).',
		'desc.raster_no_transparency_png':
			'Content has no transparency or alpha-channel effects. JPG will provide a smaller file size without quality loss.',
		'desc.raster_no_transparency_svg':
			'SVG is not optimal for raster content without transparency. JPG is recommended for a smaller file size.',
		'desc.generic_mismatch':
			'The selected format is not optimal for this content.',
	},
	ru: {
		'ui.toast_lang_changed': 'Язык: {lang}',
		'ui.toast_theme_changed': 'Тема: {theme}',
		'ui.back': 'Назад',
		'ui.step_export': 'Экспорт',
		'ui.step_review': 'Проверка',
		'ui.step_optimize': 'Оптимизация',
		'ui.empty_state': 'Выделите объекты на холсте для анализа и экспорта',
		'ui.analysis_title': 'Анализ содержимого',
		'ui.analysis_aria': 'Результат анализа содержимого',
		'ui.format_label': 'Формат экспорта',
		'ui.density_label': 'Плотность пикселей',
		'ui.export_btn': 'Экспортировать',
		'ui.export_aria': 'Экспортировать выделенные объекты',
		'ui.warning_title': 'Неоптимальный формат экспорта',
		'ui.warning_continue': 'Продолжить как есть',
		'ui.warning_change': 'Изменить формат',
		'ui.png_confirm_title': 'Подтвердите выбор PNG',
		'ui.png_confirm_text1':
			'Вы выбрали формат PNG для контента, содержащего растровые изображения. Плагин не может автоматически определить наличие прозрачности в таких изображениях.',
		'ui.png_confirm_text2':
			'Уверены, что изображениям необходима прозрачность для использования в вёрстке?',
		'ui.png_confirm_text3':
			'Если прозрачность не нужна — JPG обеспечит меньший размер файла без потери качества.',
		'ui.png_confirm_btn': 'Подтвердить PNG',
		'ui.png_switch_jpg': 'Переключить на JPG',
		'ui.optimize_title': 'Оптимизируйте изображение',
		'ui.optimize_text':
			'Файл успешно экспортирован! Рекомендуем оптимизировать его для уменьшения размера без видимой потери качества.',
		'ui.optimize_got_it': 'Понятно',
		'ui.toast_format_changed': 'Формат изменён на {format}',
		'ui.row_objects': 'Объектов',
		'ui.row_content_type': 'Тип контента',
		'ui.row_recommended': 'Рекомендуемый формат',
		'ui.content_vector': 'Векторная графика',
		'ui.content_raster_transparency': 'Растр + прозрачность/эффекты',
		'ui.content_raster_plain': 'Растр (без прозрачности)',
		'ui.opt_svgomg': 'Оптимизация SVG: удаление метаданных, очистка кода',
		'ui.opt_tinypng': 'Сжатие PNG и JPG с умной потерей качества',
		'ui.opt_squoosh': 'Сжатие изображений с визуальным сравнением',
		'ui.opt_compressor': 'Сжатие PNG и JPG: lossless и lossy режимы',

		'reason.node_opacity': 'Прозрачность узла (opacity < 1)',
		'reason.fill_alpha': 'Заливка с альфа-каналом',
		'reason.stroke_alpha': 'Обводка с альфа-каналом',
		'reason.effect_drop_shadow': 'Эффект тени (Drop Shadow)',
		'reason.effect_inner_shadow': 'Эффект внутренней тени (Inner Shadow)',
		'reason.effect_layer_blur': 'Эффект размытия слоя (Layer Blur)',
		'reason.effect_background_blur': 'Эффект размытия фона (Background Blur)',
		'reason.node_is_mask': 'Узел является маской',

		'desc.mixed_content_svg':
			'Выделение содержит смешанный контент (вектор + растр). SVG не подходит для растровых элементов. Рекомендуется PNG.',
		'desc.mixed_content_jpg':
			'Выделение содержит смешанный контент (вектор + растр). JPG не подходит для векторных элементов. Рекомендуется PNG.',
		'desc.mixed_content_png':
			'Выделение содержит смешанный контент (вектор + растр). Рекомендуется PNG как универсальный формат для обоих типов.',
		'desc.vector_not_svg':
			'Содержимое является векторной графикой. Рекомендуется SVG для сохранения масштабируемости без потери качества.',
		'desc.raster_transparency_jpg':
			'JPG не поддерживает прозрачность. Обнаружены эффекты, требующие альфа-канала. Рекомендуется PNG.',
		'desc.raster_transparency_svg':
			'SVG не оптимален для растрового контента с прозрачностью. Рекомендуется PNG.',
		'desc.raster_image_svg':
			'SVG не подходит для растровых изображений. Рекомендуется JPG (или PNG, если изображения содержат прозрачность).',
		'desc.raster_no_transparency_png':
			'Контент не содержит прозрачности или эффектов с альфа-каналом. JPG обеспечит меньший размер файла без потери качества.',
		'desc.raster_no_transparency_svg':
			'SVG не оптимален для растрового контента без прозрачности. Рекомендуется JPG для меньшего размера файла.',
		'desc.generic_mismatch':
			'Выбранный формат не является оптимальным для данного контента.',
	},
};
